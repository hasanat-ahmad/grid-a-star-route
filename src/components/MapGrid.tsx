import { Cell as CellType } from '@/types/grid';
import Cell from './Cell';

interface MapGridProps {
  grid: CellType[][];
  onCellClick: (row: number, col: number) => void;
  gridSize: number;
}

const MapGrid = ({ grid, onCellClick, gridSize }: MapGridProps) => {
  const cellSize = Math.min(600 / gridSize, 30); // Responsive cell size

  return (
    <div 
      className="inline-grid gap-0 border-2 border-border rounded-lg overflow-hidden shadow-lg bg-card"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            type={cell.type}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default MapGrid;
