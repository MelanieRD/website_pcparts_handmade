use vercel_runtime::{run, Body, Error, Request, Response};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let path = req.uri().path();
    
    match path {
        "/" => {
            Ok(Response::builder()
                .status(200)
                .header("Content-Type", "application/json")
                .body(Body::from(json!({
                    "message": "CyborgTech API Serverless - Welcome!",
                    "status": "running"
                }).to_string()))?)
        }
        "/api/health" => {
            Ok(Response::builder()
                .status(200)
                .header("Content-Type", "application/json")
                .body(Body::from(json!({
                    "status": "healthy",
                    "timestamp": chrono::Utc::now().to_rfc3339(),
                    "service": "cyborgtech-api-serverless"
                }).to_string()))?)
        }
        _ => {
            Ok(Response::builder()
                .status(404)
                .header("Content-Type", "application/json")
                .body(Body::from(json!({
                    "error": "Not found",
                    "path": path
                }).to_string()))?)
        }
    }
} 