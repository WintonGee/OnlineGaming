import { X, Circle } from "lucide-react";

export default function InstructionsContent() {
  return (
    <div className="space-y-6">
      {/* Objective */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Get three of your symbols (X or O) in a row horizontally, vertically,
          or diagonally before your opponent does.
        </p>
      </section>

      {/* How to Play */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Players take turns placing their symbol on an empty cell</li>
          <li>X always goes first</li>
          <li>Click on any empty cell to place your symbol</li>
          <li>The game ends when someone wins or all cells are filled (draw)</li>
        </ul>
      </section>

      {/* Winning Examples */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Ways to Win
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mb-1">
              <div className="grid grid-cols-3 gap-1">
                <X className="w-4 h-4 text-green-600" />
                <X className="w-4 h-4 text-green-600" />
                <X className="w-4 h-4 text-green-600" />
                <Circle className="w-4 h-4 text-gray-400" />
                <Circle className="w-4 h-4 text-gray-400" />
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <span className="text-xs text-gray-500">Horizontal</span>
          </div>
          <div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mb-1">
              <div className="grid grid-cols-3 gap-1">
                <X className="w-4 h-4 text-green-600" />
                <Circle className="w-4 h-4 text-gray-400" />
                <span></span>
                <X className="w-4 h-4 text-green-600" />
                <Circle className="w-4 h-4 text-gray-400" />
                <span></span>
                <X className="w-4 h-4 text-green-600" />
                <span></span>
                <span></span>
              </div>
            </div>
            <span className="text-xs text-gray-500">Vertical</span>
          </div>
          <div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mb-1">
              <div className="grid grid-cols-3 gap-1">
                <X className="w-4 h-4 text-green-600" />
                <Circle className="w-4 h-4 text-gray-400" />
                <span></span>
                <Circle className="w-4 h-4 text-gray-400" />
                <X className="w-4 h-4 text-green-600" />
                <span></span>
                <span></span>
                <span></span>
                <X className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <span className="text-xs text-gray-500">Diagonal</span>
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Game Modes
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>vs Computer:</strong> Play against the AI with three
            difficulty levels
          </li>
          <li>
            <strong>2 Players:</strong> Play locally against a friend
          </li>
        </ul>
      </section>

      {/* Difficulty Levels */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Difficulty Levels
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Easy:</strong> Computer makes random moves
          </li>
          <li>
            <strong>Medium:</strong> Computer tries to block your wins and take
            good positions
          </li>
          <li>
            <strong>Hard:</strong> Computer plays perfectly and cannot be beaten
          </li>
        </ul>
      </section>
    </div>
  );
}
