// LocalStorage Persistence Service for React 8-Puzzle

import { APP_CONFIG, INITIAL_LEADERBOARD } from './config.js';

const STORAGE_KEYS = {
  PLAYER_NAME: '8puzzle_react_player_name',
  PARTICIPANT_ID: '8puzzle_react_participant_id',
  LEADERBOARD: '8puzzle_react_leaderboard',
  PLAYER_STATS: '8puzzle_react_player_stats',
  TUTORIAL_SEEN: '8puzzle_react_tutorial_seen',
  DIFFICULTY: '8puzzle_react_difficulty'
};

export const Storage = {
  getPlayerName() {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || APP_CONFIG.DEFAULT_NAME;
  },

  setPlayerName(name) {
    if (name && name.trim()) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name.trim());
    }
  },

  getLeaderboard() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    this.saveLeaderboard(INITIAL_LEADERBOARD);
    return INITIAL_LEADERBOARD;
  },

  saveLeaderboard(list) {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
  },

  getTutorialSeen() {
    return localStorage.getItem(STORAGE_KEYS.TUTORIAL_SEEN) === 'true';
  },

  setTutorialSeen(seen) {
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_SEEN, String(seen));
  },

  getDifficulty() {
    return localStorage.getItem(STORAGE_KEYS.DIFFICULTY) || 'normal';
  },

  setDifficulty(diff) {
    localStorage.setItem(STORAGE_KEYS.DIFFICULTY, diff);
  }
};
