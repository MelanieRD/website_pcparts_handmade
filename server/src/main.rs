use axum::{
    extract::State,
    http::{Method, StatusCode},
    response::Json,
    routing::{get, post, put, delete},
    Router,
};
use dotenv::dotenv;
use mongodb::{Client, Database};
use serde_json::Value;
use std::env;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;

mod models;
mod services;
mod auth;

use models::{Product, HandmadeProduct, User, CreateProductRequest};
use services::{ProductService, HandmadeService};
use auth::{AuthService, LoginRequest, RegisterRequest, AuthResponse, auth_middleware, admin_middleware};

struct AppState {
    db: Database,
    auth_service: Arc<AuthService>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment variables
    dotenv().ok();
    
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    info!("Starting CyborgTech Server...");
    
    // Get MongoDB connection string from environment
    let mongo_uri = env::var("MONGODB_URI")
        .expect("MONGODB_URI must be set in environment variables");
    
    // Get JWT secret from environment
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "your-secret-key".to_string());
    
    // Connect to MongoDB
    let client = Client::with_uri_str(&mongo_uri).await?;
    let db = client.database("cyborgtech");
    
    info!("Connected to MongoDB Atlas");
    
    // Initialize services (used in route handlers)
    let _product_service = ProductService::new(db.clone());
    let _handmade_service = HandmadeService::new(db.clone());
    let auth_service = AuthService::new(db.collection::<User>("users"), jwt_secret);
    
    // Seed admin user
    auth_service.seed_admin_user().await?;
    
    // Create app state
    let state = Arc::new(AppState { 
        db,
        auth_service: Arc::new(auth_service),
    });
    
    // Configure CORS
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_origin(Any)
        .allow_headers(Any);
    
    // Create router
    let app = Router::new()
        .route("/", get(root))
        .route("/api/health", get(health_check))
        .route("/api/products", get(get_all_products))
        .route("/api/products/{id}", get(get_product_by_id))
        .route("/api/products/category/{category}", get(get_products_by_category))
        .route("/api/handmade", get(get_all_handmade))
        .route("/api/handmade/{id}", get(get_handmade_by_id))
        .route("/api/handmade/category/{category}", get(get_handmade_by_category))
        .route("/api/seed", post(seed_database))
        // Auth routes
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/auth/me", get(get_current_user).layer(axum::middleware::from_fn_with_state(state.clone(), auth_middleware)))
        // Admin routes (protected with auth and admin middleware)
        .nest("/api/admin", Router::new()
            .route("/test", get(test_admin))
            .route("/products", get(get_all_products_admin))
            .route("/products", post(create_product))
            .route("/products/{id}", put(update_product))
            .route("/products/{id}", delete(delete_product))
            .route("/handmade", get(get_all_handmade_admin))
            .route("/handmade", post(create_handmade))
            .route("/handmade/{id}", put(update_handmade))
            .route("/handmade/{id}", delete(delete_handmade))
            .layer(axum::middleware::from_fn(admin_middleware))
            .layer(axum::middleware::from_fn_with_state(state.clone(), auth_middleware))
        )
        .layer(cors)
        .with_state(state);
    
    let addr = "127.0.0.1:3001";
    info!("Server listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;
    
    Ok(())
}

async fn root() -> &'static str {
    "CyborgTech API Server - Welcome!"
}

async fn health_check() -> Json<Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "service": "cyborgtech-api"
    }))
}

async fn get_all_products(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Product>>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    match product_service.get_all_products().await {
        Ok(products) => Ok(Json(products)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_product_by_id(
    axum::extract::Path(id): axum::extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Option<Product>>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    match product_service.get_product_by_id(&id).await {
        Ok(product) => Ok(Json(product)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_products_by_category(
    axum::extract::Path(category): axum::extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Product>>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    match product_service.get_products_by_category(&category).await {
        Ok(products) => Ok(Json(products)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_all_handmade(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<HandmadeProduct>>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    match handmade_service.get_all_handmade().await {
        Ok(products) => Ok(Json(products)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_handmade_by_id(
    axum::extract::Path(id): axum::extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Option<HandmadeProduct>>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    match handmade_service.get_handmade_by_id(&id).await {
        Ok(product) => Ok(Json(product)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_handmade_by_category(
    axum::extract::Path(category): axum::extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<HandmadeProduct>>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    match handmade_service.get_handmade_by_category(&category).await {
        Ok(products) => Ok(Json(products)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn seed_database(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Value>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    let handmade_service = HandmadeService::new(state.db.clone());
    
    match product_service.seed_products().await {
        Ok(_) => {
            match handmade_service.seed_handmade().await {
                Ok(_) => Ok(Json(serde_json::json!({
                    "message": "Database seeded successfully",
                    "timestamp": chrono::Utc::now().to_rfc3339()
                }))),
                Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
            }
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

// Auth handlers
async fn register(
    State(state): State<Arc<AppState>>,
    Json(req): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    match state.auth_service.register(req).await {
        Ok(response) => Ok(Json(response)),
        Err(_) => Err(StatusCode::BAD_REQUEST),
    }
}

async fn login(
    State(state): State<Arc<AppState>>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    match state.auth_service.login(req).await {
        Ok(response) => Ok(Json(response)),
        Err(_) => Err(StatusCode::UNAUTHORIZED),
    }
}

async fn get_current_user(
    State(_state): State<Arc<AppState>>,
    axum::extract::Extension(user): axum::extract::Extension<User>,
) -> Result<Json<auth::UserResponse>, StatusCode> {
    Ok(Json(auth::UserResponse {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    }))
}

// Admin handlers
async fn test_admin(
    State(_state): State<Arc<AppState>>,
    axum::extract::Extension(user): axum::extract::Extension<User>,
) -> Result<Json<Value>, StatusCode> {
    Ok(Json(serde_json::json!({
        "message": "Admin access successful!",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    })))
}

async fn get_all_products_admin(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
) -> Result<Json<Vec<Product>>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    match product_service.get_all_products().await {
        Ok(products) => Ok(Json(products)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_all_handmade_admin(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
) -> Result<Json<Vec<HandmadeProduct>>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    match handmade_service.get_all_handmade().await {
        Ok(products) => Ok(Json(products)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn create_product(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    Json(product_request): Json<CreateProductRequest>,
) -> Result<Json<Value>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    
    // Create a Product with generated ID
    let product = Product {
        id: uuid::Uuid::new_v4().to_string(),
        name: product_request.name,
        description: product_request.description,
        price: product_request.price,
        image: product_request.image,
        category: product_request.category,
        subcategory: product_request.subcategory,
        original_price: product_request.original_price,
        images: product_request.images,
        specs: product_request.specs,
        brand: product_request.brand,
        is_new: product_request.is_new,
        is_popular: product_request.is_popular,
        is_offer: product_request.is_offer,
    };
    
    match product_service.create_product(product).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Product created successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn update_product(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(product): Json<Product>,
) -> Result<Json<Value>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    match product_service.update_product(&id, product).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Product updated successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn delete_product(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let product_service = ProductService::new(state.db.clone());
    match product_service.delete_product(&id).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Product deleted successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn create_handmade(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    Json(handmade): Json<HandmadeProduct>,
) -> Result<Json<Value>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    match handmade_service.create_handmade(handmade).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Handmade product created successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn update_handmade(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(handmade): Json<HandmadeProduct>,
) -> Result<Json<Value>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    match handmade_service.update_handmade(&id, handmade).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Handmade product updated successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn delete_handmade(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    match handmade_service.delete_handmade(&id).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Handmade product deleted successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
} 