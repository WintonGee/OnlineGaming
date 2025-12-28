export default function InstructionsContent() {
  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300">
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Objective</h3>
        <p>Build the longest streak by correctly guessing if the next card will be higher or lower than the current card.</p>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Card Values</h3>
        <p>Cards are ranked from Ace (lowest) to King (highest):</p>
        <p className="mt-1 font-mono text-sm">A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K</p>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">How to Play</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Look at the current card shown</li>
          <li>Guess if the next card will be higher or lower</li>
          <li>If correct, your streak increases and you continue</li>
          <li>If wrong, the game ends</li>
          <li>Ties count as correct!</li>
        </ol>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Low cards (2-6) are safer to guess "Higher"</li>
          <li>High cards (8-K) are safer to guess "Lower"</li>
          <li>7 is the middle - it's a coin flip!</li>
        </ul>
      </section>
    </div>
  );
}
