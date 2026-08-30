import React, { useState, useEffect } from 'react';
import { TROPHY_HERO_SVG } from '../services/config.js';
import { sound } from '../services/audio.js';
import { Stepper } from './Stepper.jsx';
import { SpreadsheetService } from '../services/spreadsheet.js';

export function CompletionScreen({
  playerName,
  moves,
  timeFormatted,
  score,
  selectedPuzzleImage,
  onPlayAgain
}) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const playerFirstName = (playerName || 'Player').trim().split(' ')[0] || 'Player';

  const loadLeaderboard = () => {
    setLoading(true);
    SpreadsheetService.getLiveLeaderboard().then((data) => {
      setLeaderboard(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadLeaderboard();
  }, [playerName, score]);

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
          padding: '16px 14px',
          boxShadow: '0 16px 32px rgba(13, 38, 181, 0.35)',
          marginBottom: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        {/* Completed Image Preview */}
        {selectedPuzzleImage?.url && (
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '16px',
              backgroundImage: `url("${selectedPuzzleImage.url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18)',
              border: '3px solid #3B82F6'
            }}
          />
        )}

        {/* Player Name & Badge */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '17px', fontWeight: 900, color: '#1E1B4B' }}>
            {playerFirstName}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
            {selectedPuzzleImage?.title || 'Completed Puzzle'}
          </div>
        </div>

        {/* 3-Column Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            width: '100%'
          }}
        >
          {/* Moves */}
          <div
            style={{
              background: '#EFF6FF',
              border: '1.5px solid #BFDBFE',
              borderRadius: '14px',
              padding: '8px 4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#1E40AF' }}>
              {moves}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              ⭐ Moves
            </div>
          </div>

          {/* Time */}
          <div
            style={{
              background: '#EFF6FF',
              border: '1.5px solid #BFDBFE',
              borderRadius: '14px',
              padding: '8px 4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#1E40AF' }}>
              {timeFormatted}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              ⏱ Time
            </div>
          </div>

          {/* Score */}
          <div
            style={{
              background: '#FEF9C3',
              border: '1.5px solid #FDE047',
              borderRadius: '14px',
              padding: '8px 4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#854D0E' }}>
              {score.toLocaleString()}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#A16207', textTransform: 'uppercase' }}>
              🏆 Score
            </div>
          </div>
        </div>
      </div>

      {/* Live SheetDB Leaderboard Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '14px',
          boxShadow: '0 12px 28px rgba(13, 38, 181, 0.25)',
          marginBottom: '14px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#1E1B4B' }}>
              Live Leaderboard
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              loadLeaderboard();
            }}
            style={{
              background: '#EEF2FF',
              color: '#4F46E5',
              border: '1px solid #C7D2FE',
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Syncing...' : '🔄 Refresh'}
          </button>
        </div>

        {/* Leaderboard Rows from SheetDB */}
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '12px', color: '#64748B', fontSize: '12px' }}>
            {loading ? 'Loading scores...' : 'No scores yet. You are the first!'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {leaderboard.map((item, idx) => {
              const isCurrent = item.name.toLowerCase() === playerFirstName.toLowerCase();
              const rankIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;

              return (
                <div
                  key={item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: '12px',
                    background: isCurrent ? '#FEF9C3' : idx === 0 ? '#FFFBEB' : '#F8FAFC',
                    border: isCurrent ? '1.5px solid #FACC15' : '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, minWidth: '20px', textAlign: 'center' }}>
                      {rankIcon}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E1B4B' }}>
                        {item.name} {isCurrent ? '⭐' : ''}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                        {item.moves ? `${item.moves} moves` : ''} {item.timeFormatted ? `• ${item.timeFormatted}` : ''}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#2563EB' }}>
                    {item.leaderborder || (item.score ? `${item.score.toLocaleString()} pts` : '')}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SheetDB Sync confirmation badge */}
        <div
          style={{
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: '10px', color: '#166534', fontWeight: 700 }}>
            Connected to SheetDB Live API
          </span>
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


