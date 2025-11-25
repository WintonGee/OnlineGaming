import { PenLine } from "lucide-react";

export function InputModes() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2">
          <PenLine className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Input Modes
        </h3>
      </div>
      <div className="grid gap-3 ml-11">
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
          <p className="font-medium text-black dark:text-white mb-1">
            Normal Mode
          </p>
          <p className="text-sm">
            Enter your final answer for a cell. The number will appear large
            and centered in the cell.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
          <p className="font-medium text-black dark:text-white mb-1">
            Candidate Mode
          </p>
          <p className="text-sm">
            Add small pencil marks to track possible numbers for a cell. This
            is essential for advanced solving techniques. Toggle between modes
            using the buttons below the grid.
          </p>
        </div>
      </div>
    </section>
  );
}
