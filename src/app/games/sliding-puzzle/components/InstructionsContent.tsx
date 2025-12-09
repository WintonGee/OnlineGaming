export default function InstructionsContent() {
  return (
    <div className="space-y-6">
      {/* Objective */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Arrange the numbered tiles in order from 1 to N by sliding them into
          the empty space. The goal is to have all numbers in sequence, with the
          empty space in the bottom-right corner.
        </p>
      </section>

      {/* How to Play */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Click or tap</strong> on a tile adjacent to the empty space
            to slide it
          </li>
          <li>
            <strong>Arrow keys:</strong> Use keyboard arrows to move tiles in
            that direction
          </li>
          <li>
            <strong>Swipe:</strong> On mobile, swipe in any direction to move
            tiles
          </li>
        </ul>
      </section>

      {/* Difficulty Levels */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Difficulty Levels
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Easy (3×3):</strong> 8 tiles - Great for beginners
          </li>
          <li>
            <strong>Medium (4×4):</strong> 15 tiles - The classic puzzle
          </li>
          <li>
            <strong>Hard (5×5):</strong> 24 tiles - For puzzle masters
          </li>
        </ul>
      </section>

      {/* Tips */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Tips
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Work on solving the top row first, then move down row by row</li>
          <li>
            For the last two rows, solve the left columns first
          </li>
          <li>
            Try to minimize moves - fewer moves means a better score!
          </li>
          <li>Your best time and moves are saved for each difficulty level</li>
        </ul>
      </section>

      {/* History */}
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          About
        </h3>
        <p>
          The sliding puzzle, also known as the 15-puzzle or Gem Puzzle, was
          invented in the 1870s and became a worldwide craze. It&apos;s a
          classic puzzle that tests your spatial reasoning and planning skills.
        </p>
      </section>
    </div>
  );
}
