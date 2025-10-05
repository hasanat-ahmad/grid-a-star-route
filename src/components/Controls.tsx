import { Mode } from '@/types/grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RotateCcw, MapPin, Target, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlsProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onStartPathfinding: () => void;
  onClearGrid: () => void;
  isRunning: boolean;
  isComplete: boolean;
  pathLength: number;
  visitedCount: number;
}

const Controls = ({
  mode,
  onModeChange,
  onStartPathfinding,
  onClearGrid,
  isRunning,
  isComplete,
  pathLength,
  visitedCount,
}: ControlsProps) => {
  const modes: { value: Mode; label: string; icon: React.ReactNode }[] = [
    { value: 'start', label: 'Set Start', icon: <MapPin className="w-4 h-4" /> },
    { value: 'target', label: 'Set Target', icon: <Target className="w-4 h-4" /> },
    { value: 'wall', label: 'Draw Walls', icon: <Square className="w-4 h-4" /> },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
        <CardDescription>Click on the grid to place start, target, and walls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mode:</label>
          <div className="grid grid-cols-3 gap-2">
            {modes.map(({ value, label, icon }) => (
              <Button
                key={value}
                variant={mode === value ? 'default' : 'outline'}
                onClick={() => onModeChange(value)}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onStartPathfinding}
            disabled={isRunning || isComplete}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Find Path
          </Button>
          <Button
            onClick={onClearGrid}
            variant="outline"
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Grid
          </Button>
        </div>

        {/* Stats */}
        {isComplete && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="text-sm">
              <span className="font-medium">Path Length:</span> {pathLength} steps
            </div>
            <div className="text-sm">
              <span className="font-medium">Nodes Visited:</span> {visitedCount}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Legend:</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[hsl(var(--cell-start))] border border-border rounded" />
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[hsl(var(--cell-target))] border border-border rounded" />
              <span>Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[hsl(var(--cell-wall))] border border-border rounded" />
              <span>Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[hsl(var(--cell-visited))] border border-border rounded" />
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[hsl(var(--cell-path))] border border-border rounded" />
              <span>Path</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Controls;
