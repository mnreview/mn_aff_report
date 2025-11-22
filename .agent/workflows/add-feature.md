---
description: Add a new feature to the dashboard
---

# Add New Feature

This workflow provides a structured approach to adding new features to the Shopee Affiliate Dashboard.

## Steps

1. **Plan the feature**
   - Define the feature requirements clearly
   - Identify which components need to be created or modified
   - Consider the data requirements (API endpoints, state management)
   - Sketch the UI/UX if applicable

2. **Create a feature branch (optional but recommended)**
   ```bash
   git checkout -b feature/feature-name
   ```

3. **Implement the feature**
   
   **For new components:**
   - Create component file in `src/components/`
   - Follow existing naming conventions (PascalCase)
   - Implement component logic and styling
   - Ensure responsive design
   
   **For API integration:**
   - Add API endpoint to `server.js` if needed
   - Create service functions in `src/services/` if applicable
   - Handle loading and error states
   
   **For state management:**
   - Update relevant state in parent components
   - Pass props correctly to child components
   - Consider using React hooks (useState, useEffect, etc.)

4. **Test the feature**
   - Test in development mode (`npm run dev`)
   - Verify functionality across different screen sizes
   - Check browser console for errors
   - Test edge cases and error scenarios

5. **Update documentation**
   - Update README.md if the feature affects setup or usage
   - Add comments to complex code sections
   - Document any new API endpoints in `docs/`

6. **Commit the changes**
   ```bash
   git add .
   git commit -m "Add [feature name]: [brief description]"
   ```

7. **Merge to main (if using feature branch)**
   ```bash
   git checkout main
   git merge feature/feature-name
   git branch -d feature/feature-name
   ```

8. **Push to GitHub**
   ```bash
   git push origin main
   ```

## Best Practices
- Keep components small and focused on a single responsibility
- Reuse existing components and utilities where possible
- Follow the existing code style and patterns
- Test thoroughly before committing
- Write clear commit messages
