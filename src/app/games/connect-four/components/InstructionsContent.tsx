export default function InstructionsContent() {
  return (
    <div className="space-y-6">
      {/* Objective */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Be the first player to connect four of your colored discs in a row -
          horizontally, vertically, or diagonally.
        </p>
      </section>

      {/* How to Play */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Players take turns dropping colored discs into a 7x6 grid</li>
          <li>Player 1 (Red) always goes first</li>
          <li>Click on a column to drop your disc</li>
          <li>Discs fall to the lowest available position in the column</li>
          <li>The game ends when someone connects four or the board is full</li>
        </ul>
      </section>

      {/* Winning Examples */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Ways to Win
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
          <div>
            <div className="bg-blue-600 dark:bg-blue-700 p-2 rounded-lg mb-1">
              <div className="flex gap-0.5 justify-center">
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400" />
              </div>
            </div>
            <span className="text-xs text-gray-500">Horizontal</span>
          </div>
          <div>
            <div className="bg-blue-600 dark:bg-blue-700 p-2 rounded-lg mb-1">
              <div className="flex flex-col gap-0.5 items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400" />
              </div>
            </div>
            <span className="text-xs text-gray-500">Vertical</span>
          </div>
          <div>
            <div className="bg-blue-600 dark:bg-blue-700 p-2 rounded-lg mb-1">
              <div className="flex flex-col gap-0.5 items-start pl-1">
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400 ml-2" />
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400 ml-4" />
                <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-green-400 ml-6" />
              </div>
            </div>
            <span className="text-xs text-gray-500">Diagonal</span>
          </div>
          <div>
            <div className="bg-blue-600 dark:bg-blue-700 p-2 rounded-lg mb-1">
              <div className="flex flex-col gap-0.5 items-end pr-1">
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400 mr-2" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400 mr-4" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-green-400 mr-6" />
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
            <strong>Medium:</strong> Computer blocks your wins and makes
            strategic moves
          </li>
          <li>
            <strong>Hard:</strong> Computer uses advanced strategy - very
            challenging!
          </li>
        </ul>
      </section>

      {/* Tips */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Strategy Tips
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Control the center column - it gives you the most winning options</li>
          <li>Try to create multiple threats at once</li>
          <li>Watch out for diagonal wins - they can be easy to miss!</li>
          <li>Block your opponent when they have three in a row</li>
        </ul>
      </section>
    </div>
  );
}
