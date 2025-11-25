import { Sparkles, CheckCircle2 } from "lucide-react";

export function AdvancedFeatures() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
          <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Advanced Features
        </h3>
      </div>
      <div className="space-y-2 ml-11 text-sm">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <p>
            <strong className="text-black dark:text-white">
              Auto Candidate Mode:
            </strong>{" "}
            Automatically fills in all possible candidates for empty cells
            based on Sudoku rules. Toggle this feature using the checkbox in
            the toolbar.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <p>
            <strong className="text-black dark:text-white">Check Cell:</strong>{" "}
            Verify if the currently selected cell has the correct value.
            Incorrect cells will be highlighted in red.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <p>
            <strong className="text-black dark:text-white">
              Check Puzzle:
            </strong>{" "}
            Check all cells at once to see if any of your entries are
            incorrect.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <p>
            <strong className="text-black dark:text-white">Reveal Cell:</strong>{" "}
            Shows the correct value for the selected cell when you&apos;re
            stuck.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <p>
            <strong className="text-black dark:text-white">
              Reveal Puzzle:
            </strong>{" "}
            Fills in the entire solution. Useful if you want to see the answer.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <p>
            <strong className="text-black dark:text-white">
              Reset Puzzle:
            </strong>{" "}
            Clears all your entries and notes to start fresh with the same
            puzzle.
          </p>
        </div>
      </div>
    </section>
  );
}
