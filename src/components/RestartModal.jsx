import React from 'react';
import { sound } from '../services/audio.js';

export function RestartModal({ onCancel, onConfirm }) {
  return (
    <div className="overlay-backdrop">
      <div className="modal-dialog-box">
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Restart Puzzle?
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Your current progress will be lost.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            className="btn-secondary-card"
            onClick={() => {
              sound.playTap();
              onCancel();
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary-purple"
            onClick={() => {
              sound.playTap();
              onConfirm();
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
