use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: String,
    pub email: String,
    pub password: String,
    pub name: String,
    pub role: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: String,
    pub name: MultiLanguageText,
    pub description: MultiLanguageText,
    pub price: String,
    pub thumbnail_image: String,  // Main thumbnail image
    pub category: String,
    pub subcategory: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub feature_images: Option<Vec<String>>,  // Additional feature images
    #[serde(skip_serializing_if = "Option::is_none")]
    pub specs: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,  // Stock quantity
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when product was acquired
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_new: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_popular: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateProductRequest {
    pub name: MultiLanguageText,
    pub description: MultiLanguageText,
    pub price: String,
    pub thumbnail_image: String,  // Main thumbnail image
    pub category: String,
    pub subcategory: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub feature_images: Option<Vec<String>>,  // Additional feature images
    #[serde(skip_serializing_if = "Option::is_none")]
    pub specs: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,  // Stock quantity
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when product was acquired
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_new: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_popular: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HandmadeProduct {
    pub id: String,
    pub name: MultiLanguageText,
    pub description: MultiLanguageText,
    pub long_description: MultiLanguageText,
    pub price: String,
    pub thumbnail_image: String,  // Main thumbnail image
    pub feature_images: Vec<String>,  // Additional feature images
    pub category: String,
    pub subcategory: String,
    pub specs: HashMap<String, String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,  // Stock quantity
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when product was acquired
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateHandmadeProductRequest {
    pub name: MultiLanguageText,
    pub description: MultiLanguageText,
    pub long_description: MultiLanguageText,
    pub price: String,
    pub thumbnail_image: String,  // Main thumbnail image
    pub feature_images: Vec<String>,  // Additional feature images
    pub category: String,
    pub subcategory: String,
    pub specs: HashMap<String, String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,  // Stock quantity
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when product was acquired
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Build {
    pub id: String,
    pub name: MultiLanguageText,
    pub description: MultiLanguageText,
    pub long_description: MultiLanguageText,
    pub price: String,
    pub thumbnail_image: String,  // Main thumbnail image
    pub feature_images: Vec<String>,  // Additional feature images
    pub category: String,
    pub subcategory: String,
    pub specs: HashMap<String, String>,
    pub components: Vec<BuildComponent>,  // List of components used in the build
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,  // Stock quantity
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when build was created
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BuildComponent {
    pub product_id: String,  // Reference to a product
    pub quantity: i32,       // Quantity of this component
    pub notes: Option<String>,  // Optional notes about this component
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateBuildRequest {
    pub name: MultiLanguageText,
    pub description: MultiLanguageText,
    pub long_description: MultiLanguageText,
    pub price: String,
    pub thumbnail_image: String,  // Main thumbnail image
    pub feature_images: Vec<String>,  // Additional feature images
    pub category: String,
    pub subcategory: String,
    pub specs: HashMap<String, String>,
    pub components: Vec<BuildComponent>,  // List of components used in the build
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,  // Stock quantity
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when build was created
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MultiLanguageText {
    pub es: String,
    pub en: String,
    pub fr: String,
}

impl MultiLanguageText {
    #[allow(dead_code)]
    pub fn get_text(&self, language: &str) -> &str {
        match language {
            "es" => &self.es,
            "en" => &self.en,
            "fr" => &self.fr,
            _ => &self.en, // Default to English
        }
    }
} 