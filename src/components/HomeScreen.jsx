import React from 'react';
import { MASCOT_HERO_SVG } from '../services/config.js';
import { sound } from '../services/audio.js';
import { Stepper } from './Stepper.jsx';

export function HomeScreen({
  playerName,
  setPlayerName,
  onContinue
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playTap();
    onContinue();
  };

  return (
    <div className="step-screen-view">
      {/* 3D Glowing Mascot Artwork */}
      <div
        className="welcome-mascot-box"
        dangerouslySetInnerHTML={{ __html: MASCOT_HERO_SVG }}
      />

      {/* Main Titles */}
      <h1 className="welcome-title-bold">Welcome!</h1>
      <p className="welcome-subtitle-text">Enter your first name</p>

      {/* White Input Card with Floating Avatar */}
      <form className="floating-avatar-card" onSubmit={handleSubmit}>
        <div className="floating-avatar-bubble">
          <span>👤</span>
        </div>

        <label className="card-field-label" htmlFor="first-name-input">
          name
        </label>
        <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
          <span className="input-icon-user">👤</span>
          <input
            id="first-name-input"
            type="text"
            className="name-input-styled-box"
            placeholder=""
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={18}
            autoFocus
          />
        </div>

        {/* 3D Golden Continue Button */}
        <button type="submit" className="btn-gold-3d">
          Continue
        </button>
      </form>

      {/* Progress Stepper: 1 of 3 */}
      <Stepper currentStep={1} totalSteps={3} />
    </div>
  );
}
