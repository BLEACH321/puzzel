import React, { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG, PUZZLE_IMAGES_LIST } from './services/config.js';
import { generateSolvableBoard, isGoal, getOptimalNextMove } from './services/solver.js';
import { Storage } from './services/storage.js';
import { SpreadsheetService } from './services/spreadsheet.js';
import { sound } from './services/audio.js';

import { HomeScreen } from './components/HomeScreen.jsx';
import { PuzzleScreen } from './components/PuzzleScreen.jsx';
import { CompletionScreen } from './components/CompletionScreen.jsx';

import './styles/design-system.css';
import './styles/components.css';
import './styles/puzzle.css';

export function App() {
  // Step state: 1 = Welcome, 2 = Complete Puzzle, 3 = Completion & Spreadsheet Sync
  const [step, setStep] = useState(1);

  // Player name
  const [playerName, setPlayerName] = useState(() => Storage.getPlayerName() || APP_CONFIG.DEFAULT_NAME);

  // Difficulty mode: 'easy' by default
  const [difficulty, setDifficulty] = useState('easy');

  // Puzzle Image: Automatically picked randomly from uploaded pool
  const [selectedPuzzleImage, setSelectedPuzzleImage] = useState(() => {
    return PUZZLE_IMAGES_LIST[Math.floor(Math.random() * PUZZLE_IMAGES_LIST.length)];
  });

  // Puzzle State
  const [gridState, setGridState] = useState(() => generateSolvableBoard(3, 'easy'));
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hintTile, setHintTile] = useState(null);

  // Score
  const [lastScore, setLastScore] = useState(980);

  // Format time MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Timer
  useEffect(() => {
    let timer = null;
    if (step === 2 && isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, isPlaying]);

  // Start new game with easy friendly scramble
  const startNewGame = useCallback((diff = 'easy') => {
    const randomImg = PUZZLE_IMAGES_LIST[Math.floor(Math.random() * PUZZLE_IMAGES_LIST.length)];
    setSelectedPuzzleImage(randomImg);

    const newBoard = generateSolvableBoard(3, diff);
    setGridState(newBoard);
    setMoves(0);
    setElapsedSeconds(0);
    setHintTile(null);
    setIsPlaying(true);
  }, []);

  // Handle Difficulty Change
  const handleChangeDifficulty = (newDiff) => {
    setDifficulty(newDiff);
    startNewGame(newDiff);
  };

  // Continue from Step 1 to Step 2
  const handleContinueFromWelcome = () => {
    const cleanName = playerName.trim() || APP_CONFIG.DEFAULT_NAME;
    Storage.setPlayerName(cleanName);
    setPlayerName(cleanName);
    startNewGame(difficulty);
    setStep(2);
  };

  // Move Tile handler (tap or swipe)
  const handleTileMove = (tileIndex, swipeDirection = null) => {
    if (step !== 2 || !isPlaying) return;

    const blankIdx = gridState.indexOf(0);
    const tileVal = gridState[tileIndex];

    if (tileVal === 0) return;

    const tRow = Math.floor(tileIndex / 3);
    const tCol = tileIndex % 3;
    const bRow = Math.floor(blankIdx / 3);
    const bCol = blankIdx % 3;

    // Check orthogonal adjacency
    const dr = bRow - tRow;
    const dc = bCol - tCol;
    const isAdjacent = (Math.abs(dr) + Math.abs(dc)) === 1;

    if (!isAdjacent) {
      sound.playError();
      return;
    }

    // Verify swipe direction if provided
    if (swipeDirection) {
      let expected = null;
      if (dr === -1 && dc === 0) expected = 'up';
      else if (dr === 1 && dc === 0) expected = 'down';
      else if (dr === 0 && dc === -1) expected = 'left';
      else if (dr === 0 && dc === 1) expected = 'right';

      if (expected !== swipeDirection) return;
    }

    // Execute slide move with snap sound
    const nextState = [...gridState];
    nextState[blankIdx] = tileVal;
    nextState[tileIndex] = 0;

    setGridState(nextState);
    setMoves((prev) => prev + 1);
    setHintTile(null);
    sound.playSlide();

    // Check Victory Condition
    if (isGoal(nextState, 3)) {
      handleVictory(moves + 1, elapsedSeconds);
    }
  };

  // Request A* Hint
  const handleRequestHint = () => {
    if (step !== 2 || !isPlaying) return;

    const optimalMove = getOptimalNextMove(gridState, 3);
    if (optimalMove) {
      setHintTile(optimalMove.tile);
      sound.playHint();

      setTimeout(() => {
        setHintTile(null);
      }, 2500);
    }
  };

  // Auto Move / Step Assist
  const handleAutoMove = () => {
    if (step !== 2 || !isPlaying) return;

    const optimalMove = getOptimalNextMove(gridState, 3);
    if (optimalMove) {
      handleTileMove(optimalMove.index, null);
    }
  };

  // Victory Handler & Automatic Spreadsheet Recording
  const handleVictory = (finalMoves, finalTimeSec) => {
    setIsPlaying(false);
    sound.playVictory();

    const baseScore = 1500;
    const timePenalty = finalTimeSec * 3;
    const movePenalty = finalMoves * 6;
    const score = Math.max(500, Math.round(baseScore - timePenalty - movePenalty));
    setLastScore(score);

    // Auto-record player result in Google Spreadsheet / local database
    SpreadsheetService.recordResult({
      name: playerName || 'Player',
      moves: finalMoves,
      timeFormatted: formatTime(finalTimeSec),
      timeSeconds: finalTimeSec,
      score: score,
      puzzleImage: selectedPuzzleImage?.title || 'Community Image'
    });

    setTimeout(() => {
      setStep(3);
    }, 600);
  };

  // Restart puzzle
  const handleRestart = () => {
    startNewGame(difficulty);
  };

  // Play Again from Step 3
  const handlePlayAgain = () => {
    startNewGame(difficulty);
    setStep(2);
  };

  return (
    <div className="game-app-shell">
      {/* Step 1: Welcome & Name Input */}
      {step === 1 && (
        <HomeScreen
          playerName={playerName}
          setPlayerName={setPlayerName}
          onContinue={handleContinueFromWelcome}
        />
      )}

      {/* Step 2: Complete the Puzzle */}
      {step === 2 && (
        <PuzzleScreen
          playerName={playerName}
          selectedPuzzleImage={selectedPuzzleImage}
          gridState={gridState}
          moves={moves}
          timeFormatted={formatTime(elapsedSeconds)}
          hintTile={hintTile}
          difficulty={difficulty}
          onChangeDifficulty={handleChangeDifficulty}
          onTileMove={handleTileMove}
          onRequestHint={handleRequestHint}
          onAutoMove={handleAutoMove}
          onRestart={handleRestart}
        />
      )}

      {/* Step 3: Completion & Spreadsheet Record (No fake leaderboard) */}
      {step === 3 && (
        <CompletionScreen
          playerName={playerName}
          moves={moves}
          timeFormatted={formatTime(elapsedSeconds)}
          score={lastScore}
          selectedPuzzleImage={selectedPuzzleImage}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
