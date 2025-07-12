use crate::models::{Product, HandmadeProduct};
use anyhow::Result;
use mongodb::{
    bson::doc,
    Collection, Database,
};
use serde_json;
use std::fs;
use tracing::info;

pub struct ProductService {
    collection: Collection<Product>,
}

pub struct HandmadeService {
    collection: Collection<HandmadeProduct>,
}

impl ProductService {
    pub fn new(db: Database) -> Self {
        let collection = db.collection::<Product>("products");
        Self { collection }
    }

    pub async fn get_all_products(&self) -> Result<Vec<Product>> {
        let mut cursor = self.collection.find(doc! {}).await?;
        let mut products = Vec::new();
        
        while cursor.advance().await? {
            products.push(cursor.deserialize_current()?);
        }
        
        Ok(products)
    }

    pub async fn get_product_by_id(&self, id: &str) -> Result<Option<Product>> {
        let filter = doc! { "id": id };
        let product = self.collection.find_one(filter).await?;
        Ok(product)
    }

    pub async fn get_products_by_category(&self, category: &str) -> Result<Vec<Product>> {
        let filter = doc! { "category": category };
        let mut cursor = self.collection.find(filter).await?;
        let mut products = Vec::new();
        
        while cursor.advance().await? {
            products.push(cursor.deserialize_current()?);
        }
        
        Ok(products)
    }

    pub async fn seed_products(&self) -> Result<()> {
        // Clear existing products
        self.collection.delete_many(doc! {}).await?;
        
        // Read products from JSON file
        let products_json = fs::read_to_string("../client/src/data/products.json")?;
        let products: Vec<Product> = serde_json::from_str(&products_json)?;
        
        // Insert products into database
        if !products.is_empty() {
            let count = products.len();
            self.collection.insert_many(products).await?;
            info!("Inserted {} products into database", count);
        }
        
        Ok(())
    }

    pub async fn create_product(&self, product: Product) -> Result<()> {
        self.collection.insert_one(product).await?;
        Ok(())
    }

    pub async fn update_product(&self, id: &str, product: Product) -> Result<()> {
        let filter = doc! { "id": id };
        let update = doc! { "$set": mongodb::bson::to_bson(&product)? };
        self.collection.update_one(filter, update).await?;
        Ok(())
    }

    pub async fn delete_product(&self, id: &str) -> Result<()> {
        let filter = doc! { "id": id };
        self.collection.delete_one(filter).await?;
        Ok(())
    }
}

impl HandmadeService {
    pub fn new(db: Database) -> Self {
        let collection = db.collection::<HandmadeProduct>("handmade");
        Self { collection }
    }

    pub async fn get_all_handmade(&self) -> Result<Vec<HandmadeProduct>> {
        let mut cursor = self.collection.find(doc! {}).await?;
        let mut products = Vec::new();
        
        while cursor.advance().await? {
            products.push(cursor.deserialize_current()?);
        }
        
        Ok(products)
    }

    pub async fn get_handmade_by_id(&self, id: &str) -> Result<Option<HandmadeProduct>> {
        let filter = doc! { "id": id };
        let product = self.collection.find_one(filter).await?;
        Ok(product)
    }

    pub async fn get_handmade_by_category(&self, category: &str) -> Result<Vec<HandmadeProduct>> {
        let filter = doc! { "category": category };
        let mut cursor = self.collection.find(filter).await?;
        let mut products = Vec::new();
        
        while cursor.advance().await? {
            products.push(cursor.deserialize_current()?);
        }
        
        Ok(products)
    }

    pub async fn seed_handmade(&self) -> Result<()> {
        // Clear existing handmade products
        self.collection.delete_many(doc! {}).await?;
        
        // Read handmade products from JSON file
        let handmade_json = fs::read_to_string("../client/src/data/handmade.json")?;
        let handmade_products: Vec<HandmadeProduct> = serde_json::from_str(&handmade_json)?;
        
        // Insert handmade products into database
        if !handmade_products.is_empty() {
            let count = handmade_products.len();
            self.collection.insert_many(handmade_products).await?;
            info!("Inserted {} handmade products into database", count);
        }
        
        Ok(())
    }

    pub async fn create_handmade(&self, product: HandmadeProduct) -> Result<()> {
        self.collection.insert_one(product).await?;
        Ok(())
    }

    pub async fn update_handmade(&self, id: &str, product: HandmadeProduct) -> Result<()> {
        let filter = doc! { "id": id };
        let update = doc! { "$set": mongodb::bson::to_bson(&product)? };
        self.collection.update_one(filter, update).await?;
        Ok(())
    }

    pub async fn delete_handmade(&self, id: &str) -> Result<()> {
        let filter = doc! { "id": id };
        self.collection.delete_one(filter).await?;
        Ok(())
    }
} 