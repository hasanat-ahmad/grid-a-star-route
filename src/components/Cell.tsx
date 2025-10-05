import { CellType } from '@/types/grid';
import { cn } from '@/lib/utils';

interface CellProps {
  type: CellType;
  onClick: () => void;
  isAnimated?: boolean;
}

const Cell = ({ type, onClick, isAnimated = false }: CellProps) => {
  const getCellClasses = () => {
    const baseClasses = "w-full h-full border border-[hsl(var(--cell-border))] cursor-pointer transition-all duration-200 hover:opacity-80";
    
    const typeClasses: Record<CellType, string> = {
      default: "bg-[hsl(var(--cell-default))]",
      start: "bg-[hsl(var(--cell-start))] shadow-lg",
      target: "bg-[hsl(var(--cell-target))] shadow-lg",
      wall: "bg-[hsl(var(--cell-wall))]",
      visited: "bg-[hsl(var(--cell-visited))]",
      path: "bg-[hsl(var(--cell-path))] shadow-md",
    };

    return cn(
      baseClasses,
      typeClasses[type],
      isAnimated && "grid-cell-animation"
    );
  };

  return (
    <div
      className={getCellClasses()}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Cell type: ${type}`}
    />
  );
};

export default Cell;
