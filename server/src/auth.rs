use crate::models::User;
use anyhow::Result;
use axum::{
    extract::State,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
    body::Body,
};
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use mongodb::{
    bson::doc,
    Collection,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // User ID
    pub exp: usize,  // Expiration time
    pub iat: usize,  // Issued at
    pub role: String, // User role
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub name: String,
    pub role: String,
}

pub struct AuthService {
    collection: Collection<User>,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(collection: Collection<User>, jwt_secret: String) -> Self {
        Self {
            collection,
            jwt_secret,
        }
    }

    pub async fn register(&self, req: RegisterRequest) -> Result<AuthResponse> {
        // Check if user already exists
        let existing_user = self
            .collection
            .find_one(doc! { "email": &req.email })
            .await?;

        if existing_user.is_some() {
            return Err(anyhow::anyhow!("User already exists"));
        }

        // Hash password
        let hashed_password = hash(req.password.as_bytes(), DEFAULT_COST)?;

        // Create user
        let user = User {
            id: uuid::Uuid::new_v4().to_string(),
            email: req.email,
            password: hashed_password,
            name: req.name,
            role: "user".to_string(),
            created_at: chrono::Utc::now(),
        };

        // Insert user into database
        self.collection.insert_one(&user).await?;

        // Generate JWT token
        let token = self.generate_token(&user)?;

        Ok(AuthResponse {
            token,
            user: user.clone(),
        })
    }

    pub async fn login(&self, req: LoginRequest) -> Result<AuthResponse> {
        // Find user by email
        let user = self
            .collection
            .find_one(doc! { "email": &req.email })
            .await?
            .ok_or_else(|| anyhow::anyhow!("Invalid credentials"))?;

        // Verify password
        let is_valid = verify(req.password.as_bytes(), &user.password)?;
        if !is_valid {
            return Err(anyhow::anyhow!("Invalid credentials"));
        }

        // Generate JWT token
        let token = self.generate_token(&user)?;

        Ok(AuthResponse {
            token,
            user: user.clone(),
        })
    }

    pub fn verify_token(&self, token: &str) -> Result<Claims> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_ref()),
            &Validation::default(),
        )?;

        Ok(token_data.claims)
    }

    fn generate_token(&self, user: &User) -> Result<String> {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)?
            .as_secs() as usize;

        let claims = Claims {
            sub: user.id.clone(),
            exp: now + (24 * 60 * 60), // 24 hours
            iat: now,
            role: user.role.clone(),
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_ref()),
        )?;

        Ok(token)
    }

    pub async fn get_user_by_id(&self, user_id: &str) -> Result<Option<User>> {
        let user = self
            .collection
            .find_one(doc! { "id": user_id })
            .await?;

        Ok(user)
    }

    pub async fn seed_admin_user(&self) -> Result<()> {
        // Check if admin user already exists
        let existing_admin = self
            .collection
            .find_one(doc! { "email": "admin@cyborgtech.com" })
            .await?;

        if existing_admin.is_none() {
            // Create admin user
            let hashed_password = hash("admin123", DEFAULT_COST)?;
            let admin_user = User {
                id: uuid::Uuid::new_v4().to_string(),
                email: "admin@cyborgtech.com".to_string(),
                password: hashed_password,
                name: "Admin".to_string(),
                role: "admin".to_string(),
                created_at: chrono::Utc::now(),
            };

            self.collection.insert_one(&admin_user).await?;
            tracing::info!("Admin user created: admin@cyborgtech.com / admin123");
        }

        // Check if melanie admin user already exists
        let existing_melanie = self
            .collection
            .find_one(doc! { "email": "melanie@cyborgtech.com" })
            .await?;

        if existing_melanie.is_none() {
            // Create melanie admin user
            let hashed_password = hash("melanie", DEFAULT_COST)?;
            let melanie_user = User {
                id: uuid::Uuid::new_v4().to_string(),
                email: "melanie@cyborgtech.com".to_string(),
                password: hashed_password,
                name: "Melanie".to_string(),
                role: "admin".to_string(),
                created_at: chrono::Utc::now(),
            };

            self.collection.insert_one(&melanie_user).await?;
            tracing::info!("Admin user created: melanie@cyborgtech.com / melanie");
        }

        Ok(())
    }
}

// Middleware to extract user from JWT token
pub async fn auth_middleware(
    State(state): State<Arc<crate::AppState>>,
    mut request: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    tracing::info!("Auth middleware: Processing request");
    
    let auth_header = request
        .headers()
        .get("Authorization")
        .and_then(|header| header.to_str().ok())
        .and_then(|header| header.strip_prefix("Bearer "));

    if let Some(token) = auth_header {
        tracing::info!("Auth middleware: Token found, verifying...");
        match state.auth_service.verify_token(token) {
            Ok(claims) => {
                tracing::info!("Auth middleware: Token verified, getting user from DB");
                // Get user from database
                match state.auth_service.get_user_by_id(&claims.sub).await {
                    Ok(Some(user)) => {
                        tracing::info!("Auth middleware: User found - ID: {}, Role: {}", user.id, user.role);
                        request.extensions_mut().insert(user);
                        Ok(next.run(request).await)
                    }
                    Ok(None) => {
                        tracing::error!("Auth middleware: User not found in database");
                        Err(StatusCode::UNAUTHORIZED)
                    }
                    Err(e) => {
                        tracing::error!("Auth middleware: Database error: {:?}", e);
                        Err(StatusCode::UNAUTHORIZED)
                    }
                }
            }
            Err(e) => {
                tracing::error!("Auth middleware: Token verification failed: {:?}", e);
                Err(StatusCode::UNAUTHORIZED)
            }
        }
    } else {
        tracing::error!("Auth middleware: No Authorization header found");
        Err(StatusCode::UNAUTHORIZED)
    }
}

// Middleware to check if user is admin
pub async fn admin_middleware(
    request: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    tracing::info!("Admin middleware: Checking user permissions");
    
    let user = request
        .extensions()
        .get::<User>()
        .ok_or_else(|| {
            tracing::error!("Admin middleware: No user found in extensions");
            StatusCode::UNAUTHORIZED
        })?;

    tracing::info!("Admin middleware: User found - ID: {}, Role: {}", user.id, user.role);

    if user.role != "admin" {
        tracing::error!("Admin middleware: User role '{}' is not admin", user.role);
        return Err(StatusCode::FORBIDDEN);
    }

    tracing::info!("Admin middleware: User is admin, proceeding");
    Ok(next.run(request).await)
} 