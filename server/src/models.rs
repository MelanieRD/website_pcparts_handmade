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
    pub image: String,
    pub category: String,
    pub subcategory: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub images: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub specs: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_new: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_popular: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_offer: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateProductRequest {
    pub name: MultiLanguageText,
    pub description: MultiLanguageText,
    pub price: String,
    pub image: String,
    pub category: String,
    pub subcategory: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub images: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub specs: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,
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
    pub image: String,
    pub images: Vec<String>,
    pub category: String,
    pub subcategory: String,
    pub specs: HashMap<String, String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub original_price: Option<String>,
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