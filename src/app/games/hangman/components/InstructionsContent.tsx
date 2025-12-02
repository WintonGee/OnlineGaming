export default function InstructionsContent() {
  return (
    <div className="space-y-4">
      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          How to Play
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Hangman is a classic word guessing game. Try to guess the hidden word
          one letter at a time before the hangman is complete.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Game Rules
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>A word is chosen from a specific category</li>
          <li>Click a letter or use your keyboard to guess</li>
          <li>Correct guesses reveal the letter in the word</li>
          <li>Incorrect guesses add a part to the hangman drawing</li>
          <li>You have 6 incorrect guesses before you lose</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Winning & Losing
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Win:</strong> Guess all letters in the word before the
            hangman is complete
          </li>
          <li>
            <strong>Lose:</strong> The hangman is fully drawn (6 incorrect
            guesses)
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Tips & Strategy
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Start with common vowels (A, E, I, O, U)</li>
          <li>Try common consonants like R, S, T, N, L</li>
          <li>Look for patterns and word structure</li>
          <li>Consider the category when guessing</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2 text-black dark:text-white">
          Categories
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Choose from 8 different categories: Animals, Countries, Foods, Movies,
          Sports, Music, Nature, and Technology. Each category has a unique set
          of words to challenge you!
        </p>
      </section>
    </div>
  );
}
