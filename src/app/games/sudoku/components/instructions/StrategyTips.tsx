import { Lightbulb } from "lucide-react";

export function StrategyTips() {
  return (
    <section className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-start gap-3">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 mt-0.5">
          <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
            Solving Strategies & Tips
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                •
              </span>
              <span>
                <strong className="text-black dark:text-white">
                  Start with the obvious:
                </strong>{" "}
                Look for rows, columns, or 3×3 boxes that already have many
                numbers filled in. These are easier to complete.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                •
              </span>
              <span>
                <strong className="text-black dark:text-white">
                  Use candidates wisely:
                </strong>{" "}
                When you&apos;re unsure, switch to Candidate Mode and mark all
                possible numbers for a cell. This helps visualize your options.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                •
              </span>
              <span>
                <strong className="text-black dark:text-white">
                  Find naked singles:
                </strong>{" "}
                Look for cells that can only contain one possible number based
                on the numbers already in its row, column, and box.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                •
              </span>
              <span>
                <strong className="text-black dark:text-white">
                  Hidden singles:
                </strong>{" "}
                Sometimes a number can only go in one cell within a row, column,
                or box, even if that cell has other candidates.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                •
              </span>
              <span>
                <strong className="text-black dark:text-white">
                  Work systematically:
                </strong>{" "}
                Focus on one section at a time rather than jumping around
                randomly. This helps you spot patterns more easily.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold mt-0.5">
                •
              </span>
              <span>
                <strong className="text-black dark:text-white">
                  Use the help menu:
                </strong>{" "}
                Don&apos;t hesitate to use &quot;Check Cell&quot; or &quot;Check
                Puzzle&quot; if you&apos;re stuck. Learning from mistakes is
                part of the process!
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
