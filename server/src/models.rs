use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};

// Custom deserializer for DateTime from string
fn deserialize_date_time<'de, D>(deserializer: D) -> Result<Option<DateTime<Utc>>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    use serde::de::Error;
    
    let value = serde_json::Value::deserialize(deserializer)?;
    
    match value {
        serde_json::Value::String(s) => {
            if s.is_empty() {
                return Ok(None);
            }
            
            // Try to parse as ISO 8601 format first
            if let Ok(dt) = DateTime::parse_from_rfc3339(&s) {
                return Ok(Some(dt.with_timezone(&Utc)));
            }
            
            // Try to parse as date only (YYYY-MM-DD)
            if let Ok(dt) = chrono::NaiveDate::parse_from_str(&s, "%Y-%m-%d") {
                return Ok(Some(dt.and_hms_opt(0, 0, 0).unwrap().and_utc()));
            }
            
            Err(Error::custom(format!("Invalid date format: {}", s)))
        }
        serde_json::Value::Null => Ok(None),
        _ => Err(Error::custom("Expected string or null for date")),
    }
}

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
    #[serde(deserialize_with = "deserialize_date_time")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when product was acquired
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_new: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_popular: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateProductRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<MultiLanguageText>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<MultiLanguageText>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail_image: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subcategory: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub feature_images: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub specs: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(deserialize_with = "deserialize_date_time")]
    pub acquisition_date: Option<DateTime<Utc>>,
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
    #[serde(deserialize_with = "deserialize_date_time")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when product was acquired
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateHandmadeProductRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<MultiLanguageText>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<MultiLanguageText>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<MultiLanguageText>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail_image: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub feature_images: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subcategory: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub specs: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stock: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(deserialize_with = "deserialize_date_time")]
    pub acquisition_date: Option<DateTime<Utc>>,
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
    #[serde(deserialize_with = "deserialize_date_time")]
    pub acquisition_date: Option<DateTime<Utc>>,  // Date when build was created
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
}

// Modelos para ventas
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Sale {
    pub id: String,
    pub product_id: String,
    pub product_type: ProductType,
    pub product_name: String,
    pub quantity: i32,
    pub unit_price: String,
    pub total_price: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub discount: Option<String>,
    pub final_price: String,
    pub customer_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub customer_email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub customer_phone: Option<String>,
    pub payment_method: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
    pub sale_date: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateSaleRequest {
    pub product_id: String,
    pub product_type: ProductType,
    pub quantity: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub discount: Option<f64>,
    pub customer_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub customer_email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub customer_phone: Option<String>,
    pub payment_method: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum ProductType {
    #[serde(rename = "product")]
    Product,
    #[serde(rename = "handmade")]
    Handmade,
    #[serde(rename = "build")]
    Build,
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