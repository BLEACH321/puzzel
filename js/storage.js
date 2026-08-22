// LocalStorage Management for 8-Puzzle Mobile

import { APP_CONFIG, INITIAL_LEADERBOARD } from './config.js';

const STORAGE_KEYS = {
  PLAYER_NAME: '8puzzle_player_name',
  PARTICIPANT_ID: '8puzzle_participant_id',
  LEADERBOARD: '8puzzle_leaderboard_records',
  PLAYER_STATS: '8puzzle_player_stats',
  AUDIO_ENABLED: '8puzzle_audio_enabled',
  SELECTED_IMAGE_ID: '8puzzle_selected_img_id',
  CUSTOM_IMAGES: '8puzzle_custom_images'
};

export const Storage = {
  getPlayerName() {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || APP_CONFIG.DEFAULT_PLAYER_NAME;
  },

  setPlayerName(name) {
    if (name && name.trim()) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name.trim());
    }
  },

  getParticipantId() {
    let id = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_ID);
    if (!id) {
      id = APP_CONFIG.DEFAULT_PARTICIPANT_ID;
      localStorage.setItem(STORAGE_KEYS.PARTICIPANT_ID, id);
    }
    return id;
  },

  setParticipantId(id) {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANT_ID, id);
  },

  getLeaderboard() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    // Default fallback
    this.saveLeaderboard(INITIAL_LEADERBOARD);
    return INITIAL_LEADERBOARD;
  },

  saveLeaderboard(list) {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
  },

  addScoreRecord(record) {
    const list = this.getLeaderboard();
    list.push(record);
    // Sort descending by score, then ascending by time
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSec - b.timeSec;
    });

    // Update ranks and badges
    const updated = list.map((item, idx) => {
      const rank = idx + 1;
      let badge = `#${rank}`;
      if (rank === 1) badge = '🥇';
      else if (rank === 2) badge = '🥈';
      else if (rank === 3) badge = '🥉';

      return {
        ...item,
        rank,
        badge
      };
    });

    this.saveLeaderboard(updated);
    this.updatePlayerStats(record);
    return updated;
  },

  getPlayerStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      bestScore: 0,
      bestTimeSec: 9999,
      fewestMoves: 9999,
      hintsUsed: 0
    };
  },

  updatePlayerStats(lastGame) {
    const stats = this.getPlayerStats();
    stats.gamesPlayed += 1;
    stats.gamesWon += 1;
    stats.bestScore = Math.max(stats.bestScore, lastGame.score);
    stats.bestTimeSec = Math.min(stats.bestTimeSec, lastGame.timeSec);
    stats.fewestMoves = Math.min(stats.fewestMoves, lastGame.moves);
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
    return stats;
  },

  getAudioSetting() {
    const val = localStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED);
    return val === null ? true : val === 'true';
  },

  setAudioSetting(enabled) {
    localStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, String(enabled));
  },

  getSelectedImageId() {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_IMAGE_ID) || 'puzzle_mascot';
  },

  setSelectedImageId(id) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_IMAGE_ID, id);
  }
};
