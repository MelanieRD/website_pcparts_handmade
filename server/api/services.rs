use crate::models::{Product, HandmadeProduct, Build, Sale, CreateSaleRequest, ProductType};
use anyhow::Result;
use mongodb::{
    bson::doc,
    Collection, Database,
};
use serde_json;
use std::fs;
use tracing::info;
use uuid::Uuid;
use chrono::Utc;

pub struct ProductService {
    collection: Collection<Product>,
}

pub struct HandmadeService {
    collection: Collection<HandmadeProduct>,
}

pub struct BuildService {
    collection: Collection<Build>,
}

pub struct SaleService {
    collection: Collection<Sale>,
    product_service: ProductService,
    handmade_service: HandmadeService,
    build_service: BuildService,
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

impl BuildService {
    pub fn new(db: Database) -> Self {
        let collection = db.collection::<Build>("builds");
        Self { collection }
    }

    pub async fn get_all_builds(&self) -> Result<Vec<Build>> {
        let mut cursor = self.collection.find(doc! {}).await?;
        let mut builds = Vec::new();
        
        while cursor.advance().await? {
            builds.push(cursor.deserialize_current()?);
        }
        
        Ok(builds)
    }

    pub async fn get_build_by_id(&self, id: &str) -> Result<Option<Build>> {
        let filter = doc! { "id": id };
        let build = self.collection.find_one(filter).await?;
        Ok(build)
    }

    pub async fn get_builds_by_category(&self, category: &str) -> Result<Vec<Build>> {
        let filter = doc! { "category": category };
        let mut cursor = self.collection.find(filter).await?;
        let mut builds = Vec::new();
        
        while cursor.advance().await? {
            builds.push(cursor.deserialize_current()?);
        }
        
        Ok(builds)
    }

    pub async fn seed_builds(&self) -> Result<()> {
        // Clear existing builds
        self.collection.delete_many(doc! {}).await?;
        
        // Read builds from JSON file
        let builds_json = fs::read_to_string("../client/src/data/builds.json")?;
        let builds: Vec<Build> = serde_json::from_str(&builds_json)?;
        
        // Insert builds into database
        if !builds.is_empty() {
            let count = builds.len();
            self.collection.insert_many(builds).await?;
            info!("Inserted {} builds into database", count);
        }
        
        Ok(())
    }

    pub async fn create_build(&self, build: Build) -> Result<()> {
        self.collection.insert_one(build).await?;
        Ok(())
    }

    pub async fn update_build(&self, id: &str, build: Build) -> Result<()> {
        let filter = doc! { "id": id };
        let update = doc! { "$set": mongodb::bson::to_bson(&build)? };
        self.collection.update_one(filter, update).await?;
        Ok(())
    }

    pub async fn delete_build(&self, id: &str) -> Result<()> {
        let filter = doc! { "id": id };
        self.collection.delete_one(filter).await?;
        Ok(())
    }
}

impl SaleService {
    pub fn new(db: Database) -> Self {
        let collection = db.collection::<Sale>("sales");
        let product_service = ProductService::new(db.clone());
        let handmade_service = HandmadeService::new(db.clone());
        let build_service = BuildService::new(db);
        
        Self { 
            collection,
            product_service,
            handmade_service,
            build_service,
        }
    }

    pub async fn get_all_sales(&self) -> Result<Vec<Sale>> {
        let mut cursor = self.collection.find(doc! {}).await?;
        let mut sales = Vec::new();
        
        while cursor.advance().await? {
            sales.push(cursor.deserialize_current()?);
        }
        
        Ok(sales)
    }

    pub async fn get_sale_by_id(&self, id: &str) -> Result<Option<Sale>> {
        let filter = doc! { "id": id };
        let sale = self.collection.find_one(filter).await?;
        Ok(sale)
    }

    pub async fn create_sale(&self, sale_request: CreateSaleRequest) -> Result<Sale> {
        let product_id = sale_request.product_id.clone();
        let product_type = sale_request.product_type;
        
        // Obtener información del producto
        let (product_name, unit_price) = match product_type {
            ProductType::Product => {
                if let Some(product) = self.product_service.get_product_by_id(&product_id).await? {
                    (product.name.es, product.price)
                } else {
                    return Err(anyhow::anyhow!("Product not found"));
                }
            },
            ProductType::Handmade => {
                if let Some(product) = self.handmade_service.get_handmade_by_id(&product_id).await? {
                    (product.name.es, product.price)
                } else {
                    return Err(anyhow::anyhow!("Handmade product not found"));
                }
            },
            ProductType::Build => {
                if let Some(build) = self.build_service.get_build_by_id(&product_id).await? {
                    (build.name.es, build.price)
                } else {
                    return Err(anyhow::anyhow!("Build not found"));
                }
            },
        };

        // Calcular precios
        let unit_price_float: f64 = unit_price.parse().unwrap_or(0.0);
        let total_price = unit_price_float * sale_request.quantity as f64;
        let discount_amount = sale_request.discount.unwrap_or(0.0) * total_price / 100.0;
        let final_price = total_price - discount_amount;

        // Crear la venta
        let sale = Sale {
            id: Uuid::new_v4().to_string(),
            product_id,
            product_type,
            product_name,
            quantity: sale_request.quantity,
            unit_price,
            total_price: total_price.to_string(),
            discount: sale_request.discount.map(|d| d.to_string()),
            final_price: final_price.to_string(),
            customer_name: sale_request.customer_name,
            customer_email: sale_request.customer_email,
            customer_phone: sale_request.customer_phone,
            payment_method: sale_request.payment_method,
            notes: sale_request.notes,
            sale_date: Utc::now(),
            created_at: Utc::now(),
        };

        // Insertar la venta
        self.collection.insert_one(&sale).await?;

        // Actualizar stock del producto
        let product_id = sale_request.product_id.clone();
        self.update_product_stock(&product_id, sale_request.product_type, sale_request.quantity).await?;

        Ok(sale)
    }

    async fn update_product_stock(&self, product_id: &str, product_type: ProductType, quantity: i32) -> Result<()> {
        match product_type {
            ProductType::Product => {
                if let Some(mut product) = self.product_service.get_product_by_id(product_id).await? {
                    if let Some(current_stock) = product.stock {
                        if current_stock >= quantity {
                            product.stock = Some(current_stock - quantity);
                            self.product_service.update_product(product_id, product).await?;
                        } else {
                            return Err(anyhow::anyhow!("Insufficient stock"));
                        }
                    } else {
                        return Err(anyhow::anyhow!("Product has no stock information"));
                    }
                }
            },
            ProductType::Handmade => {
                if let Some(mut product) = self.handmade_service.get_handmade_by_id(product_id).await? {
                    if let Some(current_stock) = product.stock {
                        if current_stock >= quantity {
                            product.stock = Some(current_stock - quantity);
                            self.handmade_service.update_handmade(product_id, product).await?;
                        } else {
                            return Err(anyhow::anyhow!("Insufficient stock"));
                        }
                    } else {
                        return Err(anyhow::anyhow!("Product has no stock information"));
                    }
                }
            },
            ProductType::Build => {
                if let Some(mut build) = self.build_service.get_build_by_id(product_id).await? {
                    if let Some(current_stock) = build.stock {
                        if current_stock >= quantity {
                            build.stock = Some(current_stock - quantity);
                            self.build_service.update_build(product_id, build).await?;
                        } else {
                            return Err(anyhow::anyhow!("Insufficient stock"));
                        }
                    } else {
                        return Err(anyhow::anyhow!("Build has no stock information"));
                    }
                }
            },
        }
        Ok(())
    }
} 