import { Target } from "lucide-react";

export function GameObjective() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 mt-0.5">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            Game Objective
          </h3>
          <p className="leading-relaxed">
            Fill the 9×9 grid so that every row, column, and 3×3 box contains
            the digits 1-9 exactly once, without any repetition. Some cells are
            pre-filled to give you a starting point.
          </p>
        </div>
      </div>
    </section>
  );
}
