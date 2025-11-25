import { Gamepad2, MousePointer, Grid3x3, Keyboard, RotateCcw } from "lucide-react";

export function BasicControls() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
          <Gamepad2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Basic Controls
        </h3>
      </div>
      <div className="grid gap-3 ml-11">
        <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
          <MousePointer className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-black dark:text-white">
              Selecting Cells
            </p>
            <p className="text-sm mt-0.5">
              Click or tap any empty cell to select it. The selected cell will
              be highlighted.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
          <Grid3x3 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-black dark:text-white">
              Entering Numbers
            </p>
            <p className="text-sm mt-0.5">
              Use the number pad below the grid or type 1-9 directly on your
              keyboard.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
          <Keyboard className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-black dark:text-white">
              Keyboard Navigation
            </p>
            <p className="text-sm mt-0.5">
              Use{" "}
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                →
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                ↓
              </kbd>
              arrow keys to move between cells
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
          <RotateCcw className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-black dark:text-white">
              Undo & Clear
            </p>
            <p className="text-sm mt-0.5">
              Press{" "}
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                Backspace
              </kbd>{" "}
              or
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                Delete
              </kbd>{" "}
              to clear a cell. Use{" "}
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                Ctrl+Z
              </kbd>{" "}
              (
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded mx-1">
                ⌘Z
              </kbd>{" "}
              on Mac) to undo moves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
