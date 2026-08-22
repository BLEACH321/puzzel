// Mathematical Jigsaw Path & Tab/Socket Clipping Generator for 3x3 8-Puzzle

/**
 * Edge configuration for 3x3 grid:
 * Row index: 0, 1, 2
 * Col index: 0, 1, 2
 *
 * Horizontal internal boundaries: (0,c) <-> (1,c) and (1,c) <-> (2,c)
 * Vertical internal boundaries: (r,0) <-> (r,1) and (r,1) <-> (r,2)
 *
 * Convention:
 * +1 = Tab (outward knob)
 * -1 = Socket (inward cutout)
 * 0 = Flat boundary
 */

// Edge configuration table for each cell (r, c)
// Edges: [top, right, bottom, left]
export const PIECE_EDGES = {
  // Tile 1: (0, 0)
  1: { top: 0, right: 1, bottom: 1, left: 0 },
  // Tile 2: (0, 1)
  2: { top: 0, right: -1, bottom: -1, left: -1 },
  // Tile 3: (0, 2)
  3: { top: 0, right: 0, bottom: 1, left: 1 },
  // Tile 4: (1, 0)
  4: { top: -1, right: -1, bottom: -1, left: 0 },
  // Tile 5: (1, 1)
  5: { top: 1, right: 1, bottom: 1, left: 1 },
  // Tile 6: (1, 2)
  6: { top: -1, right: 0, bottom: -1, left: -1 },
  // Tile 7: (2, 0)
  7: { top: 1, right: 1, bottom: 0, left: 0 },
  // Tile 8: (2, 1)
  8: { top: -1, right: -1, bottom: 0, left: -1 },
  // Slot 9: (2, 2) - Blank
  9: { top: 1, right: 0, bottom: 0, left: 1 }
};

/**
 * Generates an SVG path data string for a single edge from (x1, y1) to (x2, y2)
 * @param {number} x1 Start X
 * @param {number} y1 Start Y
 * @param {number} x2 End X
 * @param {number} y2 End Y
 * @param {number} type 0 = flat, 1 = tab (outward), -1 = socket (inward)
 */
function createJigsawEdge(x1, y1, x2, y2, type) {
  if (type === 0) {
    return `L ${x2} ${y2} `;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);

  // Unit vector along edge
  const ux = dx / len;
  const uy = dy / len;

  // Unit normal vector pointing to the RIGHT of the edge direction (outward)
  // For tab (+1), outward is +normal; for socket (-1), inward is -normal
  const sign = type > 0 ? 1 : -1;
  const nx = -uy * sign;
  const ny = ux * sign;

  // Key proportions along edge (0 to len)
  // Tab neck is between 0.38 and 0.62, extending by 0.20 * len
  const p1x = x1 + ux * (len * 0.35);
  const p1y = y1 + uy * (len * 0.35);

  const c1x = p1x + nx * (len * 0.05);
  const c1y = p1y + ny * (len * 0.05);

  const neck1x = x1 + ux * (len * 0.38) - nx * (len * 0.04);
  const neck1y = y1 + uy * (len * 0.38) - ny * (len * 0.04);

  const headTopX = x1 + ux * (len * 0.38) + nx * (len * 0.20);
  const headTopY = y1 + uy * (len * 0.38) + ny * (len * 0.20);

  const headCenterX = x1 + ux * (len * 0.50) + nx * (len * 0.24);
  const headCenterY = y1 + uy * (len * 0.50) + ny * (len * 0.24);

  const headEndTopX = x1 + ux * (len * 0.62) + nx * (len * 0.20);
  const headEndTopY = y1 + uy * (len * 0.62) + ny * (len * 0.20);

  const neck2x = x1 + ux * (len * 0.62) - nx * (len * 0.04);
  const neck2y = y1 + uy * (len * 0.62) - ny * (len * 0.04);

  const p2x = x1 + ux * (len * 0.65);
  const p2y = y1 + uy * (len * 0.65);

  return [
    `L ${p1x.toFixed(2)} ${p1y.toFixed(2)} `,
    `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${neck1x.toFixed(2)} ${neck1y.toFixed(2)}, ${headTopX.toFixed(2)} ${headTopY.toFixed(2)} `,
    `C ${headTopX.toFixed(2)} ${headTopY.toFixed(2)}, ${headCenterX.toFixed(2)} ${headCenterY.toFixed(2)}, ${headEndTopX.toFixed(2)} ${headEndTopY.toFixed(2)} `,
    `C ${headEndTopX.toFixed(2)} ${headEndTopY.toFixed(2)}, ${neck2x.toFixed(2)} ${neck2y.toFixed(2)}, ${p2x.toFixed(2)} ${p2y.toFixed(2)} `,
    `L ${x2.toFixed(2)} ${y2.toFixed(2)} `
  ].join('');
}

/**
 * Returns the closed SVG path string for a jigsaw piece in its localized bounding box.
 * Tile base is from (0,0) to (tileSize, tileSize), with tabs extending into padding area.
 * @param {number} tileVal Tile ID (1..8 or 9 for blank)
 * @param {number} tileSize Base tile square size (e.g. 100px)
 */
export function getJigsawPiecePath(tileVal, tileSize = 100) {
  const edges = PIECE_EDGES[tileVal] || { top: 0, right: 0, bottom: 0, left: 0 };
  const S = tileSize;

  // Four corners of base square
  const topLeft = { x: 0, y: 0 };
  const topRight = { x: S, y: 0 };
  const bottomRight = { x: S, y: S };
  const bottomLeft = { x: 0, y: S };

  let path = `M ${topLeft.x} ${topLeft.y} `;

  // Top Edge: (0,0) -> (S,0)
  // For top edge, outward (+1) points in -Y direction
  path += createJigsawEdge(topLeft.x, topLeft.y, topRight.x, topRight.y, edges.top);

  // Right Edge: (S,0) -> (S,S)
  // For right edge, outward (+1) points in +X direction
  path += createJigsawEdge(topRight.x, topRight.y, bottomRight.x, bottomRight.y, edges.right);

  // Bottom Edge: (S,S) -> (0,S)
  // For bottom edge, outward (+1) points in +Y direction
  path += createJigsawEdge(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, edges.bottom);

  // Left Edge: (0,S) -> (0,0)
  // For left edge, outward (+1) points in -X direction
  path += createJigsawEdge(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, edges.left);

  path += 'Z';
  return path;
}
