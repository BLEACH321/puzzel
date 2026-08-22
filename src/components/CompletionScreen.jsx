import React, { useState } from 'react';
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
  const [showSettings, setShowSettings] = useState(false);
  const [webhookInput, setWebhookInput] = useState(() => SpreadsheetService.getWebhookUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveWebhook = (e) => {
    e.preventDefault();
    SpreadsheetService.setWebhookUrl(webhookInput);
    setSavedSuccess(true);
    sound.playTap();
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleDownloadCSV = () => {
    sound.playTap();
    SpreadsheetService.downloadCSV();
  };

  return (
    <div className="step-screen-view">
      {/* 3D Glowing Golden Trophy Artwork */}
      <div
        className="leaderboard-trophy-box"
        dangerouslySetInnerHTML={{ __html: TROPHY_HERO_SVG }}
      />

      {/* Main Screen Title */}
      <h1 className="welcome-title-bold" style={{ fontSize: '26px' }}>
        Congratulations!
      </h1>
      <p className="welcome-subtitle-text" style={{ marginBottom: '14px' }}>
        You solved the puzzle successfully!
      </p>

      {/* Player Score & Stats Summary Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '16px',
          boxShadow: '0 16px 32px rgba(13, 38, 181, 0.35)',
          marginBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#EFF6FF',
              border: '2px solid #3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            👤
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#1E1B4B' }}>
              {playerName || 'Player'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
              Puzzle: {selectedPuzzleImage?.title || 'Community Image'}
            </div>
          </div>
        </div>

        {/* 3-Stat Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
          <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>MOVES</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#2563EB' }}>{moves}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>TIME</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>{timeFormatted}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>SCORE</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#D97706' }}>{score}</div>
          </div>
        </div>

        {/* Spreadsheet Status & Actions */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '14px',
            padding: '10px 12px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📊</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>
                Saved to Spreadsheet
              </div>
              <div style={{ fontSize: '10px', color: '#15803D' }}>
                {SpreadsheetService.getWebhookUrl() ? 'Synced to Cloud Sheet' : 'Recorded in local database'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadCSV}
            style={{
              background: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
            }}
          >
            📥 Download CSV
          </button>
        </div>

        {/* Google Sheet URL Setup link */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#4F46E5',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ⚙️ Connect Custom Google Sheet Webhook URL
          </button>
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

      {/* Google Sheet Webhook Configuration Modal */}
      {showSettings && (
        <div className="original-preview-overlay" onClick={() => setShowSettings(false)}>
          <div className="original-preview-card" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E1B4B', marginBottom: '6px' }}>
              📊 Google Spreadsheet Sync
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
              Paste your Google Apps Script Web App URL or SheetDB endpoint below to automatically push all game results directly into your Google Sheet.
            </p>

            <form onSubmit={handleSaveWebhook}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Google Sheet Webhook / Apps Script URL:
              </label>
              <input
                type="url"
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '12px',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />

              {savedSuccess && (
                <div style={{ color: '#16A34A', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>
                  ✅ Google Sheet URL saved successfully!
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  className="btn-gold-3d"
                  style={{ height: '42px', fontSize: '13px', flex: 1 }}
                >
                  Save URL
                </button>
                <button
                  type="button"
                  className="btn-purple-3d"
                  style={{ height: '42px', fontSize: '13px', flex: 1 }}
                  onClick={() => setShowSettings(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
