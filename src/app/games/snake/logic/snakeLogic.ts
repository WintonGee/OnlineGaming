import { Position, Direction, GameState } from "../types";
import {
  DIRECTION_DELTAS,
  OPPOSITE_DIRECTIONS,
  INITIAL_SNAKE_LENGTH,
} from "../constants";

/**
 * Initialize the snake at the center of the board
 */
export function initializeSnake(gridSize: number): Position[] {
  const centerRow = Math.floor(gridSize / 2);
  const startCol = Math.floor(gridSize / 2) - Math.floor(INITIAL_SNAKE_LENGTH / 2);

  const snake: Position[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ row: centerRow, col: startCol + INITIAL_SNAKE_LENGTH - 1 - i });
  }

  return snake;
}

/**
 * Generate a random food position that doesn't overlap with the snake
 */
export function generateFood(snake: Position[], gridSize: number): Position {
  const occupiedCells = new Set(snake.map((p) => `${p.row},${p.col}`));

  // Get all empty cells
  const emptyCells: Position[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (!occupiedCells.has(`${row},${col}`)) {
        emptyCells.push({ row, col });
      }
    }
  }

  // Return random empty cell, or fallback to (0,0) if no empty cells
  if (emptyCells.length === 0) {
    return { row: 0, col: 0 };
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

/**
 * Check if a position is within the grid bounds
 */
export function isWithinBounds(position: Position, gridSize: number): boolean {
  return (
    position.row >= 0 &&
    position.row < gridSize &&
    position.col >= 0 &&
    position.col < gridSize
  );
}

/**
 * Check if the snake has collided with itself
 */
export function hasCollidedWithSelf(snake: Position[]): boolean {
  if (snake.length < 2) return false;

  const head = snake[0];
  return snake.slice(1).some((p) => p.row === head.row && p.col === head.col);
}

/**
 * Check if the snake has collided with walls
 */
export function hasCollidedWithWall(head: Position, gridSize: number): boolean {
  return !isWithinBounds(head, gridSize);
}

/**
 * Check if the snake has eaten food
 */
export function hasEatenFood(head: Position, food: Position): boolean {
  return head.row === food.row && head.col === food.col;
}

/**
 * Check if the game is won (snake fills the entire board)
 */
export function hasWon(snake: Position[], gridSize: number): boolean {
  return snake.length >= gridSize * gridSize;
}

/**
 * Check if a direction change is valid (not reversing)
 */
export function isValidDirectionChange(
  currentDirection: Direction,
  newDirection: Direction
): boolean {
  return OPPOSITE_DIRECTIONS[currentDirection] !== newDirection;
}

/**
 * Get the next head position based on direction
 */
export function getNextHeadPosition(
  head: Position,
  direction: Direction
): Position {
  const delta = DIRECTION_DELTAS[direction];
  return {
    row: head.row + delta.row,
    col: head.col + delta.col,
  };
}

/**
 * Move the snake in the current direction
 * Returns the new snake array and whether food was eaten
 */
export function moveSnake(
  snake: Position[],
  direction: Direction,
  food: Position,
  gridSize: number
): { newSnake: Position[]; ateFood: boolean; collision: boolean } {
  const head = snake[0];
  const newHead = getNextHeadPosition(head, direction);

  // Check for wall collision
  if (hasCollidedWithWall(newHead, gridSize)) {
    return { newSnake: snake, ateFood: false, collision: true };
  }

  // Create new snake with new head
  const newSnake = [newHead, ...snake];

  // Check for self collision (before removing tail)
  if (hasCollidedWithSelf(newSnake)) {
    return { newSnake: snake, ateFood: false, collision: true };
  }

  // Check if food was eaten
  const ateFood = hasEatenFood(newHead, food);

  // Remove tail if no food was eaten
  if (!ateFood) {
    newSnake.pop();
  }

  return { newSnake, ateFood, collision: false };
}

/**
 * Initialize a new game state
 */
export function initializeGameState(gridSize: number): GameState {
  const snake = initializeSnake(gridSize);
  const food = generateFood(snake, gridSize);

  return {
    snake,
    food,
    direction: "right",
    nextDirection: "right",
    gameOver: false,
    won: false,
    score: 0,
    isPaused: false,
  };
}

/**
 * Process one game tick - move snake and handle collisions/food
 */
export function processGameTick(
  state: GameState,
  gridSize: number
): GameState {
  if (state.gameOver || state.isPaused) {
    return state;
  }

  const { newSnake, ateFood, collision } = moveSnake(
    state.snake,
    state.nextDirection,
    state.food,
    gridSize
  );

  if (collision) {
    return {
      ...state,
      direction: state.nextDirection,
      gameOver: true,
    };
  }

  const newScore = ateFood ? state.score + 1 : state.score;
  const newFood = ateFood ? generateFood(newSnake, gridSize) : state.food;
  const won = hasWon(newSnake, gridSize);

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction: state.nextDirection,
    score: newScore,
    gameOver: won,
    won,
  };
}
