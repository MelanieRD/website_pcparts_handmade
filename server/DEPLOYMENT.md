# CyborgTech Server - Vercel Deployment

## Prerequisites

- Rust toolchain installed
- Vercel CLI installed (`npm i -g vercel`)
- Vercel account
- MongoDB Atlas cluster (for production database)

## Environment Variables

Before deploying, set up the following environment variables in your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyborgtech?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
```

## Deployment Steps

### Option 1: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy from the server directory:

```bash
cd server
vercel
```

4. Follow the prompts to configure your project

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Other
   - Root Directory: `server`
   - Build Command: `cargo build --release`
   - Output Directory: `target/release`
6. Add environment variables
7. Deploy

## Configuration Files

The project includes the following Vercel configuration:

- `vercel.json`: Configures serverless functions and routing
- `api/index.rs`: Main serverless function entry point
- `Cargo.toml`: Rust dependencies including vercel_runtime

## Serverless Function Structure

The server is configured as a serverless function with the following structure:

```
server/
├── api/
│   ├── index.rs          # Main serverless function
│   ├── models.rs         # Data models
│   ├── services.rs       # Business logic
│   └── auth.rs          # Authentication logic
├── vercel.json          # Vercel configuration
└── Cargo.toml          # Rust dependencies
```

## API Endpoints

The serverless function handles the following endpoints:

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/handmade` - Get all handmade products
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- And more...

## Post-Deployment

1. Test the health endpoint: `https://your-server-url.vercel.app/api/health`
2. Update your client's API URL to point to the new server
3. Test all API endpoints
4. Monitor function logs in Vercel dashboard

## Troubleshooting

- If you get build errors, check that all Rust dependencies are correctly specified
- If MongoDB connection fails, verify the connection string and network access
- Check Vercel function logs for runtime errors
- Ensure environment variables are set correctly

## Development vs Production

For development, you can still run the server locally using:

```bash
cargo run
```

This will use the original `src/main.rs` file and run on `localhost:3001`.

For production, Vercel will use the `api/index.rs` serverless function.
