export default function InstructionsContent() {
  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300">
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">How to Play</h3>
        <p>
          Rock Paper Scissors is a classic hand game. Choose your weapon and battle against the AI!
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">The Rules</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Rock</span> crushes Scissors
          </li>
          <li>
            <span className="font-medium">Scissors</span> cuts Paper
          </li>
          <li>
            <span className="font-medium">Paper</span> covers Rock
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Scoring</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Build your <span className="font-medium text-green-500">win streak</span> by winning consecutive rounds</li>
          <li>Ties don&apos;t break your streak</li>
          <li>Track your win percentage and try to beat the AI!</li>
          <li>Special celebration every 5 wins in a row!</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Tips</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The AI is completely random, so there&apos;s no pattern to exploit.
          It&apos;s all about luck and having fun!
        </p>
      </section>
    </div>
  );
}
