import React, { useEffect, useRef } from 'react';
import { sound } from '../services/audio.js';

export function VictoryModal({
  results,
  playerName,
  participantId,
  onPlayAgain,
  onViewLeaderboard
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 390;
    canvas.height = canvas.offsetHeight || 844;

    const colors = ['#5844ED', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6'];
    const particles = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.3),
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="overlay-backdrop">
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      />
      <div className="modal-dialog-box" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '38px', marginBottom: '6px' }}>🎉</div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.5px', marginBottom: '12px' }}>
          PUZZLE SOLVED!
        </h2>

        {/* Full Image Artwork Reveal */}
        <div
          style={{
            width: '140px',
            height: '140px',
            margin: '0 auto 12px',
            borderRadius: 'var(--radius-md)',
            border: '3px solid var(--primary)',
            boxShadow: 'var(--shadow-md)',
            backgroundImage: `url("${results.themeImage?.url}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          {playerName} · #{participantId}
        </div>

        {/* Summary Stats Grid */}
        <div className="stats-side-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
              {results.score}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Score
            </div>
          </div>
          <div style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
              {results.timeFormatted}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Time
            </div>
          </div>
          <div style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
              {results.moves}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Moves
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            className="btn-primary-purple"
            onClick={() => {
              sound.playTap();
              onPlayAgain();
            }}
          >
            Play Again
          </button>
          <button
            className="btn-secondary-card"
            onClick={() => {
              sound.playTap();
              onViewLeaderboard();
            }}
          >
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
