---
description: Push code changes to GitHub
---

# Push Code to GitHub

This workflow helps you commit and push your changes to GitHub.

## Steps

1. **Check current status**
   // turbo
   ```bash
   git status
   ```
   - Review which files have been modified
   - Ensure you want to commit all changes

2. **Stage all changes**
   ```bash
   git add .
   ```
   - This stages all modified and new files
   - Alternatively, use `git add <specific-file>` for selective staging

3. **Commit changes**
   ```bash
   git commit -m "Your descriptive commit message"
   ```
   - Write a clear, descriptive commit message
   - Example: "Add top 10 commission and items sold components"

4. **Push to GitHub**
   ```bash
   git push origin main
   ```
   - This pushes your commits to the main branch
   - If you're on a different branch, replace `main` with your branch name

5. **Verify push was successful**
   - Check GitHub repository in browser
   - Confirm latest commits are visible

## Notes
- Always pull latest changes before pushing if working in a team: `git pull origin main`
- Use meaningful commit messages that describe what changed and why
- Consider creating feature branches for larger changes
