---
description: Deploy the application to production
---

# Deploy Application

This workflow guides you through deploying the Shopee Affiliate Dashboard to production.

## Prerequisites
- Git repository initialized and pushed to GitHub
- Environment variables configured
- Production hosting service selected (e.g., Vercel, Netlify, or custom server)

## Steps

1. **Build the production bundle**
   ```bash
   npm run build
   ```
   - This creates an optimized production build in the `dist` directory
   - Verify there are no build errors

2. **Test the production build locally (optional)**
   ```bash
   npm run preview
   ```
   - This serves the production build locally for testing
   - Verify all features work correctly

3. **Commit and push latest changes**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

4. **Deploy to hosting service**
   
   **For Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Follow the prompts to link your project
   - Run: `vercel --prod` for production deployment
   
   **For Netlify:**
   - Install Netlify CLI: `npm i -g netlify-cli`
   - Run: `netlify deploy`
   - Specify `dist` as the publish directory
   - Run: `netlify deploy --prod` for production
   
   **For custom server:**
   - Copy the `dist` folder to your server
   - Configure your web server (nginx/Apache) to serve the static files
   - Set up the backend server (`server.js`) with a process manager like PM2

5. **Configure environment variables**
   - Set `SHOPEE_PARTNER_ID` and `SHOPEE_PARTNER_KEY` in your hosting service
   - Ensure API endpoints are correctly configured for production

6. **Verify deployment**
   - Visit the deployed URL
   - Test all major features (login, data fetching, filtering, charts)
   - Check browser console for errors

## Notes
- Always test the production build locally before deploying
- Keep your Shopee API credentials secure
- Monitor your deployment for errors after going live
