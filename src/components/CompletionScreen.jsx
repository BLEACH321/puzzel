import React from 'react';
import { TROPHY_HERO_SVG } from '../services/config.js';
import { sound } from '../services/audio.js';
import { Stepper } from './Stepper.jsx';

export function CompletionScreen({
  playerName,
  moves,
  timeFormatted,
  score,
  selectedPuzzleImage,
  onPlayAgain
}) {
  const playerFirstName = (playerName || 'Player').trim().split(' ')[0] || 'Player';

  return (
    <div className="step-screen-view">
      {/* 3D Glowing Golden Trophy Artwork */}
      <div
        className="leaderboard-trophy-box"
        dangerouslySetInnerHTML={{ __html: TROPHY_HERO_SVG }}
      />

      {/* Main Titles */}
      <h1 className="welcome-title-bold" style={{ fontSize: '26px', marginBottom: '4px' }}>
        Puzzle Solved!
      </h1>
      <p className="welcome-subtitle-text" style={{ marginBottom: '14px' }}>
        Congratulations, {playerFirstName}! 🎉
      </p>

      {/* Victory Summary Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '18px 16px',
          boxShadow: '0 16px 32px rgba(13, 38, 181, 0.35)',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        {/* Completed Image Preview */}
        {selectedPuzzleImage?.url && (
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '18px',
              backgroundImage: `url("${selectedPuzzleImage.url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 8px 18px rgba(0, 0, 0, 0.18)',
              border: '3px solid #3B82F6'
            }}
          />
        )}

        {/* Player Name & Badge */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#1E1B4B' }}>
            {playerFirstName}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
            {selectedPuzzleImage?.title || 'Completed Puzzle'}
          </div>
        </div>

        {/* 3-Column Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            width: '100%'
          }}
        >
          {/* Moves */}
          <div
            style={{
              background: '#EFF6FF',
              border: '1.5px solid #BFDBFE',
              borderRadius: '16px',
              padding: '10px 6px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1E40AF' }}>
              {moves}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              ⭐ Moves
            </div>
          </div>

          {/* Time */}
          <div
            style={{
              background: '#EFF6FF',
              border: '1.5px solid #BFDBFE',
              borderRadius: '16px',
              padding: '10px 6px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1E40AF' }}>
              {timeFormatted}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              ⏱ Time
            </div>
          </div>

          {/* Score */}
          <div
            style={{
              background: '#FEF9C3',
              border: '1.5px solid #FDE047',
              borderRadius: '16px',
              padding: '10px 6px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#854D0E' }}>
              {score.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#A16207', textTransform: 'uppercase' }}>
              🏆 Score
            </div>
          </div>
        </div>
      </div>

      {/* 3D Golden Play Again Button */}
      <button
        type="button"
        className="btn-gold-3d"
        onClick={() => {
          sound.playTap();
          onPlayAgain();
        }}
      >
        <span>▶</span>
        <span>Play Again</span>
      </button>

      {/* Progress Stepper: 3 of 3 */}
      <Stepper currentStep={3} totalSteps={3} />
    </div>
  );
}

