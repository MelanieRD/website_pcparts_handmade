# CyborgTech Client - Vercel Deployment

## Prerequisites

- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Vercel account

## Environment Variables

Before deploying, set up the following environment variables in your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

```
VITE_API_URL=https://your-server-url.vercel.app
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

3. Deploy from the client directory:

```bash
cd client
vercel
```

4. Follow the prompts to configure your project

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables
7. Deploy

## Configuration Files

The project includes the following Vercel configuration:

- `vercel.json`: Configures routing, headers, and build settings
- `vite.config.ts`: Optimized for production builds
- `env.production`: Production environment variables template

## Post-Deployment

1. Update your server's CORS settings to allow your Vercel domain
2. Test the API connection
3. Verify all routes work correctly

## Troubleshooting

- If you get CORS errors, check that your server allows your Vercel domain
- If the API URL is not working, verify the environment variable is set correctly
- Check Vercel function logs for any build or runtime errors
