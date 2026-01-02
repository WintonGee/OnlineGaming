export default function InstructionsContent() {
  return (
    <div className="space-y-4">
      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          How to Play
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Test your typing speed and accuracy by typing the displayed words as
          quickly and accurately as possible. The test will measure your words
          per minute (WPM) and accuracy percentage.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Test Modes
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Time Mode:</strong> Type as many words as you can within the
            time limit (15, 30, 60, or 120 seconds)
          </li>
          <li>
            <strong>Words Mode:</strong> Complete a set number of words (10, 25,
            50, or 100) as fast as possible
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Color Feedback
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-500 dark:text-green-400 font-mono font-bold">
              abc
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              Correct characters
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 dark:text-red-400 font-mono font-bold">
              abc
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              Incorrect characters
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-600 font-mono font-bold">
              abc
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              Pending characters (not yet typed)
            </span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          WPM Calculation
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Words per minute is calculated using the standard formula: characters
          typed divided by 5 (standard word length), divided by the time in
          minutes. Your final WPM only counts correctly typed characters.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <strong>Raw WPM</strong> includes all typed characters, while{" "}
          <strong>WPM</strong> only counts correct ones.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Keyboard Shortcuts
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
              Tab
            </kbd>{" "}
            - Restart test with new words
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
              Backspace
            </kbd>{" "}
            - Delete last character or go back to previous word
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
              Space
            </kbd>{" "}
            - Move to next word
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Tips for Improvement
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Focus on accuracy first, speed will follow</li>
          <li>Keep your fingers on the home row (ASDF JKL;)</li>
          <li>Practice regularly to build muscle memory</li>
          <li>Try to look at the screen, not your keyboard</li>
        </ul>
      </section>
    </div>
  );
}
