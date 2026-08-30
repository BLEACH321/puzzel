// Solvability Engine & A* Solver with Easy Default Scramble

export function getGoalState(size = 3) {
  const total = size * size;
  const state = [];
  for (let i = 1; i < total; i++) {
    state.push(i);
  }
  state.push(0);
  return state;
}

export function isGoal(state, size = 3) {
  const goal = getGoalState(size);
  for (let i = 0; i < state.length; i++) {
    if (state[i] !== goal[i]) return false;
  }
  return true;
}

export function getNeighbors(state, size = 3) {
  const neighbors = [];
  const blankIdx = state.indexOf(0);
  const row = Math.floor(blankIdx / size);
  const col = blankIdx % size;

  const deltas = [
    { dr: -1, dc: 0, dir: 'up' },
    { dr: 1, dc: 0, dir: 'down' },
    { dr: 0, dc: -1, dir: 'left' },
    { dr: 0, dc: 1, dir: 'right' }
  ];

  for (const { dr, dc } of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      const neighborIdx = nr * size + nc;
      const newState = [...state];
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

export function manhattanDistance(state, size = 3) {
  let dist = 0;
  for (let i = 0; i < state.length; i++) {
    const val = state[i];
    if (val !== 0) {
      const targetIdx = val - 1;
      const curR = Math.floor(i / size);
      const curC = i % size;
      const targetR = Math.floor(targetIdx / size);
      const targetC = targetIdx % size;
      dist += Math.abs(curR - targetR) + Math.abs(curC - targetC);
    }
  }
  return dist;
}

export function getOptimalNextMove(initialState, size = 3) {
  if (isGoal(initialState, size)) return null;

  const startKey = initialState.join(',');
  const openSet = [{
    state: [...initialState],
    g: 0,
    h: manhattanDistance(initialState, size),
    f: manhattanDistance(initialState, size),
    firstMovedTile: null,
    firstMovedIndex: null,
    parent: null
  }];

  const closedSet = new Set();
  const gScores = new Map();
  gScores.set(startKey, 0);

  let iterations = 0;
  const MAX_ITERATIONS = 4000;

  while (openSet.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;

    let lowestIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIdx].f) {
        lowestIdx = i;
      }
    }

    const current = openSet.splice(lowestIdx, 1)[0];
    const currentKey = current.state.join(',');

    if (isGoal(current.state, size)) {
      let curr = current;
      while (curr.parent && curr.parent.parent) {
        curr = curr.parent;
      }
      return {
        tile: curr.firstMovedTile || current.firstMovedTile,
        index: curr.firstMovedIndex !== null ? curr.firstMovedIndex : current.firstMovedIndex
      };
    }

    closedSet.add(currentKey);

    const neighbors = getNeighbors(current.state, size);
    for (const neighbor of neighbors) {
      const neighborKey = neighbor.state.join(',');
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = current.g + 1;
      const prevG = gScores.get(neighborKey);

      if (prevG === undefined || tentativeG < prevG) {
        gScores.set(neighborKey, tentativeG);
        const h = manhattanDistance(neighbor.state, size);
        
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

  const neighbors = getNeighbors(initialState, size);
  neighbors.sort((a, b) => manhattanDistance(a.state, size) - manhattanDistance(b.state, size));
  if (neighbors.length > 0) {
    return { tile: neighbors[0].movedTile, index: neighbors[0].movedTileIndex };
  }
  return null;
}

/**
 * Generate a solvable scramble that is easy-to-medium, fun, and fast to solve:
 * 6-8 moves from the goal state.
 */
export function generateSolvableBoard(size = 3) {
  const steps = 7; // Easy to medium sweet-spot

  let state = getGoalState(size);
  let lastMovedTile = -1;

  for (let i = 0; i < steps; i++) {
    const neighbors = getNeighbors(state, size);
    const filtered = neighbors.filter(n => n.movedTile !== lastMovedTile);
    const pool = filtered.length > 0 ? filtered : neighbors;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    state = chosen.state;
    lastMovedTile = chosen.movedTile;
  }

  // Ensure state is not already at goal
  if (isGoal(state, size)) {
    const neighbors = getNeighbors(state, size);
    state = neighbors[0].state;
  }

  return state;
}
