# CyborgTech Server

A Rust-based REST API server that connects to MongoDB Atlas to serve product data for the CyborgTech e-commerce platform.

## Features

- 🚀 Fast Rust-based API server using Axum framework
- 🗄️ MongoDB Atlas integration for data persistence
- 🌐 CORS enabled for cross-origin requests
- 📊 Product and Handmade product management
- 🔍 Search and filtering capabilities
- 🌍 Multi-language support (ES, EN, FR)
- 📝 Comprehensive API documentation

## Prerequisites

- Rust (latest stable version)
- MongoDB Atlas account
- Git

## Setup Instructions

### 1. Install Rust

If you haven't installed Rust yet, visit [rustup.rs](https://rustup.rs/) and follow the installation instructions.

### 2. Clone the Repository

```bash
git clone <your-repo-url>
cd CyborgTech/server
```

### 3. Configure Environment Variables

Copy the example environment file and configure your MongoDB Atlas connection:

```bash
cp env.example .env
```

Edit the `.env` file and replace the MongoDB URI with your actual MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/cyborgtech?retryWrites=true&w=majority
PORT=3000
RUST_LOG=info
```

### 4. Build and Run

```bash
# Build the project
cargo build

# Run in development mode
cargo run

# Or run in release mode
cargo run --release
```

The server will start on `http://localhost:3000`

### 5. Seed the Database

After starting the server, seed the database with initial data:

```bash
curl -X POST http://localhost:3000/api/seed
```

## API Endpoints

### Health Check

- `GET /api/health` - Check server health status

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Handmade Products

- `GET /api/handmade` - Get all handmade products
- `GET /api/handmade/:id` - Get handmade product by ID
- `GET /api/handmade/category/:category` - Get handmade products by category

### Database Management

- `POST /api/seed` - Seed database with initial data

## Data Models

### Product

```rust
{
  "id": "string",
  "name": {
    "es": "string",
    "en": "string",
    "fr": "string"
  },
  "description": {
    "es": "string",
    "en": "string",
    "fr": "string"
  },
  "price": "string",
  "image": "string",
  "category": "string",
  "subcategory": "string",
  "originalPrice": "string", // optional
  "images": ["string"], // optional
  "specs": {}, // optional
  "brand": "string", // optional
  "isNew": boolean, // optional
  "isPopular": boolean, // optional
  "isOffer": boolean // optional
}
```

### HandmadeProduct

```rust
{
  "id": "string",
  "name": {
    "es": "string",
    "en": "string",
    "fr": "string"
  },
  "description": {
    "es": "string",
    "en": "string",
    "fr": "string"
  },
  "longDescription": {
    "es": "string",
    "en": "string",
    "fr": "string"
  },
  "price": "string",
  "image": "string",
  "images": ["string"],
  "category": "string",
  "subcategory": "string",
  "specs": {},
  "originalPrice": "string", // optional
  "isOffer": boolean // optional
}
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from the cluster
5. Add your IP address to the IP whitelist
6. Update the `MONGODB_URI` in your `.env` file

## Development

### Project Structure

```
server/
├── src/
│   ├── main.rs          # Main application entry point
│   ├── models.rs        # Data models and structures
│   └── services.rs      # Business logic and database operations
├── Cargo.toml           # Rust dependencies
├── env.example          # Environment variables template
└── README.md           # This file
```

### Adding New Endpoints

1. Add the route in `main.rs`
2. Create the handler function
3. Add any necessary service methods in `services.rs`

### Database Operations

The server uses MongoDB for data persistence. All database operations are handled through the service layer:

- `ProductService` - Handles regular product operations
- `HandmadeService` - Handles handmade product operations

## Error Handling

The server includes comprehensive error handling:

- Database connection errors
- Invalid request parameters
- Missing data
- Serialization/deserialization errors

## Logging

The server uses the `tracing` crate for logging. Log levels can be configured via the `RUST_LOG` environment variable.

## CORS

CORS is enabled for all origins to allow the frontend to communicate with the API. In production, you should restrict this to specific domains.

## Performance

- Uses async/await for non-blocking I/O
- Connection pooling for MongoDB
- Efficient serialization with Serde
- Minimal memory footprint

## Security Considerations

- Environment variables for sensitive data
- Input validation
- Error messages don't expose internal details
- CORS configuration for production

## Deployment

### Docker (Recommended)

```dockerfile
FROM rust:1.70 as builder
WORKDIR /usr/src/app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/src/app/target/release/cyborgtech-server /usr/local/bin/
EXPOSE 3000
CMD ["cyborgtech-server"]
```

### Manual Deployment

1. Build the release version: `cargo build --release`
2. Copy the binary to your server
3. Set up environment variables
4. Run the binary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
