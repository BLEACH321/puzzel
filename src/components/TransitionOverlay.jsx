import React from 'react';

export function TransitionOverlay({ playerName, participantId }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--primary-gradient)',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        color: '#FFFFFF',
        textAlign: 'center',
        animation: 'fadeIn 250ms ease-out'
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '2px', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
        PLAYER #{participantId}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '24px' }}>
        {playerName}
      </div>

      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.18)',
          border: '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '44px',
          marginBottom: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          animation: 'pulseSpin 1.6s ease-in-out infinite'
        }}
      >
        🧩
      </div>

      <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '1px', marginBottom: '6px' }}>
        ASSIGNING YOUR PUZZLE...
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
        Preparing your competition challenge
      </div>
    </div>
  );
}
