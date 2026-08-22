// Main Application Bootstrap for 8-Puzzle Mobile

import { PuzzleEngine } from './puzzle-engine.js';
import { UIController } from './ui-controller.js';
import { GestureController } from './gestures.js';

document.addEventListener('DOMContentLoaded', () => {
  let ui;
  let gestures;

  // Initialize Puzzle Engine
  const engine = new PuzzleEngine({
    onTick: (elapsedSec, timeStr) => {
      if (ui) {
        ui.updateStats(timeStr, engine.moves);
      }
    },
    onMove: (moves) => {
      if (ui) {
        ui.updateStats(engine.formatTime(engine.elapsedSeconds), moves);
      }
    },
    onBoardUpdate: (state, moveDetails) => {
      if (ui) {
        ui.renderBoard(state, moveDetails);
      }
    },
    onHint: (tileVal, hintsRemaining) => {
      if (ui) {
        ui.updateHintButtonState(hintsRemaining);
      }
    },
    onWin: (results) => {
      if (ui) {
        ui.showVictoryModal(results);
      }
    }
  });

  // Initialize UI Controller
  ui = new UIController(engine);

  // Initialize Touch & Swipe Gestures on Puzzle Board
  const boardEl = document.getElementById('puzzle-board-grid');
  if (boardEl) {
    gestures = new GestureController(boardEl, (tileIndex, direction, gestureType) => {
      engine.attemptMove(tileIndex, direction);
    });
  }

  // Keyboard Arrow Keys fallback for accessibility / testing
  window.addEventListener('keydown', (e) => {
    if (ui.currentScreen !== 'puzzle') return;
    const blankIdx = engine.state.indexOf(0);
    const bRow = Math.floor(blankIdx / 3);
    const bCol = blankIdx % 3;

    let targetIdx = null;
    if (e.key === 'ArrowUp' && bRow < 2) {
      // Tile below moves UP into blank
      targetIdx = (bRow + 1) * 3 + bCol;
    } else if (e.key === 'ArrowDown' && bRow > 0) {
      // Tile above moves DOWN into blank
      targetIdx = (bRow - 1) * 3 + bCol;
    } else if (e.key === 'ArrowLeft' && bCol < 2) {
      // Tile right moves LEFT into blank
      targetIdx = bRow * 3 + (bCol + 1);
    } else if (e.key === 'ArrowRight' && bCol > 0) {
      // Tile left moves RIGHT into blank
      targetIdx = bRow * 3 + (bCol - 1);
    }

    if (targetIdx !== null) {
      engine.attemptMove(targetIdx, null);
    }
  });
});
