// 8-Puzzle Game State & Logic Engine

import { GOAL_STATE, isGoal, generateSolvablePuzzle, getOptimalNextMove } from './solver.js';
import { APP_CONFIG } from './config.js';
import { sound } from './audio.js';

export class PuzzleEngine {
  constructor(options = {}) {
    this.options = options;
    this.state = [...GOAL_STATE];
    this.moves = 0;
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.isSolved = false;
    this.isPlaying = false;
    this.hintsRemaining = APP_CONFIG.MAX_HINTS;
    this.currentImage = null;
    this.activeHintTile = null;

    // Callbacks
    this.onTick = options.onTick || (() => {});
    this.onMove = options.onMove || (() => {});
    this.onWin = options.onWin || (() => {});
    this.onHint = options.onHint || (() => {});
    this.onBoardUpdate = options.onBoardUpdate || (() => {});
  }

  setImage(imageObj) {
    this.currentImage = imageObj;
  }

  startNewGame(difficulty = 'standard') {
    this.stopTimer();
    this.moves = 0;
    this.elapsedSeconds = 0;
    this.isSolved = false;
    this.isPlaying = true;
    this.hintsRemaining = APP_CONFIG.MAX_HINTS;
    this.activeHintTile = null;

    // Generate guaranteed solvable board
    this.state = generateSolvablePuzzle(difficulty);

    this.onBoardUpdate(this.state, null);
    this.startTimer();
    this.onMove(this.moves);
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.isPlaying && !this.isSolved) {
        this.elapsedSeconds++;
        this.onTick(this.elapsedSeconds, this.formatTime(this.elapsedSeconds));
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Attempts to move a tile given its current index in the 3x3 array (0-8)
   * If swipeDirection is provided, verifies it matches the vector to blank
   */
  attemptMove(tileGridIndex, swipeDirection = null) {
    if (!this.isPlaying || this.isSolved) return false;

    const blankIdx = this.state.indexOf(0);
    const tileVal = this.state[tileGridIndex];

    if (tileVal === 0) return false;

    const tRow = Math.floor(tileGridIndex / 3);
    const tCol = tileGridIndex % 3;
    const bRow = Math.floor(blankIdx / 3);
    const bCol = blankIdx % 3;

    // Check orthogonal adjacency
    const dr = bRow - tRow;
    const dc = bCol - tCol;
    const isAdjacent = (Math.abs(dr) + Math.abs(dc)) === 1;

    if (!isAdjacent) {
      sound.playError();
      return false;
    }

    // If swipe direction specified, ensure swipe points toward the blank slot
    if (swipeDirection) {
      let expectedDir = null;
      if (dr === -1 && dc === 0) expectedDir = 'up';
      else if (dr === 1 && dc === 0) expectedDir = 'down';
      else if (dr === 0 && dc === -1) expectedDir = 'left';
      else if (dr === 0 && dc === 1) expectedDir = 'right';

      if (expectedDir !== swipeDirection) {
        return false;
      }
    }

    // Execute Move
    this.state[blankIdx] = tileVal;
    this.state[tileGridIndex] = 0;
    this.moves++;
    this.activeHintTile = null;

    sound.playSlide();

    // Notify listeners with move details for animation
    this.onBoardUpdate(this.state, {
      movedTile: tileVal,
      fromIndex: tileGridIndex,
      toIndex: blankIdx
    });

    this.onMove(this.moves);

    // Check Victory
    if (isGoal(this.state)) {
      this.handleVictory();
      return true;
    }

    return true;
  }

  requestHint() {
    if (!this.isPlaying || this.isSolved || this.hintsRemaining <= 0) {
      sound.playError();
      return null;
    }

    const nextStep = getOptimalNextMove(this.state);
    if (nextStep) {
      this.hintsRemaining--;
      this.activeHintTile = nextStep.tile;
      sound.playHint();
      this.onHint(nextStep.tile, this.hintsRemaining);
      return nextStep;
    }
    return null;
  }

  calculateScore() {
    const base = 2000;
    const timePenalty = this.elapsedSeconds * 8;
    const movePenalty = this.moves * 12;
    const hintBonus = this.hintsRemaining * 50;
    const rawScore = base - timePenalty - movePenalty + hintBonus;
    return Math.max(100, Math.round(rawScore));
  }

  handleVictory() {
    this.isSolved = true;
    this.isPlaying = false;
    this.stopTimer();

    sound.playVictory();

    const score = this.calculateScore();
    const results = {
      score,
      moves: this.moves,
      timeSec: this.elapsedSeconds,
      timeFormatted: this.formatTime(this.elapsedSeconds),
      hintsUsed: APP_CONFIG.MAX_HINTS - this.hintsRemaining,
      image: this.currentImage
    };

    setTimeout(() => {
      this.onWin(results);
    }, 400);
  }
}
