import React, { useState } from 'react';
import { PuzzleBoard } from './PuzzleBoard.jsx';
import { Stepper } from './Stepper.jsx';
import { sound } from '../services/audio.js';

export function PuzzleScreen({
  playerName,
  selectedPuzzleImage,
  gridState,
  moves,
  timeFormatted,
  hintTile,
  difficulty,
  onChangeDifficulty,
  onTileMove,
  onRequestHint,
  onAutoMove,
  onRestart
}) {
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleInvalidMove = () => {
    sound.playError();
    setToastMessage('Move a neighboring piece');
    setTimeout(() => {
      setToastMessage(null);
    }, 1400);
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

      {/* Difficulty Level Selector Chips */}
      <div className="difficulty-chips-row" style={{ marginBottom: '8px' }}>
        {[
          { key: 'easy', label: '🟢 Easy' },
          { key: 'normal', label: '⚡ Normal' },
          { key: 'hard', label: '🔥 Master' }
        ].map((d) => (
          <button
            key={d.key}
            type="button"
            className={`diff-chip-btn ${difficulty === d.key ? 'active' : ''}`}
            onClick={() => {
              sound.playTap();
              onChangeDifficulty(d.key);
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Stats Badges Row & Number Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '340px', marginBottom: '8px' }}>
        <div className="stats-pills-row" style={{ margin: 0, gap: '6px' }}>
          <div className="stat-pill-badge" style={{ padding: '4px 10px', fontSize: '11px' }}>
            <span>⭐</span>
            <span>Moves: <span className="highlight">{moves}</span></span>
          </div>
          <div className="stat-pill-badge" style={{ padding: '4px 10px', fontSize: '11px' }}>
            <span>⏱</span>
            <span>Time: <span className="highlight">{timeFormatted}</span></span>
          </div>
        </div>

        {/* Optional Clean Number & Guide Toggles */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setShowNumbers(!showNumbers);
            }}
            title="Toggle subtle tile numbers"
            style={{
              background: showNumbers ? '#FEF08A' : 'rgba(255, 255, 255, 0.2)',
              color: showNumbers ? '#854D0E' : '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '9999px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🔢 {showNumbers ? 'Numbers' : '123'}
          </button>
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
          <span className="target-goal-label">🎯 Target Goal</span>
          <span className="target-goal-title">{selectedPuzzleImage?.title || 'Target Image'}</span>
          <span className="target-goal-hint-text">🔍 Tap to zoom image</span>
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
      <div className="puzzle-btns-row" style={{ gap: '10px' }}>
        <button
          className="btn-gold-3d"
          style={{ height: '48px', fontSize: '15px' }}
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
          style={{ height: '48px', fontSize: '15px' }}
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
