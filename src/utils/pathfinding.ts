import { Cell, CellType } from '@/types/grid';

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

// A* Algorithm implementation
export const findPath = (
  grid: Cell[][],
  startPos: { row: number; col: number },
  targetPos: { row: number; col: number }
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

  const openSet: Cell[] = [start];
  const closedSet: Set<string> = new Set();
  const visited: Cell[] = [];

  start.g = 0;
  start.h = heuristic(start, target);
  start.f = start.h;

  while (openSet.length > 0) {
    // Find cell with lowest f score
    let current = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < current.f) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    // Check if we reached the target
    if (current.row === target.row && current.col === target.col) {
      return {
        path: reconstructPath(current),
        visited,
        found: true,
      };
    }

    // Move current from open to closed set
    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.row},${current.col}`);
    visited.push(current);

    // Check all neighbors
    const neighbors = getNeighbors(current, grid);

    for (const neighbor of neighbors) {
      // Skip if neighbor is a wall or already evaluated
      if (neighbor.type === 'wall' || closedSet.has(`${neighbor.row},${neighbor.col}`)) {
        continue;
      }

      const tentativeG = current.g + 1; // Cost is 1 per step

      if (tentativeG < neighbor.g) {
        // This path to neighbor is better
        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, target);
        neighbor.f = neighbor.g + neighbor.h;

        // Add to open set if not already there
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // No path found
  return {
    path: [],
    visited,
    found: false,
  };
};
