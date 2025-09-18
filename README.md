# 🚀 Space Shooter

A thrilling 2D space shooter game built with Three.js! Pilot your spaceship through asteroid fields, destroy enemies, and achieve the highest score possible.

## 🎮 How to Play

### Objective
- **Survive** as long as possible in the dangerous asteroid field
- **Destroy asteroids** to increase your score
- **Avoid collisions** with asteroids to stay alive
- **Progress through levels** as your score increases

### Controls
- **WASD** or **Arrow Keys**: Move your spaceship
- **SPACE**: Fire laser bullets
- **SPACE** (on Game Over): Restart the game

### Game Mechanics
- **Asteroid Destruction**: Shoot asteroids to destroy them and earn points
- **Level Progression**: New level every 1000 points
- **Increasing Difficulty**: More asteroids spawn at higher levels
- **Collision System**: Touching any asteroid ends the game
- **Sound Effects**: Immersive audio feedback for actions

## 🎯 Scoring System
- **Asteroid Destroyed**: +100 points
- **Level Up**: Every 1000 points
- **High Score**: Track your best performance

## 🛠️ Technology Stack
- **Three.js**: 2D graphics and WebGL rendering
- **Vanilla JavaScript**: Pure JS game logic
- **Web Audio API**: Sound effects and audio
- **Express.js**: Server for Heroku deployment
- **HTML5 Canvas**: Game rendering

## 🚀 Getting Started

### Prerequisites
- Node.js 22.17.0 or higher
- npm 10.x or higher

### Local Development
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SpaceShooter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:8000`
   - Start playing!

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🌐 Live Demo
- **Heroku**: [Play Space Shooter](https://space-shooter-2d.herokuapp.com/)
- **GitHub**: [View Source Code](https://github.com/davidnekovarcz/js-space-shooter-2d)

## 📁 Project Structure
```
SpaceShooter/
├── index.html          # Main HTML file
├── game.js            # Game logic and Three.js implementation
├── styles.css         # Game styling
├── server.js          # Express server for Heroku
├── package.json       # Dependencies and scripts
├── Procfile          # Heroku deployment configuration
└── README.md         # This file
```

## 🎵 Audio Features
- **Laser Sound**: Firing bullets
- **Explosion Sound**: Asteroid destruction
- **Background Ambience**: Space atmosphere

## 🎨 Visual Features
- **2D Graphics**: Immersive space environment
- **Particle Effects**: Explosions and visual feedback
- **Smooth Animations**: Fluid movement and rotation
- **Responsive Design**: Adapts to different screen sizes

## 🏆 Pro Tips
- **Stay Mobile**: Keep moving to avoid asteroid clusters
- **Aim Carefully**: Make every shot count
- **Plan Ahead**: Look for safe paths through asteroid fields
- **Practice**: The more you play, the better you get!

## 🔧 Development Notes
- **Performance Optimized**: Efficient rendering and memory management
- **Cross-Browser Compatible**: Works on all modern browsers
- **Mobile Friendly**: Touch controls for mobile devices
- **Accessibility**: Keyboard navigation support

## 🐛 Troubleshooting
- **No Sound**: Check browser audio permissions
- **Performance Issues**: Try closing other browser tabs
- **Controls Not Working**: Click on the game area first

## 📊 Analytics
This game uses Umami Analytics for privacy-focused visitor tracking:
- No cookies or personal data collection
- GDPR compliant
- Performance and usage insights

## 🚀 Deployment

### Heroku Deployment
1. **Create Heroku app**
   ```bash
   heroku create space-shooter-xxx
   ```

2. **Deploy to Heroku**
   ```bash
   git push heroku main
   ```

3. **Open your app**
   ```bash
   heroku open
   ```

### Environment Variables
- `PORT`: Server port (automatically set by Heroku)

## 📈 Performance
- **Lightweight**: Minimal dependencies
- **Fast Loading**: Optimized assets and code
- **Smooth Gameplay**: 60 FPS target
- **Memory Efficient**: Proper cleanup and garbage collection

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- **Three.js** for the amazing 2D graphics library
- **Web Audio API** for immersive sound effects
- **Heroku** for easy deployment platform

---

**Ready to save the galaxy?** 🚀✨
