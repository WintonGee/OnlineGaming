export default function InstructionsContent() {
  return (
    <>
      <p>
        Guess the secret <strong>4-color code</strong> in <strong>10 attempts</strong>. After each guess, you'll receive feedback pegs showing how close your guess was to the code.
      </p>

      <div className="my-4">
        <p className="font-semibold mb-2">How to Play:</p>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Click on a slot to select it</li>
          <li>Click on a color from the palette to fill the slot</li>
          <li>Complete all 4 slots and submit your guess</li>
          <li>Review the feedback pegs to refine your next guess</li>
        </ol>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Feedback Pegs:</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-black border-2 border-black"></div>
            <p className="text-sm">
              <strong>Black peg (filled circle):</strong> Correct color in the correct position
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-800 dark:border-gray-200"></div>
            <p className="text-sm">
              <strong>White peg (outlined circle):</strong> Correct color but in the wrong position
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
            <p className="text-sm">
              <strong>Empty peg:</strong> Color is not in the code
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Example:</p>

        <div className="space-y-3">
          <div>
            <p className="text-sm mb-2">Secret code: <span className="font-mono">🔴 🟢 🟡 🟣</span></p>
            <p className="text-sm mb-2">Your guess: <span className="font-mono">🔴 🟠 🟢 🟡</span></p>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold">Feedback:</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full bg-black"></div>
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-800 dark:border-gray-200"></div>
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-800 dark:border-gray-200"></div>
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
              </div>
            </div>

            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Red is correct (black peg)</li>
              <li>• Green and Yellow are in the code but wrong positions (white pegs)</li>
              <li>• Orange is not in the code (empty peg)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Important:</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Feedback pegs are <strong>not in order</strong>. They don't correspond to specific positions in your guess - they only tell you how many colors are correct or misplaced in total.
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Available Colors:</p>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500"></div>
            <span className="text-sm">Red</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500"></div>
            <span className="text-sm">Blue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500"></div>
            <span className="text-sm">Green</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Yellow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500"></div>
            <span className="text-sm">Orange</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-500"></div>
            <span className="text-sm">Purple</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A new random code is generated for each game. Colors can repeat in the secret code!
        </p>
      </div>
    </>
  );
}
