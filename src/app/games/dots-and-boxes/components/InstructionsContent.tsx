export default function InstructionsContent() {
  return (
    <div className="space-y-6">
      {/* Objective */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Complete more boxes than your opponent by drawing the fourth side of
          boxes on the grid. Each completed box earns you one point.
        </p>
      </section>

      {/* How to Play */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Players take turns drawing one line between two adjacent dots</li>
          <li>Lines can be horizontal or vertical, but not diagonal</li>
          <li>
            When you complete the fourth side of a box, you claim it and get
            another turn
          </li>
          <li>
            The game ends when all boxes are filled - the player with the most
            boxes wins
          </li>
        </ul>
      </section>

      {/* Visual Example */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Example
        </h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col items-center gap-1">
            {/* Row 1: dots and horizontal line */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200" />
              <div className="w-10 h-1.5 rounded-full bg-blue-500" />
              <div className="w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200" />
            </div>
            {/* Row 2: vertical lines and box */}
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-10 rounded-full bg-red-500" />
              <div className="w-10 h-10 bg-red-200 dark:bg-red-900/50" />
              <div className="w-1.5 h-10 rounded-full bg-red-500" />
            </div>
            {/* Row 3: dots and horizontal line */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200" />
              <div className="w-10 h-1.5 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200" />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Red completed this box by drawing the bottom line
          </p>
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
            <strong>2 Players:</strong> Play locally against a friend (Red vs
            Blue)
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
            <strong>Medium:</strong> Computer takes boxes when available and
            avoids giving you easy boxes
          </li>
          <li>
            <strong>Hard:</strong> Computer uses advanced chain strategy to
            maximize its score
          </li>
        </ul>
      </section>

      {/* Strategy Tips */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Strategy Tips
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Avoid drawing the third side of a box - it lets your opponent
            complete it
          </li>
          <li>
            Try to create long chains of boxes that you can capture in one turn
          </li>
          <li>
            Sometimes sacrificing a small chain can help you win a larger one
          </li>
        </ul>
      </section>

      {/* Grid Sizes */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Grid Sizes
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>3x3:</strong> Quick games, 9 boxes total
          </li>
          <li>
            <strong>4x4:</strong> Standard size, 16 boxes total
          </li>
          <li>
            <strong>5x5:</strong> Longer games, 25 boxes total
          </li>
          <li>
            <strong>6x6:</strong> Expert mode, 36 boxes total
          </li>
        </ul>
      </section>
    </div>
  );
}
