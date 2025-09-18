# 🚀 Space Shooter - Heroku Deployment Guide

This guide will help you deploy the Space Shooter game to Heroku.

## 📋 Prerequisites

- Heroku CLI installed
- Git repository initialized
- Node.js 22.17.0+ installed locally

## 🛠️ Setup Steps

### 1. Initialize Git Repository
```bash
cd SpaceShooter
git init
git add .
git commit -m "Initial commit: Space Shooter game"
```

### 2. Create Heroku App
```bash
heroku create space-shooter-2d
```

### 3. Set Node.js Version
The `package.json` already specifies Node.js 22.17.0, so Heroku will automatically use this version.

### 4. Deploy to Heroku
```bash
git push heroku main
```

### 5. Open Your App
```bash
heroku open
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Automatically set by Heroku
- No additional environment variables required

### Build Process
- **Build Command**: `npm run build` (no-op for static files)
- **Start Command**: `npm start` (runs Express server)

## 📁 File Structure for Deployment

```
SpaceShooter/
├── index.html          # Main game page
├── game.js            # Game logic
├── styles.css         # Game styles
├── server.js          # Express server
├── package.json       # Dependencies
├── Procfile          # Heroku process file
├── README.md         # Documentation
└── DEPLOYMENT.md     # This file
```

## 🚀 Deployment Commands

### Full Deployment
```bash
# Add all files
git add .

# Commit changes
git commit -m "Deploy Space Shooter to Heroku"

# Push to Heroku
git push heroku main

# Open in browser
heroku open
```

### Update Deployment
```bash
# Make your changes
# ... edit files ...

# Add and commit
git add .
git commit -m "Update Space Shooter"

# Deploy update
git push heroku main
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`

2. **App Won't Start**
   - Check `Procfile` syntax
   - Verify `server.js` is correct
   - Check Heroku logs: `heroku logs --tail`

3. **Static Files Not Loading**
   - Ensure `express.static()` is configured correctly
   - Check file paths are relative to project root

### Debug Commands
```bash
# View logs
heroku logs --tail

# Check app status
heroku ps

# Restart app
heroku restart

# Check config
heroku config
```

## 📊 Monitoring

### Heroku Dashboard
- Monitor app performance
- View logs and errors
- Check resource usage

### Umami Analytics
- Track visitor analytics
- Monitor game performance
- Privacy-focused tracking

## 🔄 Continuous Deployment

### GitHub Integration
1. Connect Heroku to GitHub repository
2. Enable automatic deploys
3. Deploy on every push to main branch

### Manual Deployment
```bash
# Deploy specific branch
git push heroku feature-branch:main

# Deploy specific commit
git push heroku HEAD:main
```

## 🎯 Production Checklist

- [ ] All files committed to git
- [ ] `package.json` has correct dependencies
- [ ] `Procfile` is present and correct
- [ ] `server.js` serves static files properly
- [ ] Umami Analytics script added
- [ ] README.md is complete
- [ ] App starts successfully locally
- [ ] Heroku deployment successful
- [ ] App opens in browser
- [ ] Game loads and plays correctly

## 🚀 Success!

Your Space Shooter game should now be live on Heroku! 

**Next Steps:**
1. Test the live game
2. Share the URL with friends
3. Monitor analytics
4. Iterate and improve

---

**Happy Gaming!** 🎮✨
