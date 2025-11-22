---
description: Debug and fix issues in the application
---

# Debug Application Issues

This workflow helps you systematically debug and fix issues in the Shopee Affiliate Dashboard.

## Steps

1. **Identify the issue**
   - Reproduce the bug consistently
   - Note the exact steps to reproduce
   - Check browser console for error messages
   - Check terminal output for backend errors

2. **Gather information**
   - What is the expected behavior?
   - What is the actual behavior?
   - When did this issue start occurring?
   - Does it happen in all browsers/devices?

3. **Check common issues**
   
   **Frontend issues:**
   - Check browser console for JavaScript errors
   - Verify component props are being passed correctly
   - Check if state is updating as expected
   - Inspect network tab for failed API requests
   
   **Backend issues:**
   - Check `server.js` terminal output for errors
   - Verify API endpoints are responding correctly
   - Check if environment variables are set
   - Verify Shopee API credentials are valid
   
   **Styling issues:**
   - Inspect element in browser DevTools
   - Check for CSS conflicts
   - Verify responsive breakpoints
   - Check if Tailwind classes are applied correctly

4. **Isolate the problem**
   - Use `console.log()` to trace execution flow
   - Comment out sections of code to narrow down the issue
   - Test individual components in isolation
   - Use React DevTools to inspect component state

5. **Fix the issue**
   - Make targeted changes to fix the root cause
   - Avoid making multiple unrelated changes at once
   - Add error handling if missing
   - Consider edge cases

6. **Test the fix**
   - Verify the original issue is resolved
   - Test related functionality to ensure nothing broke
   - Test in different browsers/screen sizes if applicable
   - Check for new console errors or warnings

7. **Commit the fix**
   ```bash
   git add .
   git commit -m "Fix: [brief description of the issue and fix]"
   git push origin main
   ```

## Debugging Tools
- **Browser DevTools**: Console, Network, Elements, React DevTools
- **VS Code Debugger**: Set breakpoints in your code
- **Console logging**: Strategic `console.log()` statements
- **Network inspection**: Check API requests and responses

## Common Issues and Solutions

**Issue: API calls failing**
- Check if backend server is running
- Verify API credentials in environment variables
- Check CORS configuration
- Inspect network tab for error details

**Issue: Components not rendering**
- Check for JavaScript errors in console
- Verify component imports are correct
- Check if required props are being passed
- Ensure state is initialized properly

**Issue: Styling not applied**
- Verify Tailwind CSS is configured correctly
- Check if class names are spelled correctly
- Inspect element to see computed styles
- Clear browser cache and rebuild

**Issue: Data not updating**
- Check if state is being updated correctly
- Verify useEffect dependencies
- Check if API is returning expected data
- Ensure event handlers are bound correctly
