export default function InstructionsContent() {
  return (
    <>
      <p>
        Guess the secret <strong>4-color code</strong> in <strong>10 attempts</strong>. After each guess, you&apos;ll receive feedback showing how close your guess was.
      </p>

      <div className="my-4">
        <p className="font-semibold mb-2">How to Play:</p>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Click on a slot to select it</li>
          <li>Click on a color from the palette to fill the slot</li>
          <li>Complete all 4 slots and submit your guess</li>
          <li>Review the feedback to refine your next guess</li>
        </ol>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Feedback:</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm">
              <strong>Green:</strong> Correct color in the correct position
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-yellow-500 dark:bg-yellow-600" />
            <p className="text-sm">
              <strong>Yellow:</strong> Correct color but wrong position
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600" />
            <p className="text-sm">
              <strong>Gray:</strong> Color is not in the code
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
                <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 dark:bg-yellow-600" />
                <div className="w-4 h-4 rounded-full bg-yellow-500 dark:bg-yellow-600" />
                <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>

            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Red is correct (green)</li>
              <li>• Green and Yellow are in the code but wrong positions (yellow)</li>
              <li>• Orange is not in the code (gray)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Important:</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Feedback indicators show <strong>totals only</strong> — they don&apos;t tell you which specific positions are correct or misplaced.
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="font-semibold mb-2">Available Colors:</p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-red-500" />
            <span className="text-sm">Red</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-500" />
            <span className="text-sm">Blue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-green-500" />
            <span className="text-sm">Green</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-yellow-400" />
            <span className="text-sm">Yellow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-orange-500" />
            <span className="text-sm">Orange</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-purple-500" />
            <span className="text-sm">Purple</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Colors can repeat in the secret code!
        </p>
      </div>
    </>
  );
}
