export default function InstructionsContent() {
  return (
    <>
      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Guide the snake to eat the red food to grow longer. The game ends if
          you hit a wall or your own tail.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Controls
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Desktop:</span> Use arrow keys to
            change direction
          </li>
          <li>
            <span className="font-medium">Mobile:</span> Swipe in the direction
            you want to move
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">Rules</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>The snake cannot reverse direction</li>
          <li>Each food eaten adds 1 point</li>
          <li>Higher difficulty = larger grid and faster speed</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Difficulty Levels
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Easy:</span> 10x10 grid, slower speed
          </li>
          <li>
            <span className="font-medium">Medium:</span> 15x15 grid, medium
            speed
          </li>
          <li>
            <span className="font-medium">Hard:</span> 20x20 grid, fast speed
          </li>
        </ul>
      </div>
    </>
  );
}
