import React, { useState } from 'react';
import { PuzzleBoard } from './PuzzleBoard.jsx';
import { Stepper } from './Stepper.jsx';
import { sound } from '../services/audio.js';
import { Storage } from '../services/storage.js';

export function PuzzleScreen({
  playerName,
  selectedPuzzleImage,
  gridState,
  moves,
  timeFormatted,
  hintTile,
  onTileMove,
  onRequestHint,
  onAutoMove,
  onRestart
}) {
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showGhost, setShowGhost] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const handleInvalidMove = () => {
    sound.playError();
    setToastMessage('Move a neighboring piece');
    setTimeout(() => {
      setToastMessage(null);
    }, 1500);
  };

  return (
    <div className="step-screen-view">
      {/* Player Greeting Header */}
      <div className="player-greet-header">
        <div className="player-avatar-circle-sm">
          <span>🧩</span>
        </div>
        <span className="player-greet-name">Hi, {playerName || 'Player'}!</span>
      </div>

      {/* Screen Title */}
      <h2 className="puzzle-screen-title" style={{ marginBottom: '6px' }}>
        Complete the Puzzle
      </h2>

      {/* Helper Assistance Toggles: Numbers & Ghost Guide */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setShowNumbers(!showNumbers);
          }}
          style={{
            background: showNumbers ? '#FEF08A' : 'rgba(255, 255, 255, 0.2)',
            color: showNumbers ? '#854D0E' : '#FFFFFF',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 150ms ease'
          }}
        >
          <span>🔢</span>
          <span>Numbers: {showNumbers ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setShowGhost(!showGhost);
          }}
          style={{
            background: showGhost ? '#BFDBFE' : 'rgba(255, 255, 255, 0.2)',
            color: showGhost ? '#1E40AF' : '#FFFFFF',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 150ms ease'
          }}
        >
          <span>👻</span>
          <span>Guide: {showGhost ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Stats Badges Row */}
      <div className="stats-pills-row" style={{ marginBottom: '8px' }}>
        <div className="stat-pill-badge">
          <span>⭐</span>
          <span>Moves: <span className="highlight">{moves}</span></span>
        </div>
        <div className="stat-pill-badge">
          <span>⏱</span>
          <span>Time: <span className="highlight">{timeFormatted}</span></span>
        </div>
      </div>

      {/* Direct On-Screen Target Reference Strip */}
      <div
        className="target-goal-preview-strip"
        onClick={() => {
          sound.playTap();
          setShowOriginalModal(true);
        }}
        style={{ cursor: 'pointer' }}
        title="Click to view large target image"
      >
        <div
          className="target-goal-thumb"
          style={{ backgroundImage: `url("${selectedPuzzleImage?.url}")` }}
        />
        <div className="target-goal-info">
          <span className="target-goal-label">🎯 Original Picture</span>
          <span className="target-goal-title">{selectedPuzzleImage?.title || 'Target Image'}</span>
          <span className="target-goal-hint-text">🔍 Tap to zoom reference</span>
        </div>
        <span style={{ fontSize: '18px', color: '#2563EB' }}>👁</span>
      </div>

      {/* Sliced 3D Jigsaw Puzzle Board Container */}
      <div style={{ position: 'relative', width: '100%' }}>
        <PuzzleBoard
          gridState={gridState}
          imageUrl={selectedPuzzleImage?.url}
          hintTile={hintTile}
          showNumbers={showNumbers}
          showGhost={showGhost}
          onTileMove={onTileMove}
          onInvalidMove={handleInvalidMove}
        />

        {/* Invalid Tap Toast Notification */}
        {toastMessage && (
          <div className="puzzle-toast-pill">
            ⚠️ {toastMessage}
          </div>
        )}
      </div>

      {/* Action Controls: 💡 Hint, ↻ Restart */}
      <div className="puzzle-btns-row">
        <button
          className="btn-gold-3d"
          style={{ height: '48px', fontSize: '14px' }}
          onClick={() => {
            sound.playTap();
            onRequestHint();
          }}
        >
          <span>💡</span>
          <span>Hint</span>
        </button>

        <button
          className="btn-purple-3d"
          style={{ height: '48px', fontSize: '14px' }}
          onClick={() => {
            sound.playTap();
            onRestart();
          }}
        >
          <span>↻</span>
          <span>Restart</span>
        </button>
      </div>

      {/* Progress Stepper: 2 of 3 */}
      <Stepper currentStep={2} totalSteps={3} />

      {/* Expanded Full Target Image Preview Modal */}
      {showOriginalModal && (
        <div className="original-preview-overlay" onClick={() => setShowOriginalModal(false)}>
          <div className="original-preview-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
              🎯 Target Original Picture
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
              {selectedPuzzleImage?.title}
            </p>
            <div
              className="original-preview-img-box"
              style={{ backgroundImage: `url("${selectedPuzzleImage?.url}")` }}
            />
            <button
              type="button"
              className="btn-gold-3d"
              style={{ height: '44px', fontSize: '14px' }}
              onClick={() => setShowOriginalModal(false)}
            >
              Close Reference
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
