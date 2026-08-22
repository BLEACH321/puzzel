import React from 'react';
import { TROPHY_HERO_SVG } from '../services/config.js';
import { Stepper } from './Stepper.jsx';
import { sound } from '../services/audio.js';

export function LeaderboardScreen({
  leaderboard,
  currentPlayerName,
  userScore,
  onPlayAgain
}) {
  return (
    <div className="step-screen-view">
      {/* 3D Glowing Trophy Artwork */}
      <div
        className="trophy-hero-box"
        dangerouslySetInnerHTML={{ __html: TROPHY_HERO_SVG }}
      />

      {/* Screen Heading */}
      <h2 className="leaderboard-screen-title">Leaderboard</h2>

      {/* White Leaderboard Card */}
      <div className="leaderboard-white-card">
        {leaderboard.map((player, idx) => {
          const isCurrent = player.name.toLowerCase() === (currentPlayerName || 'Alex').toLowerCase();
          
          let medalBg = '#F59E0B'; // 1st Gold
          if (idx === 1) medalBg = '#93C5FD'; // 2nd Silver/Blue
          if (idx === 2) medalBg = '#D97706'; // 3rd Bronze

          return (
            <div
              key={idx}
              className={`lb-player-row ${isCurrent ? 'highlighted' : ''}`}
            >
              <div className="lb-left">
                <div className="lb-medal-badge-3d" style={{ background: player.badgeBg || medalBg }}>
                  {player.badge || idx + 1}
                </div>
                <div className="lb-avatar-circle" style={{ background: player.avatarBg || '#F1F5F9' }}>
                  {player.avatar || '👤'}
                </div>
                <span className="lb-player-name">{player.name}</span>
              </div>
              <div className="lb-score-val">
                {player.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3D Golden Play Again Button */}
      <button
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
