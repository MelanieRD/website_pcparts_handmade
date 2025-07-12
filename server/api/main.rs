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

use models::{Product, HandmadeProduct, Build, User, CreateProductRequest, CreateHandmadeProductRequest, CreateBuildRequest};
use services::{ProductService, HandmadeService, BuildService};
use auth::{AuthService, LoginRequest, RegisterRequest, AuthResponse, auth_middleware, auth_admin_middleware, admin_middleware};

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
        .route("/api/builds", get(get_all_builds))
        .route("/api/builds/{id}", get(get_build_by_id))
        .route("/api/builds/category/{category}", get(get_builds_by_category))
        .route("/api/seed", post(seed_database))
        // Auth routes
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/auth/me", get(get_current_user).layer(axum::middleware::from_fn_with_state(state.clone(), auth_middleware)))
        // Admin routes (protected with combined auth-admin middleware)
        .nest("/api/admin", Router::new()
            .route("/products", get(get_all_products_admin))
            .route("/products", post(create_product))
            .route("/products/{id}", put(update_product))
            .route("/products/{id}", delete(delete_product))
            .route("/handmade", get(get_all_handmade_admin))
            .route("/handmade", post(create_handmade))
            .route("/handmade/{id}", put(update_handmade))
            .route("/handmade/{id}", delete(delete_handmade))
            .route("/builds", get(get_all_builds_admin))
            .route("/builds", post(create_build))
            .route("/builds/{id}", put(update_build))
            .route("/builds/{id}", delete(delete_build))
            .layer(axum::middleware::from_fn_with_state(state.clone(), auth_admin_middleware))
        )
        .layer(cors)
        .with_state(state);
    
    let addr = "[::]:3001";
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

// Build handlers
async fn get_all_builds(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Build>>, StatusCode> {
    let build_service = BuildService::new(state.db.clone());
    match build_service.get_all_builds().await {
        Ok(builds) => Ok(Json(builds)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_build_by_id(
    axum::extract::Path(id): axum::extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Option<Build>>, StatusCode> {
    let build_service = BuildService::new(state.db.clone());
    match build_service.get_build_by_id(&id).await {
        Ok(build) => Ok(Json(build)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_builds_by_category(
    axum::extract::Path(category): axum::extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Build>>, StatusCode> {
    let build_service = BuildService::new(state.db.clone());
    match build_service.get_builds_by_category(&category).await {
        Ok(builds) => Ok(Json(builds)),
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
    
    // Convert CreateProductRequest to Product with generated ID
    let now = chrono::Utc::now();
    let product = Product {
        id: uuid::Uuid::new_v4().to_string(),
        name: product_request.name,
        description: product_request.description,
        price: product_request.price,
        thumbnail_image: product_request.thumbnail_image,
        category: product_request.category,
        subcategory: product_request.subcategory,
        original_price: product_request.original_price,
        feature_images: product_request.feature_images,
        specs: product_request.specs,
        brand: product_request.brand,
        stock: product_request.stock,
        acquisition_date: product_request.acquisition_date,
        is_new: product_request.is_new,
        is_popular: product_request.is_popular,
        is_offer: product_request.is_offer,
        created_at: now,
        updated_at: now,
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
    Json(handmade_request): Json<CreateHandmadeProductRequest>,
) -> Result<Json<Value>, StatusCode> {
    let handmade_service = HandmadeService::new(state.db.clone());
    
    // Convert CreateHandmadeProductRequest to HandmadeProduct with generated ID
    let now = chrono::Utc::now();
    let handmade = HandmadeProduct {
        id: uuid::Uuid::new_v4().to_string(),
        name: handmade_request.name,
        description: handmade_request.description,
        long_description: handmade_request.long_description,
        price: handmade_request.price,
        thumbnail_image: handmade_request.thumbnail_image,
        feature_images: handmade_request.feature_images,
        category: handmade_request.category,
        subcategory: handmade_request.subcategory,
        specs: handmade_request.specs,
        original_price: handmade_request.original_price,
        stock: handmade_request.stock,
        acquisition_date: handmade_request.acquisition_date,
        is_offer: handmade_request.is_offer,
        created_at: now,
        updated_at: now,
    };
    
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

// Admin build handlers
async fn get_all_builds_admin(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
) -> Result<Json<Vec<Build>>, StatusCode> {
    let build_service = BuildService::new(state.db.clone());
    match build_service.get_all_builds().await {
        Ok(builds) => Ok(Json(builds)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn create_build(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    Json(build_request): Json<CreateBuildRequest>,
) -> Result<Json<Value>, StatusCode> {
    let build_service = BuildService::new(state.db.clone());
    
    // Convert CreateBuildRequest to Build with generated ID
    let now = chrono::Utc::now();
    let build = Build {
        id: uuid::Uuid::new_v4().to_string(),
        name: build_request.name,
        description: build_request.description,
        long_description: build_request.long_description,
        price: build_request.price,
        thumbnail_image: build_request.thumbnail_image,
        feature_images: build_request.feature_images,
        category: build_request.category,
        subcategory: build_request.subcategory,
        specs: build_request.specs,
        components: build_request.components,
        original_price: build_request.original_price,
        stock: build_request.stock,
        acquisition_date: build_request.acquisition_date,
        is_offer: build_request.is_offer,
        created_at: now,
        updated_at: now,
    };
    
    match build_service.create_build(build).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Build created successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn update_build(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(build): Json<Build>,
) -> Result<Json<Value>, StatusCode> {
    let build_service = BuildService::new(state.db.clone());
    match build_service.update_build(&id, build).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Build updated successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn delete_build(
    State(state): State<Arc<AppState>>,
    axum::extract::Extension(_user): axum::extract::Extension<User>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let build_service = BuildService::new(state.db.clone());
    match build_service.delete_build(&id).await {
        Ok(_) => Ok(Json(serde_json::json!({
            "message": "Build deleted successfully"
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
} 