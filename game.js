class Game {
    constructor() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        
        // Calculate view size to maintain square aspect ratio
        const viewSize = 60; // Total view size (width and height)
        const aspectRatio = window.innerWidth / window.innerHeight;
        let width, height;
        
        if (aspectRatio > 1) {
            // Window is wider than tall
            height = viewSize;
            width = height * aspectRatio;
        } else {
            // Window is taller than wide
            width = viewSize;
            height = width / aspectRatio;
        }
        
        this.camera = new THREE.OrthographicCamera(
            -width/2, width/2,  // left, right
            height/2, -height/2,  // top, bottom
            0.1, 1000 // near, far
        );
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // Initialize audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create sound effects
        this.createSoundEffects();
        
        // Game state
        this.ship = null;
        this.bullets = [];
        this.asteroids = [];
        this.explosions = [];
        this.keys = {};
        this.score = 0;
        this.level = 0;
        this.isGameOver = false;
        this.lastShot = 0;  // Track last shot time
        this.shootCooldown = 100; // 10 shots per second (1000ms / 10)
        
        // Store view size for calculations
        this.viewSize = viewSize;
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.scoreElement.style.position = 'absolute';
        this.scoreElement.style.top = '20px';
        this.scoreElement.style.right = '20px';
        this.scoreElement.style.color = 'white';
        this.scoreElement.style.fontSize = '24px';
        this.scoreElement.style.fontFamily = 'Arial, sans-serif';
        
        this.gameOverElement = document.getElementById('gameOver');
        this.levelElement = document.createElement('div');
        this.levelElement.style.position = 'absolute';
        this.levelElement.style.top = '20px';
        this.levelElement.style.left = '20px';
        this.levelElement.style.color = 'white';
        this.levelElement.style.fontSize = '24px';
        this.levelElement.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.levelElement);
        
        // Set up camera
        this.camera.position.z = 30;
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
        
        // Event listeners
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' && !this.isGameOver) {
                this.shoot();
            }
            if (this.isGameOver && e.key === ' ') {
                this.restart();
            }
        });
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mobile controls
        this.setupMobileControls();
        
        // Start game
        this.init();
    }

    init() {
        // Create ship
        this.createShip();

        // Start game loop
        this.gameLoop = requestAnimationFrame(() => this.update());
        
        // Spawn initial asteroids
        this.spawnLevelAsteroids();
    }

    setupMobileControls() {
        // Get mobile control buttons
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const upBtn = document.getElementById('upBtn');
        const downBtn = document.getElementById('downBtn');
        const shootBtn = document.getElementById('shootBtn');

        // Add touch event listeners for movement
        if (leftBtn) {
            leftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['ArrowLeft'] = true;
            });
            leftBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['ArrowLeft'] = false;
            });
            leftBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.keys['ArrowLeft'] = true;
            });
            leftBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.keys['ArrowLeft'] = false;
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['ArrowRight'] = true;
            });
            rightBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['ArrowRight'] = false;
            });
            rightBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.keys['ArrowRight'] = true;
            });
            rightBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.keys['ArrowRight'] = false;
            });
        }

        if (upBtn) {
            upBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['ArrowUp'] = true;
            });
            upBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['ArrowUp'] = false;
            });
            upBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.keys['ArrowUp'] = true;
            });
            upBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.keys['ArrowUp'] = false;
            });
        }

        if (downBtn) {
            downBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys['ArrowDown'] = true;
            });
            downBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys['ArrowDown'] = false;
            });
            downBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.keys['ArrowDown'] = true;
            });
            downBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.keys['ArrowDown'] = false;
            });
        }

        if (shootBtn) {
            shootBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.isGameOver) {
                    this.shoot();
                } else {
                    this.restart();
                }
            });
            shootBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (!this.isGameOver) {
                    this.shoot();
                } else {
                    this.restart();
                }
            });
        }
    }

    createShip() {
        // Create a 2D triangle shape
        const shape = new THREE.Shape();
        shape.moveTo(0, 1);    // Top point
        shape.lineTo(-0.5, -0.5);  // Bottom left
        shape.lineTo(0.5, -0.5);   // Bottom right
        shape.lineTo(0, 1);    // Back to top

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            side: THREE.DoubleSide
        });
        this.ship = new THREE.Mesh(geometry, material);
        
        // Set initial position and rotation
        this.ship.position.set(0, 0, 0);
        this.ship.rotation.set(0, 0, 0);  // Start facing up
        
        // Ship properties
        this.ship.velocity = new THREE.Vector3(0, 0, 0);
        this.ship.acceleration = 0.01;
        this.ship.friction = 0.98;
        this.ship.rotationSpeed = 0.1;
        
        this.scene.add(this.ship);
    }

    createAsteroid(size) {
        const geometry = new THREE.IcosahedronGeometry(size, 0);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x888888,
            flatShading: true
        });
        const asteroid = new THREE.Mesh(geometry, material);
        
        // Random position on the edge of the screen
        const angle = Math.random() * Math.PI * 2;
        const distance = 30;
        asteroid.position.x = Math.cos(angle) * distance;
        asteroid.position.y = Math.sin(angle) * distance;
        asteroid.position.z = 0;

        // Random rotation
        asteroid.rotation.x = Math.random() * Math.PI;
        asteroid.rotation.y = Math.random() * Math.PI;
        asteroid.rotation.z = Math.random() * Math.PI;

        // Random velocity (2D only)
        const speed = 0.1 + Math.random() * 0.2;
        asteroid.velocity = new THREE.Vector3(
            -Math.cos(angle) * speed,
            -Math.sin(angle) * speed,
            0
        );

        // Random rotation speed
        asteroid.rotationSpeed = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );

        this.scene.add(asteroid);
        return asteroid;
    }

    createBullet() {
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(geometry, material);
        
        // Position at ship's front (2D)
        const direction = new THREE.Vector3(0, 1, 0);
        direction.applyQuaternion(this.ship.quaternion);
        bullet.position.copy(this.ship.position).add(direction.multiplyScalar(2));
        bullet.position.z = 0; // Keep in 2D plane
        
        // Set velocity (2D)
        bullet.velocity = direction.multiplyScalar(0.5);
        bullet.velocity.z = 0; // Keep in 2D plane
        
        this.scene.add(bullet);
        return bullet;
    }

    createExplosion(position) {
        const particles = 8;
        for (let i = 0; i < particles; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 8, 8);
            const material = new THREE.MeshPhongMaterial({ color: 0xff8800 });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.copy(position);
            particle.position.z = 0; // Keep in 2D plane
            
            const angle = (i / particles) * Math.PI * 2;
            const speed = 0.2;
            particle.velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                0
            );
            
            particle.life = 30;
            this.scene.add(particle);
            this.explosions.push(particle);
        }
    }

    createSoundEffects() {
        // Create explosion sound
        this.createExplosionSound = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.5);
        };

        // Create game over sound
        this.createGameOverSound = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 1); // A3
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 1);
        };
    }

    shoot() {
        this.bullets.push(this.createBullet());
    }

    spawnLevelAsteroids() {
        // Spawn 4 asteroids for the first level, add one more for each subsequent level
        const numAsteroids = Math.min(4 + (this.level - 1), 8);
        for (let i = 0; i < numAsteroids; i++) {
            this.asteroids.push(this.createAsteroid(3));
        }
        this.level++;
        this.updateLevel();
    }

    splitAsteroid(asteroid) {
        const currentSize = asteroid.geometry.parameters.radius;
        let newSize;
        
        // Determine the next size based on current size
        if (currentSize >= 3) {
            newSize = 2;  // First split: 3 -> 2
        } else if (currentSize >= 2) {
            newSize = 1;  // Second split: 2 -> 1
        }
        
        for (let i = 0; i < 2; i++) {
            const newAsteroid = this.createAsteroid(newSize);
            newAsteroid.position.copy(asteroid.position);
            
            // Create new velocity with random angle variation
            const angleVariation = (Math.random() - 0.5) * Math.PI / 2; // Random angle between -45 and 45 degrees
            const speed = asteroid.velocity.length() * 1.2; // Slightly faster than parent
            const currentAngle = Math.atan2(asteroid.velocity.y, asteroid.velocity.x);
            const newAngle = currentAngle + angleVariation;
            
            newAsteroid.velocity = new THREE.Vector3(
                Math.cos(newAngle) * speed,
                Math.sin(newAngle) * speed,
                0
            );
            
            this.asteroids.push(newAsteroid);
        }
    }

    checkCollisions() {
        // Check bullet-asteroid collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                const asteroid = this.asteroids[j];
                const distance = bullet.position.distanceTo(asteroid.position);
                
                if (distance < asteroid.geometry.parameters.radius) {
                    // Create explosion
                    this.createExplosion(asteroid.position);
                    
                    // Play explosion sound
                    this.createExplosionSound();
                    
                    // Split asteroid if it's large enough
                    if (asteroid.geometry.parameters.radius > 1) {
                        this.splitAsteroid(asteroid);
                    }
                    
                    // Remove hit asteroid and bullet
                    this.scene.remove(asteroid);
                    this.scene.remove(bullet);
                    this.asteroids.splice(j, 1);
                    this.bullets.splice(i, 1);
                    this.score += Math.floor(100 / asteroid.geometry.parameters.radius);
                    this.updateScore();
                    break;
                }
            }
        }
        
        // Check ship-asteroid collisions
        for (const asteroid of this.asteroids) {
            const distance = this.ship.position.distanceTo(asteroid.position);
            if (distance < asteroid.geometry.parameters.radius + 1) {
                this.endGame();
                // Play game over sound
                this.createGameOverSound();
                break;
            }
        }
    }

    updateScore() {
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    updateLevel() {
        this.levelElement.textContent = `Level ${this.level}`;
    }

    update() {
        if (this.isGameOver) return;

        // Update ship
        if (this.keys['ArrowLeft']) {
            this.ship.rotation.z += this.ship.rotationSpeed;
        }
        if (this.keys['ArrowRight']) {
            this.ship.rotation.z -= this.ship.rotationSpeed;
        }
        if (this.keys['ArrowUp']) {
            const direction = new THREE.Vector3(0, 1, 0);
            direction.applyQuaternion(this.ship.quaternion);
            direction.z = 0; // Keep in 2D plane
            this.ship.velocity.add(direction.multiplyScalar(this.ship.acceleration));
        }

        // Handle continuous shooting
        if (this.keys[' ']) {
            const currentTime = Date.now();
            if (currentTime - this.lastShot >= this.shootCooldown) {
                this.shoot();
                this.lastShot = currentTime;
            }
        }

        // Apply friction
        this.ship.velocity.multiplyScalar(this.ship.friction);
        this.ship.position.add(this.ship.velocity);
        this.ship.position.z = 0; // Keep in 2D plane

        // Screen wrapping for ship
        this.wrapPosition(this.ship.position);

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.position.add(bullet.velocity);
            bullet.position.z = 0; // Keep in 2D plane

            // Remove bullets that are off screen
            if (Math.abs(bullet.position.x) > 30 || Math.abs(bullet.position.y) > 30) {
                this.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }

        // Update asteroids
        for (const asteroid of this.asteroids) {
            asteroid.position.add(asteroid.velocity);
            asteroid.position.z = 0; // Keep in 2D plane
            asteroid.rotation.x += asteroid.rotationSpeed.x;
            asteroid.rotation.y += asteroid.rotationSpeed.y;
            asteroid.rotation.z += asteroid.rotationSpeed.z;
            this.wrapPosition(asteroid.position);
        }

        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.position.add(explosion.velocity);
            explosion.position.z = 0; // Keep in 2D plane
            explosion.life--;
            
            if (explosion.life <= 0) {
                this.scene.remove(explosion);
                this.explosions.splice(i, 1);
            }
        }

        this.checkCollisions();

        // Check if all asteroids are destroyed
        if (this.asteroids.length === 0) {
            this.spawnLevelAsteroids();
        }

        this.renderer.render(this.scene, this.camera);
        this.gameLoop = requestAnimationFrame(() => this.update());
    }

    wrapPosition(position) {
        const margin = 2;
        const halfViewSize = this.viewSize / 2;
        
        if (position.x < -halfViewSize - margin) position.x = halfViewSize + margin;
        if (position.x > halfViewSize + margin) position.x = -halfViewSize - margin;
        if (position.y < -halfViewSize - margin) position.y = halfViewSize + margin;
        if (position.y > halfViewSize + margin) position.y = -halfViewSize - margin;
    }

    onWindowResize() {
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Recalculate view size to maintain square aspect ratio
        const aspectRatio = window.innerWidth / window.innerHeight;
        let width, height;
        
        if (aspectRatio > 1) {
            // Window is wider than tall
            height = this.viewSize;
            width = height * aspectRatio;
        } else {
            // Window is taller than wide
            width = this.viewSize;
            height = width / aspectRatio;
        }
        
        // Update camera
        this.camera.left = -width/2;
        this.camera.right = width/2;
        this.camera.top = height/2;
        this.camera.bottom = -height/2;
        this.camera.updateProjectionMatrix();
    }

    endGame() {
        this.isGameOver = true;
        this.gameOverElement.style.display = 'block';
        cancelAnimationFrame(this.gameLoop);
    }

    restart() {
        // Reset ship
        this.ship.position.set(0, 0, 0);
        this.ship.velocity.set(0, 0, 0);
        this.ship.rotation.set(0, 0, 0);
        
        // Reset game state
        this.isGameOver = false;
        this.score = 0;
        this.level = 1;
        this.updateScore();
        this.updateLevel();
        this.gameOverElement.style.display = 'none';
        
        // Clear existing asteroids
        for (const asteroid of this.asteroids) {
            this.scene.remove(asteroid);
        }
        this.asteroids = [];
        
        // Spawn new asteroids
        this.spawnLevelAsteroids();
        
        // Restart game loop
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
