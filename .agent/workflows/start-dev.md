---
description: Start the development environment
---

# Start Development Environment

This workflow starts both the frontend and backend development servers for the Shopee Affiliate Dashboard.

## Steps

1. **Check if servers are already running**
   - Look for existing `npm run dev` and `node server.js` processes
   - If already running, skip to step 4

2. **Start the backend server**
   ```bash
   node server.js
   ```
   - This starts the Express server on port 3001
   - The server handles API requests and serves as a proxy for Shopee API calls

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   - This starts the Vite development server
   - Usually runs on http://localhost:5173

4. **Verify both servers are running**
   - Backend should be listening on port 3001
   - Frontend should be accessible in the browser
   - Check terminal output for any errors

## Notes
- The backend server must be running for API calls to work
- Hot module replacement (HMR) is enabled for the frontend
- Both servers will auto-reload on file changes
