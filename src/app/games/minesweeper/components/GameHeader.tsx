import { formatTime } from '../utils/styleUtils';
import { EMOJI_STATES } from '../constants';

interface GameHeaderProps {
  remainingMines: number;
  time: number;
  gameOver: boolean;
  won: boolean;
  onReset: () => void;
}

export default function GameHeader({
  remainingMines,
  time,
  gameOver,
  won,
  onReset,
}: GameHeaderProps) {
  const emoji = gameOver ? (won ? EMOJI_STATES.won : EMOJI_STATES.lost) : EMOJI_STATES.playing;

  // Format mine count (can be negative if more flags than mines)
  const formatMineCount = (count: number): string => {
    if (count < 0) {
      return '-' + Math.abs(count).toString().padStart(2, '0');
    }
    return count.toString().padStart(3, '0');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-2">
      {/* Header panel with sunken border */}
      <div className="ms-header-panel flex items-center justify-between">
        {/* Mine Counter LCD */}
        <div className="ms-lcd-display">
          <span className="ms-lcd-text">
            {formatMineCount(remainingMines)}
          </span>
        </div>

        {/* Emoji Face Button */}
        <button
          onClick={onReset}
          className="ms-face-button text-2xl sm:text-3xl"
          aria-label="New game"
        >
          {emoji}
        </button>

        {/* Timer LCD */}
        <div className="ms-lcd-display">
          <span className="ms-lcd-text">
            {formatTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
}
