export default function InstructionsContent() {
  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300">
      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Find all the hidden words in the grid. Words can be placed
          horizontally, vertically, or diagonally.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Look at the word list below the grid</li>
          <li>Click and drag across letters to select a word</li>
          <li>Release to check if you found a valid word</li>
          <li>Found words will be highlighted in green</li>
          <li>Find all words to win!</li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Word Directions
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Easy:</strong> Words go left-to-right or top-to-bottom only
          </li>
          <li>
            <strong>Medium:</strong> Adds diagonal words
          </li>
          <li>
            <strong>Hard:</strong> Words can go in any direction, including
            backwards
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Look for the first letter of each word</li>
          <li>Scan rows, columns, and diagonals systematically</li>
          <li>Harder difficulties have larger grids and more words</li>
          <li>Try different categories for variety</li>
        </ul>
      </div>
    </div>
  );
}
