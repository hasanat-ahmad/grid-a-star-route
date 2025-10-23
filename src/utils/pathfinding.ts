import { Cell, AlgorithmType } from '@/types/grid';

// Heuristic function (Manhattan distance)
const heuristic = (cell: Cell, target: Cell): number => {
  return Math.abs(cell.row - target.row) + Math.abs(cell.col - target.col);
};

// Get neighbors of a cell (up, down, left, right)
const getNeighbors = (cell: Cell, grid: Cell[][]): Cell[] => {
  const neighbors: Cell[] = [];
  const { row, col } = cell;
  const rows = grid.length;
  const cols = grid[0].length;

  // Up
  if (row > 0) neighbors.push(grid[row - 1][col]);
  // Down
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  // Left
  if (col > 0) neighbors.push(grid[row][col - 1]);
  // Right
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};

// Reconstruct path from target to start
const reconstructPath = (targetCell: Cell): Cell[] => {
  const path: Cell[] = [];
  let current: Cell | null = targetCell;

  while (current !== null) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
};

export interface PathfindingResult {
  path: Cell[];
  visited: Cell[];
  found: boolean;
}

// Breadth-First Search (BFS) - Guarantees shortest path
const bfs = (
  grid: Cell[][],
  start: Cell,
  target: Cell
): PathfindingResult => {
  const queue: Cell[] = [start];
  const visited: Cell[] = [];
  const visitedSet: Set<string> = new Set([`${start.row},${start.col}`]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    if (current.row === target.row && current.col === target.col) {
      return {
        path: reconstructPath(current),
        visited,
        found: true,
      };
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (neighbor.type !== 'wall' && !visitedSet.has(key)) {
        neighbor.parent = current;
        visitedSet.add(key);
        queue.push(neighbor);
      }
    }
  }

  return { path: [], visited, found: false };
};

// Depth-First Search (DFS) - Does not guarantee shortest path
const dfs = (
  grid: Cell[][],
  start: Cell,
  target: Cell
): PathfindingResult => {
  const stack: Cell[] = [start];
  const visited: Cell[] = [];
  const visitedSet: Set<string> = new Set([`${start.row},${start.col}`]);

  while (stack.length > 0) {
    const current = stack.pop()!;
    visited.push(current);

    if (current.row === target.row && current.col === target.col) {
      return {
        path: reconstructPath(current),
        visited,
        found: true,
      };
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (neighbor.type !== 'wall' && !visitedSet.has(key)) {
        neighbor.parent = current;
        visitedSet.add(key);
        stack.push(neighbor);
      }
    }
  }

  return { path: [], visited, found: false };
};

// Greedy Best-First Search - Uses heuristic only
const greedy = (
  grid: Cell[][],
  start: Cell,
  target: Cell
): PathfindingResult => {
  const openSet: Cell[] = [start];
  const closedSet: Set<string> = new Set();
  const visited: Cell[] = [];

  start.h = heuristic(start, target);

  while (openSet.length > 0) {
    // Find cell with lowest h score (heuristic only)
    let current = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].h < current.h) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    if (current.row === target.row && current.col === target.col) {
      return {
        path: reconstructPath(current),
        visited,
        found: true,
      };
    }

    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.row},${current.col}`);
    visited.push(current);

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (neighbor.type === 'wall' || closedSet.has(`${neighbor.row},${neighbor.col}`)) {
        continue;
      }

      if (!openSet.includes(neighbor)) {
        neighbor.parent = current;
        neighbor.h = heuristic(neighbor, target);
        openSet.push(neighbor);
      }
    }
  }

  return { path: [], visited, found: false };
};

// Main pathfinding function that routes to the selected algorithm
export const findPath = (
  grid: Cell[][],
  startPos: { row: number; col: number },
  targetPos: { row: number; col: number },
  algorithm: AlgorithmType = 'bfs'
): PathfindingResult => {
  // Reset grid costs
  for (let row of grid) {
    for (let cell of row) {
      cell.g = Infinity;
      cell.h = 0;
      cell.f = Infinity;
      cell.parent = null;
    }
  }

  const start = grid[startPos.row][startPos.col];
  const target = grid[targetPos.row][targetPos.col];

  switch (algorithm) {
    case 'bfs':
      return bfs(grid, start, target);
    case 'dfs':
      return dfs(grid, start, target);
    case 'greedy':
      return greedy(grid, start, target);
    default:
      return bfs(grid, start, target);
  }
};
