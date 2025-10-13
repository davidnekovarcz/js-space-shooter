/**
 * Game Analytics Utilities for Space Shooter
 * 
 * Tracks game play events and maintains play counts in localStorage
 */

const STORAGE_KEY = 'playful_game_stats';
const GAME_NAME = 'Space Shooter';

/**
 * Get all game statistics from localStorage
 */
function getGameStats() {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading game stats:', error);
    return {};
  }
}

/**
 * Save game statistics to localStorage
 */
function saveGameStats(stats) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving game stats:', error);
  }
}

/**
 * Track when a game is played
 * Increments play count and updates timestamps
 */
function trackGamePlayed() {
  const stats = getGameStats();
  const now = new Date().toISOString();
  
  if (stats[GAME_NAME]) {
    // Update existing game stats
    stats[GAME_NAME].playCount += 1;
    stats[GAME_NAME].lastPlayed = now;
  } else {
    // Create new game stats
    stats[GAME_NAME] = {
      playCount: 1,
      lastPlayed: now,
      firstPlayed: now
    };
  }
  
  saveGameStats(stats);
  
  // Track with Google Analytics / GTM
  if (typeof window !== 'undefined' && window.trackEvent) {
    // Event 1: PLAY_GAME - tracks each play instance
    window.trackEvent('play_game', {
      game_name: GAME_NAME,
      timestamp: now
    });
    
    // Event 2: GAME_PLAYED_TOTAL - tracks cumulative play count per user
    window.trackEvent('game_played_total', {
      game_name: GAME_NAME,
      play_count: stats[GAME_NAME].playCount,
      first_played: stats[GAME_NAME].firstPlayed,
      last_played: stats[GAME_NAME].lastPlayed
    });
  }
}

/**
 * Get play count for this game
 */
function getGamePlayCount() {
  const stats = getGameStats();
  return stats[GAME_NAME]?.playCount || 0;
}

