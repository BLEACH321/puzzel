import React, { useRef, useState, useMemo } from 'react';
import { getJigsawPiecePath } from '../services/jigsaw-paths.js';

export function PuzzleBoard({
  gridState,
  imageUrl,
  hintTile,
  showNumbers = false,
  showGhost = false,
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

  // Tap-To-Move Handler
  const handleCellTap = (gridIdx) => {
    const tileVal = gridState[gridIdx];
    if (tileVal === 0) return;

    const isAdjacent = checkIsAdjacent(gridIdx);

    if (isAdjacent) {
      setSelectedGridIdx(gridIdx);
      setTimeout(() => {
        setSelectedGridIdx(null);
        onTileMove(gridIdx, null);
      }, 70);
    } else {
      setShakingGridIdx(gridIdx);
      if (onInvalidMove) onInvalidMove();
      setTimeout(() => {
        setShakingGridIdx(null);
      }, 280);
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
            <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#0F172A" flood-opacity="0.38" />
          </filter>
        </defs>

        {/* Board Background Frame */}
        <rect
          x="-6"
          y="-6"
          width="312"
          height="312"
          rx="18"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* 1. Optional Ghost Target Background */}
        {showGhost && (
          <image
            href={imageUrl}
            x="0"
            y="0"
            width={BOARD_SIZE}
            height={BOARD_SIZE}
            preserveAspectRatio="xMidYMid slice"
            opacity="0.22"
          />
        )}

        {/* 2. Sleek Blank Destination Slot */}
        <g
          transform={`translate(${blankCol * TILE_SIZE}, ${blankRow * TILE_SIZE})`}
          className={`jigsaw-blank-slot ${selectedGridIdx !== null ? 'destination-glow' : ''}`}
        >
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="12"
            fill="#0F172A"
            fillOpacity="0.6"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
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

              {/* 3D Embossed Jigsaw Bevel & Stroke Overlay */}
              <path
                d={piecePath}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeOpacity="0.75"
              />
              <path
                d={piecePath}
                fill="none"
                stroke="#0F172A"
                strokeWidth="1.2"
                strokeOpacity="0.3"
              />

              {/* Subtle Minimalist Frosted Glass Index (Only if enabled) */}
              {showNumbers && (
                <g transform="translate(6, 6)" opacity="0.85">
                  <rect
                    x="0"
                    y="0"
                    width="18"
                    height="18"
                    rx="5"
                    fill="rgba(15, 23, 42, 0.75)"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="1"
                  />
                  <text
                    x="9"
                    y="13"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="system-ui, sans-serif"
                  >
                    {tileVal}
                  </text>
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
