import React from 'react';
import { sound } from '../services/audio.js';

export function ProfileScreen({
  playerName,
  participantId,
  stats,
  isAudioOn,
  onToggleAudio,
  isDarkTheme,
  onToggleTheme
}) {
  const formatTime = (totalSec) => {
    if (totalSec === 9999 || !totalSec) return '--:--';
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="screen-view">
      <header className="mobile-header">
        <h1 className="header-title-text">👤 Player Profile</h1>
        <div style={{ width: '32px' }}></div>
      </header>

      {/* Profile Header Hero */}
      <div className="welcome-hero-card" style={{ marginBottom: '14px' }}>
        <div className="hero-text-content">
          <h2 className="hero-title">{playerName}</h2>
          <p className="hero-subtitle">Participant #{participantId}</p>
        </div>
        <div className="hero-artwork">
          <div
            className="lb-avatar-bubble"
            style={{ width: '60px', height: '60px', fontSize: '24px', background: 'rgba(255,255,255,0.25)' }}
          >
            {playerName.charAt(0).toUpperCase() || 'P'}
          </div>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div className="app-card">
        <h3 className="card-title-bold" style={{ marginBottom: '12px' }}>Career Stats</h3>
        <div className="stats-side-grid">
          <div className="stat-metric-card">
            <div className="stat-metric-icon">🎯</div>
            <div className="stat-metric-info">
              <span className="stat-metric-label">Solved</span>
              <span className="stat-metric-val">{stats.gamesWon}</span>
            </div>
          </div>
          <div className="stat-metric-card">
            <div className="stat-metric-icon">⭐</div>
            <div className="stat-metric-info">
              <span className="stat-metric-label">Best Score</span>
              <span className="stat-metric-val">{stats.bestScore}</span>
            </div>
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-icon">⚡</div>
          <div className="stat-metric-info">
            <span className="stat-metric-label">Speed Record</span>
            <span className="stat-metric-val">{formatTime(stats.bestTimeSec)}</span>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="app-card">
        <h3 className="card-title-bold" style={{ marginBottom: '14px' }}>Settings</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Sound Effects
          </span>
          <input
            type="checkbox"
            checked={isAudioOn}
            onChange={(e) => onToggleAudio(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Dark Mode
          </span>
          <input
            type="checkbox"
            checked={isDarkTheme}
            onChange={(e) => onToggleTheme(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
