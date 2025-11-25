import { Button } from '@/components/ui/button';
import { formatTime } from '../utils/styleUtils';
import { EMOJI_STATES } from '../constants';
import { Flag } from 'lucide-react';

interface GameHeaderProps {
  remainingMines: number;
  time: number;
  gameOver: boolean;
  won: boolean;
  onReset: () => void;
  onOpenDifficulty: () => void;
}

export default function GameHeader({
  remainingMines,
  time,
  gameOver,
  won,
  onReset,
  onOpenDifficulty,
}: GameHeaderProps) {
  const emoji = gameOver ? (won ? EMOJI_STATES.won : EMOJI_STATES.lost) : EMOJI_STATES.playing;

  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold">
          Minesweeper
        </h1>
        <Button onClick={onOpenDifficulty} variant="outline">
          Difficulty
        </Button>
      </div>

      <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-lg p-3 sm:p-4">
        {/* Mine Counter */}
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums">
            {remainingMines.toString().padStart(3, '0')}
          </span>
        </div>

        {/* Emoji Face Button */}
        <Button
          onClick={onReset}
          variant="ghost"
          size="icon"
          className="text-3xl sm:text-4xl h-12 w-12 sm:h-14 sm:w-14"
          aria-label="New game"
        >
          {emoji}
        </Button>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums">
            {formatTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
}
