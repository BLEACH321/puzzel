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

  useEffect(() => {
    let isMounted = true;
    SpreadsheetService.getLiveLeaderboard().then((data) => {
      if (isMounted) {
        setLeaderboard(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [playerName, score]);

  return (
    <div className="step-screen-view">
      {/* 3D Glowing Golden Trophy Artwork */}
      <div
        className="leaderboard-trophy-box"
        dangerouslySetInnerHTML={{ __html: TROPHY_HERO_SVG }}
      />

      {/* Main Titles */}
      <h1 className="welcome-title-bold" style={{ fontSize: '26px', marginBottom: '2px' }}>
        Leaderboard
      </h1>
      <p className="welcome-subtitle-text" style={{ marginBottom: '12px' }}>
        Top Scores & Rankings
      </p>

      {/* Leaderboard Rankings Card with First Names */}
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '14px',
          boxShadow: '0 16px 32px rgba(13, 38, 181, 0.35)',
          marginBottom: '14px'
        }}
      >
        {/* Your Score Highlight Summary Strip */}
        <div
          style={{
            background: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '16px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>👤</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#1E40AF' }}>
                {playerFirstName} (You)
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                {moves} Moves • {timeFormatted}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 900, color: '#2563EB' }}>
            {score.toLocaleString()} pts
          </div>
        </div>

        {/* Stacked Leaderboard Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {leaderboard.slice(0, 5).map((p, idx) => {
            const isCurrent = p.name.toLowerCase() === playerFirstName.toLowerCase() && p.score === score;
            const rankMedal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;

            return (
              <div
                key={p.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '14px',
                  background: isCurrent ? '#FEF9C3' : idx === 0 ? '#FFFBEB' : '#F8FAFC',
                  border: isCurrent ? '2px solid #FACC15' : '1px solid #E2E8F0',
                  boxShadow: isCurrent ? '0 4px 10px rgba(250, 204, 21, 0.25)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                {/* Left: Rank + Avatar + First Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : idx === 2 ? '#D97706' : '#E2E8F0',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {idx < 3 ? rankMedal : idx + 1}
                  </div>

                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: p.avatarBg || '#3B82F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px'
                    }}
                  >
                    {p.avatar || '👤'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#1E1B4B' }}>
                      {p.name} {isCurrent ? '⭐' : ''}
                    </span>
                    {p.timeFormatted && (
                      <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                        {p.moves ? `${p.moves} moves • ` : ''}{p.timeFormatted}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Score */}
                <div style={{ fontSize: '14px', fontWeight: 900, color: idx === 0 ? '#D97706' : '#2563EB' }}>
                  {p.score ? p.score.toLocaleString() : score}
                </div>
              </div>
            );
          })}
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
