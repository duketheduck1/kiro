# 🚀 Deploying Clippy Reborn to Vercel

This guide will help you deploy Clippy Reborn to Vercel so it's accessible online!

## 📋 Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. Your OpenAI API key
3. Git repository (GitHub, GitLab, or Bitbucket)

## 🎯 Quick Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "Add New Project"**

4. **Import your GitHub repository**
   - Select your Clippy Reborn repository
   - Click "Import"

5. **Configure Environment Variables**
   - Click "Environment Variables"
   - Add these variables:
     - `OPENAI_API_KEY` = your OpenAI API key
     - `NODE_ENV` = production
     - `PORT` = 3000

6. **Deploy!**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   # Paste your OpenAI API key when prompted
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Files

The following files are already configured for Vercel:

- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Build scripts
- ✅ `.env.example` - Environment variable template

## 🌍 After Deployment

Once deployed, your app will be available at:
- **Production URL**: `https://your-project.vercel.app`

### Update API URLs

After deployment, you'll need to update the API URLs in your frontend files to use your Vercel URL instead of `localhost:3000`:

**Files to update:**
- `public/index.html` (line ~420)
- `public/editor.html` (line ~420)
- `public/bookmarklet.html` (bookmarklet URL)
- `src/frontend/clippy-bookmarklet.js` (line 17)

Change:
```javascript
apiBaseUrl: 'http://localhost:3000/api'
```

To:
```javascript
apiBaseUrl: 'https://your-project.vercel.app/api'
```

## 🔐 Environment Variables

Make sure to set these in Vercel:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `NODE_ENV` | production | ✅ Yes |
| `PORT` | 3000 | Optional |

## 📝 Important Notes

1. **API Key Security**: Never commit your `.env` file to Git. The `.gitignore` already excludes it.

2. **CORS**: The app is configured to allow CORS for all origins. For production, you may want to restrict this in `src/backend/server.js`.

3. **Rate Limiting**: Consider adding rate limiting for production to prevent API abuse.

4. **Custom Domain**: You can add a custom domain in Vercel dashboard under "Settings" → "Domains".

5. **Automatic Deployments**: Vercel will automatically redeploy when you push to your main branch.

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (Node 18+ recommended)

### API Errors
- Verify `OPENAI_API_KEY` is set correctly in Vercel environment variables
- Check Vercel function logs in the dashboard

### 404 Errors
- Verify `vercel.json` routes are correct
- Check that files exist in the correct directories

### CORS Issues
- Update CORS settings in `src/backend/server.js` if needed
- Ensure API URLs are updated to use your Vercel domain

## 🎉 Success!

Once deployed, you can:
- Share your Clippy Reborn URL with others
- Use it from any device
- Access all features (Reader, Writer, News Feed)
- Use the bookmarklet on any website (update the URL first!)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Guide](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

Need help? Check the [Vercel Support](https://vercel.com/support) or open an issue in your repository!
