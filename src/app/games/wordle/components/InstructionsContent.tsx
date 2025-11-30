export default function InstructionsContent() {
  return (
    <>
      <p>
        Guess the <strong>5-letter word</strong> in <strong>6 tries</strong>. After each guess, the color of the tiles will change to show how close your guess was to the word.
      </p>

      <div className="space-y-3 my-4">
        <div>
          <p className="font-semibold mb-2">Examples:</p>

          <div className="flex gap-1 mb-2">
            <div className="w-10 h-10 border-2 bg-green-500 border-green-500 flex items-center justify-center text-white font-bold">
              W
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              O
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              R
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              L
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              D
            </div>
          </div>
          <p className="text-sm">
            <strong className="text-green-600 dark:text-green-400">W</strong> is in the word and in the correct spot.
          </p>
        </div>

        <div>
          <div className="flex gap-1 mb-2">
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              P
            </div>
            <div className="w-10 h-10 border-2 bg-yellow-500 border-yellow-500 flex items-center justify-center text-white font-bold">
              L
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              A
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              N
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              E
            </div>
          </div>
          <p className="text-sm">
            <strong className="text-yellow-600 dark:text-yellow-400">L</strong> is in the word but in the wrong spot.
          </p>
        </div>

        <div>
          <div className="flex gap-1 mb-2">
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              V
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              A
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              G
            </div>
            <div className="w-10 h-10 border-2 bg-gray-400 border-gray-400 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold">
              E
            </div>
          </div>
          <p className="text-sm">
            <strong className="text-gray-600 dark:text-gray-400">U</strong> is not in the word in any spot.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Hard Mode:</p>
        <p className="text-sm">
          When enabled, revealed hints must be used in subsequent guesses. Any green letters must stay in the same position, and any yellow letters must be included in your next guess.
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A new random word is generated for each game, so you can play as many times as you want!
        </p>
      </div>
    </>
  );
}
