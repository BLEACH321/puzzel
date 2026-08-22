import React from 'react';
import { sound } from '../services/audio.js';

export function BottomNav({ activeScreen, onSelectScreen }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'puzzle', label: 'Puzzle', icon: '🧩' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Bottom Navigation">
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.id;
        return (
          <button
            key={tab.id}
            className={`bottom-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => {
              sound.playTap();
              onSelectScreen(tab.id);
            }}
          >
            <span className="tab-icon-wrap">{tab.icon}</span>
            <span className="tab-label-text">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
