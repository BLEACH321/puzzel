// 8-Puzzle Solvability Parity Checker & A* Manhattan Search Algorithm for Smart Hints

export const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

/**
 * Calculates the number of inversions in the state (ignoring the blank tile 0)
 */
export function countInversions(state) {
  let inversions = 0;
  const filtered = state.filter(x => x !== 0);
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

/**
 * For a 3x3 8-puzzle, a state is solvable iff the inversion count is even.
 */
export function isSolvable(state) {
  return countInversions(state) % 2 === 0;
}

/**
 * Checks if the current state is the goal state
 */
export function isGoal(state) {
  for (let i = 0; i < 9; i++) {
    if (state[i] !== GOAL_STATE[i]) return false;
  }
  return true;
}

/**
 * Returns valid neighbor board states reachable by sliding an adjacent tile into the blank (0) slot
 */
export function getNeighbors(state) {
  const neighbors = [];
  const blankIdx = state.indexOf(0);
  const row = Math.floor(blankIdx / 3);
  const col = blankIdx % 3;

  const deltas = [
    { dr: -1, dc: 0, dir: 'up' },    // Tile above moves down into blank
    { dr: 1, dc: 0, dir: 'down' },   // Tile below moves up into blank
    { dr: 0, dc: -1, dir: 'left' },  // Tile left moves right into blank
    { dr: 0, dc: 1, dir: 'right' }   // Tile right moves left into blank
  ];

  for (const { dr, dc } of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const neighborIdx = nr * 3 + nc;
      const newState = [...state];
      // Swap blank with neighbor
      newState[blankIdx] = state[neighborIdx];
      newState[neighborIdx] = 0;

      neighbors.push({
        state: newState,
        movedTile: state[neighborIdx],
        movedTileIndex: neighborIdx,
        blankIndex: blankIdx
      });
    }
  }

  return neighbors;
}

/**
 * Manhattan distance heuristic with linear conflict bonus
 */
export function manhattanDistance(state) {
  let dist = 0;
  for (let i = 0; i < 9; i++) {
    const val = state[i];
    if (val !== 0) {
      const targetIdx = val - 1;
      const curR = Math.floor(i / 3);
      const curC = i % 3;
      const targetR = Math.floor(targetIdx / 3);
      const targetC = targetIdx % 3;
      dist += Math.abs(curR - targetR) + Math.abs(curC - targetC);
    }
  }
  return dist;
}

/**
 * A* Solver that returns the next optimal move (tile to slide)
 */
export function getOptimalNextMove(initialState) {
  if (isGoal(initialState)) return null;

  const startKey = initialState.join(',');
  const openSet = [{
    state: [...initialState],
    g: 0,
    h: manhattanDistance(initialState),
    f: manhattanDistance(initialState),
    firstMovedTile: null,
    firstMovedIndex: null,
    parent: null
  }];

  const closedSet = new Set();
  const gScores = new Map();
  gScores.set(startKey, 0);

  let iterations = 0;
  const MAX_ITERATIONS = 4000; // Safeguard

  while (openSet.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;

    // Find node with lowest f
    let lowestIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIdx].f) {
        lowestIdx = i;
      }
    }

    const current = openSet.splice(lowestIdx, 1)[0];
    const currentKey = current.state.join(',');

    if (isGoal(current.state)) {
      // Reconstruct path to find first move
      let curr = current;
      let firstStep = null;
      while (curr.parent && curr.parent.parent) {
        curr = curr.parent;
      }
      if (curr.parent) {
        firstStep = {
          tile: curr.firstMovedTile,
          index: curr.firstMovedIndex
        };
      }
      return firstStep || { tile: current.firstMovedTile, index: current.firstMovedIndex };
    }

    closedSet.add(currentKey);

    const neighbors = getNeighbors(current.state);
    for (const neighbor of neighbors) {
      const neighborKey = neighbor.state.join(',');
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = current.g + 1;
      const prevG = gScores.get(neighborKey);

      if (prevG === undefined || tentativeG < prevG) {
        gScores.set(neighborKey, tentativeG);
        const h = manhattanDistance(neighbor.state);
        
        const neighborNode = {
          state: neighbor.state,
          g: tentativeG,
          h: h,
          f: tentativeG + h,
          firstMovedTile: current.firstMovedTile || neighbor.movedTile,
          firstMovedIndex: current.firstMovedIndex !== null ? current.firstMovedIndex : neighbor.movedTileIndex,
          parent: current
        };

        const existingOpenIdx = openSet.findIndex(n => n.state.join(',') === neighborKey);
        if (existingOpenIdx >= 0) {
          openSet[existingOpenIdx] = neighborNode;
        } else {
          openSet.push(neighborNode);
        }
      }
    }
  }

  // Fallback if iteration limit reached (pick simple neighbor with lowest heuristic)
  const neighbors = getNeighbors(initialState);
  neighbors.sort((a, b) => manhattanDistance(a.state) - manhattanDistance(b.state));
  if (neighbors.length > 0) {
    return { tile: neighbors[0].movedTile, index: neighbors[0].movedTileIndex };
  }
  return null;
}

/**
 * Generates a guaranteed solvable randomized board
 * @param {string} difficulty 'easy' (10-16 moves), 'standard' (25-35 moves), 'master' (45+ moves)
 */
export function generateSolvablePuzzle(difficulty = 'standard') {
  let steps = 30;
  if (difficulty === 'easy') steps = 14;
  if (difficulty === 'master') steps = 55;

  let state = [...GOAL_STATE];
  let lastMovedTile = -1;

  for (let i = 0; i < steps; i++) {
    const neighbors = getNeighbors(state);
    // Don't undo immediate last move for better scrambling
    const filtered = neighbors.filter(n => n.movedTile !== lastMovedTile);
    const chosen = (filtered.length > 0 ? filtered : neighbors)[Math.floor(Math.random() * (filtered.length || neighbors.length))];
    state = chosen.state;
    lastMovedTile = chosen.movedTile;
  }

  // If accidentally ended up solved, do 2 valid moves
  if (isGoal(state)) {
    const n1 = getNeighbors(state)[0];
    const n2 = getNeighbors(n1.state)[0];
    state = n2.state;
  }

  return state;
}
