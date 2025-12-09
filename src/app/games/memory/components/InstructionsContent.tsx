export default function InstructionsContent() {
  return (
    <div className="space-y-6">
      {/* Objective */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Find all matching pairs of cards by remembering their positions. Match
          all pairs using the fewest number of moves possible.
        </p>
      </section>

      {/* How to Play */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Click on any card to flip it and reveal its symbol</li>
          <li>Click on a second card to try to find its match</li>
          <li>If the two cards match, they stay face up</li>
          <li>If they don&apos;t match, both cards flip back face down</li>
          <li>Remember the positions of cards you&apos;ve seen!</li>
          <li>Continue until all pairs are matched</li>
        </ul>
      </section>

      {/* Example */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Example Match
        </h3>
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-700 border-2 border-green-500 flex items-center justify-center text-3xl">
            🍎
          </div>
          <span className="text-2xl text-green-500">=</span>
          <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-700 border-2 border-green-500 flex items-center justify-center text-3xl">
            🍎
          </div>
          <span className="text-green-500 font-medium ml-2">Match!</span>
        </div>
      </section>

      {/* Difficulty Levels */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Difficulty Levels
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Easy:</strong> 12 cards (6 pairs) in a 3×4 grid
          </li>
          <li>
            <strong>Medium:</strong> 16 cards (8 pairs) in a 4×4 grid
          </li>
          <li>
            <strong>Hard:</strong> 20 cards (10 pairs) in a 4×5 grid
          </li>
        </ul>
      </section>

      {/* Scoring */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Scoring
        </h3>
        <p>
          Your score is based on the number of moves (pairs of cards flipped).
          Try to complete the game with as few moves as possible! Your best
          scores for each difficulty level are saved automatically.
        </p>
      </section>

      {/* Tips */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Tips for Success
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Pay close attention to every card that gets flipped</li>
          <li>Try to remember locations by creating mental patterns</li>
          <li>Start by exploring cards systematically</li>
          <li>Once you find a card, try to remember where its pair might be</li>
        </ul>
      </section>
    </div>
  );
}
