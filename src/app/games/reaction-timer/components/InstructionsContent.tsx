export default function InstructionsContent() {
  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300">
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click the blue area to start</li>
          <li>Wait for the screen to turn green</li>
          <li>Click as fast as you can when it turns green!</li>
          <li>Your reaction time will be displayed in milliseconds</li>
        </ol>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Tips
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Stay focused and keep your finger ready</li>
          <li>Don&apos;t click too early - the red phase has a random duration</li>
          <li>If you click too early, the screen turns yellow</li>
          <li>Try multiple times to get a consistent average</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Reaction Time Guide
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
            <span className="font-medium">&lt; 200ms</span>
            <span className="block text-xs text-gray-600 dark:text-gray-400">
              Excellent
            </span>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
            <span className="font-medium">200-250ms</span>
            <span className="block text-xs text-gray-600 dark:text-gray-400">
              Great
            </span>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
            <span className="font-medium">250-300ms</span>
            <span className="block text-xs text-gray-600 dark:text-gray-400">
              Good
            </span>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
            <span className="font-medium">&gt; 300ms</span>
            <span className="block text-xs text-gray-600 dark:text-gray-400">
              Average
            </span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Did You Know?
        </h3>
        <p className="text-sm">
          The average human reaction time to a visual stimulus is around 250ms.
          Professional esports players often achieve times under 200ms!
        </p>
      </section>
    </div>
  );
}
