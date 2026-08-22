import React, { useRef, useState, useMemo } from 'react';
import { getJigsawPiecePath } from '../services/jigsaw-paths.js';

export function PuzzleBoard({
  gridState,
  imageUrl,
  hintTile,
  showNumbers = true,
  showGhost = true,
  onTileMove,
  onInvalidMove
}) {
  const touchStartRef = useRef(null);
  const [selectedGridIdx, setSelectedGridIdx] = useState(null);
  const [shakingGridIdx, setShakingGridIdx] = useState(null);

  const TILE_SIZE = 100;
  const BOARD_SIZE = 300;

  // Memoized jigsaw SVG paths
  const piecePaths = useMemo(() => {
    const paths = {};
    for (let val = 1; val <= 9; val++) {
      paths[val] = getJigsawPiecePath(val, TILE_SIZE);
    }
    return paths;
  }, []);

  const blankGridIdx = gridState.indexOf(0);
  const blankRow = Math.floor(blankGridIdx / 3);
  const blankCol = blankGridIdx % 3;

  // Check orthogonal adjacency
  const checkIsAdjacent = (gridIdx) => {
    const r = Math.floor(gridIdx / 3);
    const c = gridIdx % 3;
    const dr = Math.abs(r - blankRow);
    const dc = Math.abs(c - blankCol);
    return (dr + dc) === 1;
  };

  // Primary Tap-To-Move
  const handleCellTap = (gridIdx) => {
    const tileVal = gridState[gridIdx];
    if (tileVal === 0) return;

    const isAdjacent = checkIsAdjacent(gridIdx);

    if (isAdjacent) {
      setSelectedGridIdx(gridIdx);
      setTimeout(() => {
        setSelectedGridIdx(null);
        onTileMove(gridIdx, null);
      }, 80);
    } else {
      setShakingGridIdx(gridIdx);
      if (onInvalidMove) onInvalidMove();
      setTimeout(() => {
        setShakingGridIdx(null);
      }, 300);
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e, gridIdx) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      gridIdx,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e, gridIdx) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const duration = Date.now() - touchStartRef.current.time;

    const minSwipeDist = 18;

    if (absX >= minSwipeDist || absY >= minSwipeDist) {
      let direction = null;
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      onTileMove(gridIdx, direction);
    } else if (duration < 400 && absX < 15 && absY < 15) {
      handleCellTap(gridIdx);
    }

    touchStartRef.current = null;
  };

  // Mouse Handlers
  const handleMouseDown = (e, gridIdx) => {
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      gridIdx,
      time: Date.now()
    };
  };

  const handleMouseUp = (e, gridIdx) => {
    if (!touchStartRef.current) return;
    const deltaX = e.clientX - touchStartRef.current.x;
    const deltaY = e.clientY - touchStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const duration = Date.now() - touchStartRef.current.time;

    const minSwipeDist = 18;

    if (absX >= minSwipeDist || absY >= minSwipeDist) {
      let direction = null;
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      onTileMove(gridIdx, direction);
    } else if (duration < 400 && absX < 15 && absY < 15) {
      handleCellTap(gridIdx);
    }

    touchStartRef.current = null;
  };

  return (
    <div className="jigsaw-board-outer-card">
      <svg
        className="jigsaw-svg-board"
        viewBox="-25 -25 350 350"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip Paths for 8 jigsaw pieces */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
            <clipPath key={`clip-${val}`} id={`jigsaw-clip-${val}`}>
              <path d={piecePaths[val]} />
            </clipPath>
          ))}

          {/* 3D Drop Shadow for physical pieces */}
          <filter id="jigsawPieceShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.35" />
          </filter>

          {/* Number badge pill gradient */}
          <linearGradient id="numBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE043"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </linearGradient>
        </defs>

        {/* Board Background Frame */}
        <rect
          x="-5"
          y="-5"
          width="310"
          height="310"
          rx="18"
          fill="#EEF2FF"
          stroke="#C7D2FE"
          strokeWidth="2"
        />

        {/* 1. Ghost Target Background (Watermark for super easy visual alignment) */}
        {showGhost && (
          <image
            href={imageUrl}
            x="0"
            y="0"
            width={BOARD_SIZE}
            height={BOARD_SIZE}
            preserveAspectRatio="xMidYMid slice"
            opacity="0.32"
          />
        )}

        {/* 2. Blank Target Destination Slot */}
        <g
          transform={`translate(${blankCol * TILE_SIZE}, ${blankRow * TILE_SIZE})`}
          className={`jigsaw-blank-slot ${selectedGridIdx !== null ? 'destination-glow' : ''}`}
        >
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="12"
            fill="#D8D8FE"
            fillOpacity="0.7"
            stroke="#818CF8"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#6366F1"
            fontSize="14"
            fontWeight="bold"
            opacity="0.7"
          >
            SLOT
          </text>
        </g>

        {/* 3. Sliced 3D Jigsaw Pieces */}
        {gridState.map((tileVal, gridIdx) => {
          if (tileVal === 0) return null;

          const gRow = Math.floor(gridIdx / 3);
          const gCol = gridIdx % 3;
          const posX = gCol * TILE_SIZE;
          const posY = gRow * TILE_SIZE;

          const isSelected = selectedGridIdx === gridIdx;
          const isShaking = shakingGridIdx === gridIdx;
          const isHinted = hintTile === tileVal;
          const isCorrect = (tileVal - 1) === gridIdx; // Already in correct spot!

          const sRow = Math.floor((tileVal - 1) / 3);
          const sCol = (tileVal - 1) % 3;
          const imageOffsetX = -sCol * TILE_SIZE;
          const imageOffsetY = -sRow * TILE_SIZE;

          const piecePath = piecePaths[tileVal];

          return (
            <g
              key={`tile-${tileVal}`}
              transform={`translate(${posX}, ${posY})`}
              filter="url(#jigsawPieceShadow)"
              className={`jigsaw-piece-group ${isSelected ? 'selected' : ''} ${isShaking ? 'invalid-shake' : ''} ${isHinted ? 'hint-pulse' : ''}`}
              onTouchStart={(e) => handleTouchStart(e, gridIdx)}
              onTouchEnd={(e) => handleTouchEnd(e, gridIdx)}
              onMouseDown={(e) => handleMouseDown(e, gridIdx)}
              onMouseUp={(e) => handleMouseUp(e, gridIdx)}
            >
              {/* Sliced Image clipped inside Jigsaw Tab/Socket Path */}
              <image
                href={imageUrl}
                x={imageOffsetX}
                y={imageOffsetY}
                width={BOARD_SIZE}
                height={BOARD_SIZE}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#jigsaw-clip-${tileVal})`}
              />

              {/* 3D Embossed Jigsaw Outline Overlay */}
              <path
                d={piecePath}
                fill="none"
                stroke={isCorrect ? "#4ADE80" : "#FFFFFF"}
                strokeWidth={isCorrect ? "3" : "2.2"}
                strokeOpacity={isCorrect ? "0.9" : "0.7"}
              />
              <path
                d={piecePath}
                fill="none"
                stroke="#1E1B4B"
                strokeWidth="1.2"
                strokeOpacity="0.25"
              />

              {/* Number Badge Helper (1..8) on top-left of piece */}
              {showNumbers && (
                <g transform="translate(10, 10)">
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="url(#numBadgeGrad)"
                    stroke="#D97706"
                    strokeWidth="1.5"
                  />
                  <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fill="#1E1B4B"
                    fontSize="13"
                    fontWeight="900"
                    fontFamily="system-ui, sans-serif"
                  >
                    {tileVal}
                  </text>
                </g>
              )}

              {/* Solved Spot Indicator Checkmark */}
              {isCorrect && (
                <g transform="translate(74, 10)">
                  <circle cx="10" cy="10" r="9" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5"/>
                  <path d="M 6,10 L 9,13 L 14,7" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                </g>
              )}

              {/* Logical Inset Hit Target Area */}
              <rect
                x="0"
                y="0"
                width={TILE_SIZE}
                height={TILE_SIZE}
                fill="transparent"
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
