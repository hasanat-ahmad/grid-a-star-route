import { useState, useCallback } from 'react';
import MapGrid from '@/components/MapGrid';
import Controls from '@/components/Controls';
import { Cell, Mode, GridState, AlgorithmType } from '@/types/grid';
import { findPath } from '@/utils/pathfinding';
import { useToast } from '@/hooks/use-toast';

const GRID_SIZE = 20;

// Initialize grid with default cells
const createEmptyGrid = (): Cell[][] => {
  const grid: Cell[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = {
        row,
        col,
        type: 'default',
        f: Infinity,
        g: Infinity,
        h: 0,
        parent: null,
      };
    }
  }
  return grid;
};

const Index = () => {
  const [gridState, setGridState] = useState<GridState>({
    grid: createEmptyGrid(),
    start: null,
    target: null,
    isRunning: false,
    isComplete: false,
  });
  const [mode, setMode] = useState<Mode>('start');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bfs');
  const [pathLength, setPathLength] = useState(0);
  const [visitedCount, setVisitedCount] = useState(0);
  const { toast } = useToast();

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gridState.isRunning || gridState.isComplete) return;

      setGridState((prev) => {
        const newGrid = prev.grid.map((r) => r.map((c) => ({ ...c })));
        const cell = newGrid[row][col];

        // Clear previous states if setting start/target
        if (mode === 'start') {
          if (prev.start) {
            newGrid[prev.start.row][prev.start.col].type = 'default';
          }
          cell.type = 'start';
          return { ...prev, grid: newGrid, start: { row, col } };
        } else if (mode === 'target') {
          if (prev.target) {
            newGrid[prev.target.row][prev.target.col].type = 'default';
          }
          cell.type = 'target';
          return { ...prev, grid: newGrid, target: { row, col } };
        } else if (mode === 'wall') {
          // Toggle wall
          if (cell.type === 'wall') {
            cell.type = 'default';
          } else if (cell.type === 'default') {
            cell.type = 'wall';
          }
          return { ...prev, grid: newGrid };
        }

        return prev;
      });
    },
    [mode, gridState.isRunning, gridState.isComplete]
  );

  const handleStartPathfinding = useCallback(async () => {
    if (!gridState.start || !gridState.target) {
      toast({
        title: 'Error',
        description: 'Please set both start and target points',
        variant: 'destructive',
      });
      return;
    }

    setGridState((prev) => ({ ...prev, isRunning: true }));

    // Clear previous path and visited cells
    const clearedGrid = gridState.grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        type: cell.type === 'visited' || cell.type === 'path' ? 'default' : cell.type,
      }))
    );

    // Run selected algorithm
    const result = findPath(clearedGrid, gridState.start, gridState.target, algorithm);

    if (!result.found) {
      toast({
        title: 'No Path Found',
        description: 'There is no path between start and target',
        variant: 'destructive',
      });
      setGridState((prev) => ({ ...prev, isRunning: false }));
      return;
    }

    // Animate visited cells
    for (let i = 0; i < result.visited.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      const visitedCell = result.visited[i];
      
      setGridState((prev) => {
        const newGrid = prev.grid.map((r) => r.map((c) => ({ ...c })));
        if (
          newGrid[visitedCell.row][visitedCell.col].type !== 'start' &&
          newGrid[visitedCell.row][visitedCell.col].type !== 'target'
        ) {
          newGrid[visitedCell.row][visitedCell.col].type = 'visited';
        }
        return { ...prev, grid: newGrid };
      });
    }

    // Animate path
    for (let i = 0; i < result.path.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const pathCell = result.path[i];
      
      setGridState((prev) => {
        const newGrid = prev.grid.map((r) => r.map((c) => ({ ...c })));
        if (
          newGrid[pathCell.row][pathCell.col].type !== 'start' &&
          newGrid[pathCell.row][pathCell.col].type !== 'target'
        ) {
          newGrid[pathCell.row][pathCell.col].type = 'path';
        }
        return { ...prev, grid: newGrid };
      });
    }

    setPathLength(result.path.length);
    setVisitedCount(result.visited.length);
    setGridState((prev) => ({ ...prev, isRunning: false, isComplete: true }));

    toast({
      title: 'Path Found!',
      description: `Found path with ${result.path.length} steps`,
    });
  }, [gridState.grid, gridState.start, gridState.target, algorithm, toast]);

  const handleClearGrid = useCallback(() => {
    setGridState({
      grid: createEmptyGrid(),
      start: null,
      target: null,
      isRunning: false,
      isComplete: false,
    });
    setPathLength(0);
    setVisitedCount(0);
    setMode('start');
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Smart Route Finder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare BFS, DFS, and Greedy Best-First Search algorithms for pathfinding
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start justify-items-center">
          {/* Controls */}
          <div className="w-full max-w-md order-2 lg:order-1">
            <Controls
              mode={mode}
              algorithm={algorithm}
              onModeChange={setMode}
              onAlgorithmChange={setAlgorithm}
              onStartPathfinding={handleStartPathfinding}
              onClearGrid={handleClearGrid}
              isRunning={gridState.isRunning}
              isComplete={gridState.isComplete}
              pathLength={pathLength}
              visitedCount={visitedCount}
            />
          </div>

          {/* Grid */}
          <div className="order-1 lg:order-2 flex justify-center">
            <MapGrid
              grid={gridState.grid}
              onCellClick={handleCellClick}
              gridSize={GRID_SIZE}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Select different algorithms to compare their behavior: BFS guarantees shortest path, DFS explores depth-first, Greedy uses heuristics
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
