"use client";

interface WordDisplayProps {
  solution: string;
  guessedLetters: string[];
  gameOver: boolean;
  category: string;
}

export default function WordDisplay({
  solution,
  guessedLetters,
  gameOver,
  category,
}: WordDisplayProps) {
  return (
    <div className="mb-8">
      {/* Category */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
          Category: {category}
        </span>
      </div>

      {/* Word */}
      <div className="flex justify-center gap-2 flex-wrap">
        {solution.split("").map((letter, index) => {
          const isGuessed = guessedLetters.includes(letter);
          const shouldReveal = isGuessed || gameOver;

          return (
            <div
              key={index}
              className="w-10 h-12 sm:w-12 sm:h-14 border-b-4 border-black dark:border-white flex items-center justify-center"
            >
              <span
                className={`text-2xl sm:text-3xl font-bold font-mono ${
                  shouldReveal
                    ? "text-black dark:text-white"
                    : "text-transparent"
                }`}
              >
                {letter}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
