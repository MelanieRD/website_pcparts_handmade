# CyborgTech - Vercel Deployment Guide

This guide will help you deploy both the client (React) and server (Rust) components of CyborgTech to Vercel.

## Project Structure

```
CyborgTech/
├── client/          # React frontend (Vite)
│   ├── src/         # React components and logic
│   ├── vercel.json  # Vercel configuration for client
│   └── ...
├── server/          # Rust backend (Axum)
│   ├── api/         # Serverless functions for Vercel
│   ├── src/         # Original server code (for development)
│   ├── vercel.json  # Vercel configuration for server
│   └── ...
└── ...
```

## Prerequisites

1. **Node.js 18+** and **npm**
2. **Rust toolchain** (rustc, cargo)
3. **Vercel CLI**: `npm i -g vercel`
4. **Vercel account** at [vercel.com](https://vercel.com)
5. **MongoDB Atlas** cluster for production database
6. **GitHub repository** with your code

## Step 1: Prepare Environment Variables

### For the Server (Rust Backend)

You'll need these environment variables in your Vercel server project:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyborgtech?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
```

### For the Client (React Frontend)

You'll need this environment variable in your Vercel client project:

```
VITE_API_URL=https://your-server-url.vercel.app
```

## Step 2: Deploy the Server First

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Deploy using Vercel CLI:**

   ```bash
   vercel
   ```

3. **Follow the prompts:**

   - Link to existing project or create new
   - Set project name (e.g., `cyborgtech-server`)
   - Confirm deployment settings

4. **Set environment variables:**

   - Go to your Vercel dashboard
   - Navigate to your server project
   - Go to Settings > Environment Variables
   - Add `MONGODB_URI` and `JWT_SECRET`

5. **Redeploy with environment variables:**

   ```bash
   vercel --prod
   ```

6. **Note your server URL** (e.g., `https://cyborgtech-server.vercel.app`)

## Step 3: Deploy the Client

1. **Navigate to the client directory:**

   ```bash
   cd ../client
   ```

2. **Update the API URL** in `env.production`:

   ```
   VITE_API_URL=https://your-server-url.vercel.app
   ```

3. **Deploy using Vercel CLI:**

   ```bash
   vercel
   ```

4. **Follow the prompts:**

   - Link to existing project or create new
   - Set project name (e.g., `cyborgtech-client`)
   - Confirm deployment settings

5. **Set environment variables:**

   - Go to your Vercel dashboard
   - Navigate to your client project
   - Go to Settings > Environment Variables
   - Add `VITE_API_URL` with your server URL

6. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

## Step 4: Test Your Deployment

### Test the Server

1. **Health check:**

   ```bash
   curl https://your-server-url.vercel.app/api/health
   ```

2. **Welcome message:**
   ```bash
   curl https://your-server-url.vercel.app/
   ```

### Test the Client

1. **Visit your client URL** in a browser
2. **Test the API connection** by navigating through the app
3. **Check browser console** for any errors

## Step 5: Configure Custom Domains (Optional)

1. **In Vercel dashboard**, go to your project settings
2. **Navigate to Domains**
3. **Add your custom domain** and follow DNS setup instructions

## Configuration Details

### Client Configuration (`client/vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Server Configuration (`server/vercel.json`)

```json
{
  "functions": {
    "api/**/*.rs": {
      "runtime": "vercel-rust@1.0.0"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.rs"
    }
  ]
}
```

## Development vs Production

### Local Development

- **Client**: `cd client && npm run dev` (runs on localhost:3000)
- **Server**: `cd server && cargo run` (runs on localhost:3001)

### Production

- **Client**: Deployed to Vercel with automatic builds
- **Server**: Deployed as serverless functions on Vercel

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure your server allows your client domain
   - Check that environment variables are set correctly

2. **Build Failures**

   - Check Vercel build logs
   - Verify all dependencies are correctly specified

3. **API Connection Issues**

   - Verify the `VITE_API_URL` environment variable
   - Check that your server is deployed and accessible

4. **MongoDB Connection Issues**
   - Verify your MongoDB Atlas connection string
   - Ensure your MongoDB cluster allows connections from Vercel

### Getting Help

- Check Vercel function logs in the dashboard
- Review build logs for compilation errors
- Test endpoints individually using curl or Postman

## Monitoring and Maintenance

1. **Monitor function logs** in Vercel dashboard
2. **Set up alerts** for function errors
3. **Monitor MongoDB Atlas** for database performance
4. **Regularly update dependencies** for security patches

## Cost Considerations

- **Vercel Hobby Plan**: Free tier available
- **MongoDB Atlas**: Free tier available (512MB)
- **Serverless Functions**: Pay per execution on higher tiers

## Next Steps

After successful deployment:

1. Set up monitoring and logging
2. Configure custom domains
3. Set up CI/CD pipelines
4. Implement backup strategies
5. Consider scaling options

---

For more detailed information, see:

- [Client Deployment Guide](client/DEPLOYMENT.md)
- [Server Deployment Guide](server/DEPLOYMENT.md)
- [Vercel Documentation](https://vercel.com/docs)
