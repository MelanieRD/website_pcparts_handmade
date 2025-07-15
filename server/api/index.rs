use vercel_runtime::{run, Body, Error, Request, Response};
use serde_json::{json, Value};
use std::env;
use mongodb::{Client, Database};
use std::sync::Arc;

mod models;
mod services;
mod auth;

use models::{Product, HandmadeProduct, Build, User, CreateProductRequest, CreateHandmadeProductRequest, CreateBuildRequest, UpdateProductRequest, UpdateHandmadeProductRequest, Sale, CreateSaleRequest};
use services::{ProductService, HandmadeService, BuildService, SaleService};
use auth::{AuthService, LoginRequest, RegisterRequest, AuthResponse};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

async fn handler(req: Request) -> Result<Response<Body>, Error> {
    // Set up CORS headers
    let mut response_builder = Response::builder()
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle OPTIONS requests for CORS
    if req.method() == "OPTIONS" {
        return Ok(response_builder
            .status(200)
            .body(Body::from(""))?);
    }

    // Get path and method
    let path = req.uri().path();
    let method = req.method().as_str();

    // Initialize database connection
    let mongodb_uri = env::var("MONGODB_URI")
        .unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    
    let client = Client::with_uri_str(&mongodb_uri)
        .await
        .map_err(|e| Error::from(format!("MongoDB connection error: {}", e)))?;
    
    let db = client.database("cyborgtech");
    
    // Initialize services
    let product_service = ProductService::new(db.clone());
    let handmade_service = HandmadeService::new(db.clone());
    let build_service = BuildService::new(db.clone());
    let sale_service = SaleService::new(db.clone());
    
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "your-secret-key".to_string());
    let auth_service = AuthService::new(db.collection::<User>("users"), jwt_secret);

    // Route the request
    match (method, path) {
        ("GET", "/") => {
            Ok(response_builder
                .status(200)
                .header("Content-Type", "application/json")
                .body(Body::from(json!({
                    "message": "CyborgTech API Server - Welcome!",
                    "status": "running"
                }).to_string()))?)
        },
        
        ("GET", "/api/health") => {
            Ok(response_builder
                .status(200)
                .header("Content-Type", "application/json")
                .body(Body::from(json!({
                    "status": "healthy",
                    "timestamp": chrono::Utc::now().to_rfc3339(),
                    "service": "cyborgtech-api"
                }).to_string()))?)
        },

        // Product endpoints
        ("GET", "/api/products") => {
            match product_service.get_all_products().await {
                Ok(products) => Ok(response_builder
                    .status(200)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::to_string(&products).unwrap()))?),
                Err(e) => Ok(response_builder
                    .status(500)
                    .header("Content-Type", "application/json")
                    .body(Body::from(json!({"error": e.to_string()}).to_string()))?)
            }
        },

        // Handmade endpoints
        ("GET", "/api/handmade") => {
            match handmade_service.get_all_handmade().await {
                Ok(products) => Ok(response_builder
                    .status(200)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::to_string(&products).unwrap()))?),
                Err(e) => Ok(response_builder
                    .status(500)
                    .header("Content-Type", "application/json")
                    .body(Body::from(json!({"error": e.to_string()}).to_string()))?)
            }
        },

        // Build endpoints
        ("GET", "/api/builds") => {
            match build_service.get_all_builds().await {
                Ok(builds) => Ok(response_builder
                    .status(200)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::to_string(&builds).unwrap()))?),
                Err(e) => Ok(response_builder
                    .status(500)
                    .header("Content-Type", "application/json")
                    .body(Body::from(json!({"error": e.to_string()}).to_string()))?)
            }
        },

        // Auth endpoints
        ("POST", "/api/auth/login") => {
            let body = get_request_body(req).await?;
            match serde_json::from_str::<LoginRequest>(&body) {
                Ok(login_request) => {
                    match auth_service.login(login_request).await {
                        Ok(response) => Ok(response_builder
                            .status(200)
                            .header("Content-Type", "application/json")
                            .body(Body::from(serde_json::to_string(&response).unwrap()))?),
                        Err(e) => Ok(response_builder
                            .status(401)
                            .header("Content-Type", "application/json")
                            .body(Body::from(json!({"error": e.to_string()}).to_string()))?)
                    }
                }
                Err(e) => Ok(response_builder
                    .status(400)
                    .header("Content-Type", "application/json")
                    .body(Body::from(json!({"error": e.to_string()}).to_string()))?)
            }
        },

        ("POST", "/api/auth/register") => {
            let body = get_request_body(req).await?;
            match serde_json::from_str::<RegisterRequest>(&body) {
                Ok(register_request) => {
                    match auth_service.register(register_request).await {
                        Ok(response) => Ok(response_builder
                            .status(200)
                            .header("Content-Type", "application/json")
                            .body(Body::from(serde_json::to_string(&response).unwrap()))?),
                        Err(e) => Ok(response_builder
                            .status(400)
                            .header("Content-Type", "application/json")
                            .body(Body::from(json!({"error": e.to_string()}).to_string()))?)
                    }
                }
                Err(e) => Ok(response_builder
                    .status(400)
                    .header("Content-Type", "application/json")
                    .body(Body::from(json!({"error": e.to_string()}).to_string()))?)
            }
        },

        // Catch-all for unknown routes
        _ => {
            Ok(response_builder
                .status(404)
                .header("Content-Type", "application/json")
                .body(Body::from(json!({
                    "error": "Not found",
                    "path": path,
                    "method": method
                }).to_string()))?)
        }
    }
}

async fn get_request_body(req: Request) -> Result<String, Error> {
    let body = req.body();
    let body_bytes = match body {
        Body::Binary(bytes) => bytes,
        Body::Text(text) => text.into_bytes(),
        Body::Empty => vec![],
    };
    
    String::from_utf8(body_bytes)
        .map_err(|e| Error::from(format!("Invalid UTF-8 in request body: {}", e)))
} 