import { ArrowUp } from "lucide-react";

export function DifficultyLevels() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
          <ArrowUp className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Difficulty Levels
        </h3>
      </div>
      <div className="grid gap-2 ml-11 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p>
            <strong className="text-black dark:text-white">Easy:</strong> Perfect
            for beginners. Fewer empty cells and straightforward logic.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <p>
            <strong className="text-black dark:text-white">Medium:</strong>{" "}
            Requires some strategy and candidate tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <p>
            <strong className="text-black dark:text-white">Hard:</strong>{" "}
            Challenging puzzles that need advanced techniques and patience.
          </p>
        </div>
      </div>
    </section>
  );
}
