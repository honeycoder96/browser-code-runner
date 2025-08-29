# GitHub Pages Setup Guide

This guide will help you fix the permission issues and set up GitHub Pages for your browser-code-runner project.

## 🚨 **Current Issue**

You're getting this error:
```
remote: Permission to honeycoder96/browser-code-runner.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/honeycoder96/browser-code-runner.git/': The requested URL returned error: 403
```

## 🔧 **Solution 1: Fix Repository Permissions (Required)**

### Step 1: Go to Repository Settings
1. Navigate to: `https://github.com/honeycoder96/browser-code-runner`
2. Click on **"Settings"** tab
3. Click on **"Actions"** in the left sidebar

### Step 2: Update Workflow Permissions
1. Scroll down to **"Workflow permissions"** section
2. Select **"Read and write permissions"**
3. Check **"Allow GitHub Actions to create and approve pull requests"** (optional)
4. Click **"Save"**

### Step 3: Enable GitHub Pages
1. Go back to **"Settings"** tab
2. Click on **"Pages"** in the left sidebar
3. Under **"Source"**, select **"GitHub Actions"**
4. Click **"Save"**

## 🔧 **Solution 2: Updated Workflow Files**

I've created two workflow files:

### 1. `.github/workflows/deploy.yml` (Deployment)
- Uses modern `actions/deploy-pages@v4`
- Proper permissions configuration
- Separate build and deploy jobs
- GitHub Pages environment setup

### 2. `.github/workflows/build-test.yml` (Development)
- Builds and tests without deployment
- Can be triggered manually
- Useful for development branches

## 🔧 **Solution 3: Manual Setup Commands**

If you prefer to set up manually:

```bash
# 1. Enable GitHub Pages (in repository settings)
# Source: GitHub Actions

# 2. Update repository permissions
# Settings > Actions > Workflow permissions > Read and write

# 3. Push the updated workflow files
git add .github/workflows/
git commit -m "Update GitHub Actions workflows for Pages deployment"
git push origin main
```

## 🔧 **Solution 4: Alternative Deployment Method**

If you still have issues, you can use the classic deployment method:

```yaml
# In .github/workflows/deploy.yml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./demo
    destination_dir: .
    force_orphan: true
  env:
    ACTIONS_DEPLOY_KEY: ${{ secrets.ACTIONS_DEPLOY_KEY }}
```

Then add a deploy key:
1. Generate SSH key: `ssh-keygen -t rsa -b 4096 -C "your-email@example.com"`
2. Add public key to repository: Settings > Deploy keys
3. Add private key to secrets: Settings > Secrets and variables > Actions

## 🧪 **Testing the Fix**

### Step 1: Commit and Push
```bash
git add .github/workflows/
git commit -m "Fix GitHub Actions permissions and update workflows"
git push origin main
```

### Step 2: Check Actions Tab
1. Go to **"Actions"** tab in your repository
2. You should see the workflow running
3. Check for any permission errors

### Step 3: Verify Deployment
1. Go to **"Settings" > "Pages"**
2. Check if the site is deployed
3. Visit your GitHub Pages URL

## 🚨 **Common Issues and Solutions**

### Issue 1: Still Getting Permission Errors
- **Solution**: Double-check repository permissions
- **Check**: Settings > Actions > Workflow permissions

### Issue 2: Pages Not Deploying
- **Solution**: Ensure GitHub Pages is enabled
- **Check**: Settings > Pages > Source = GitHub Actions

### Issue 3: Workflow Not Running
- **Solution**: Check branch names in workflow
- **Fix**: Update `branches: [ main, master ]` to match your default branch

### Issue 4: Build Failures
- **Solution**: Check the build logs
- **Common**: Missing dependencies, build script errors

## 📋 **Workflow Configuration Details**

### Permissions
```yaml
permissions:
  contents: read      # Read repository content
  pages: write        # Write to GitHub Pages
  id-token: write     # Required for Pages deployment
```

### Concurrency
```yaml
concurrency:
  group: "pages"      # Prevent multiple deployments
  cancel-in-progress: false
```

### Environment
```yaml
environment:
  name: github-pages  # GitHub Pages environment
  url: ${{ steps.deployment.outputs.page_url }}
```

## 🎯 **Next Steps**

1. **Update repository permissions** (Settings > Actions)
2. **Enable GitHub Pages** (Settings > Pages)
3. **Commit and push** the updated workflow files
4. **Monitor the Actions tab** for deployment progress
5. **Test your deployed demo** at the GitHub Pages URL

## 📞 **Support**

If you continue to have issues:
1. Check the GitHub Actions logs for specific errors
2. Verify all repository settings are correct
3. Ensure you have admin access to the repository
4. Check GitHub's status page for any service issues

---

**Note**: The updated workflows use the latest GitHub Actions and should resolve the permission issues you're experiencing. 