import { MazeModuleState, MazePosition } from "../types";
import { MAZE_INDICATORS, MAZE_WALLS } from "../constants";

type Direction = "up" | "down" | "left" | "right";

/**
 * Convert wall array data to a lookup structure
 * Returns a Set of strings like "r1c1-r1c2" for walls between cells
 */
function buildWallSet(mazeIndex: number): Set<string> {
  const walls = new Set<string>();
  const wallData = MAZE_WALLS[mazeIndex];

  for (const wall of wallData) {
    const [r1, c1, r2, c2] = wall;
    // Add both directions for easy lookup
    walls.add(`${r1},${c1}-${r2},${c2}`);
    walls.add(`${r2},${c2}-${r1},${c1}`);
  }

  return walls;
}

/**
 * Check if there's a wall between two adjacent cells
 */
function hasWall(wallSet: Set<string>, from: MazePosition, to: MazePosition): boolean {
  return wallSet.has(`${from.row},${from.col}-${to.row},${to.col}`);
}

/**
 * Generate a 4D wall array for the module state
 * walls[row][col][direction] where direction: 0=up, 1=right, 2=down, 3=left
 */
function generateWallArray(mazeIndex: number): boolean[][][][] {
  const wallSet = buildWallSet(mazeIndex);
  const walls: boolean[][][][] = [];

  for (let row = 0; row < 6; row++) {
    walls[row] = [];
    for (let col = 0; col < 6; col++) {
      walls[row][col] = [];
      // Check each direction
      const directions = [
        { row: row - 1, col }, // up
        { row, col: col + 1 }, // right
        { row: row + 1, col }, // down
        { row, col: col - 1 }, // left
      ];

      for (let dir = 0; dir < 4; dir++) {
        const target = directions[dir];
        // Wall if out of bounds or if wall exists between cells
        const outOfBounds =
          target.row < 0 || target.row >= 6 || target.col < 0 || target.col >= 6;
        const hasWallBetween = hasWall(wallSet, { row, col }, target);
        walls[row][col][dir] = [outOfBounds || hasWallBetween];
      }
    }
  }

  return walls;
}

/**
 * Generate a new Maze module
 */
export function generateMazeModule(): MazeModuleState {
  // Pick a random maze (0-8)
  const mazeIndex = Math.floor(Math.random() * 9);
  const indicators = MAZE_INDICATORS[mazeIndex];

  // Generate random player and goal positions (not on indicators, not same position)
  const getRandomPosition = (exclude: MazePosition[]): MazePosition => {
    let pos: MazePosition;
    do {
      pos = {
        row: Math.floor(Math.random() * 6),
        col: Math.floor(Math.random() * 6),
      };
    } while (
      exclude.some((e) => e.row === pos.row && e.col === pos.col)
    );
    return pos;
  };

  const playerPosition = getRandomPosition([indicators[0], indicators[1]]);
  const goalPosition = getRandomPosition([
    indicators[0],
    indicators[1],
    playerPosition,
  ]);

  return {
    id: `maze-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "maze",
    status: "unsolved",
    mazeIndex,
    playerPosition,
    goalPosition,
    indicators: [indicators[0], indicators[1]],
    walls: generateWallArray(mazeIndex),
  };
}

/**
 * Try to move in a direction
 * Returns whether the move was successful (no wall) and the new state
 */
export function tryMove(
  module: MazeModuleState,
  direction: Direction
): { newState: MazeModuleState; hitWall: boolean; reachedGoal: boolean } {
  const { playerPosition, goalPosition, mazeIndex } = module;
  const wallSet = buildWallSet(mazeIndex);

  // Calculate target position
  const directionDeltas: Record<Direction, { row: number; col: number }> = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
  };

  const delta = directionDeltas[direction];
  const targetPosition: MazePosition = {
    row: playerPosition.row + delta.row,
    col: playerPosition.col + delta.col,
  };

  // Check if out of bounds (no strike, just stay in place)
  if (
    targetPosition.row < 0 ||
    targetPosition.row >= 6 ||
    targetPosition.col < 0 ||
    targetPosition.col >= 6
  ) {
    return {
      newState: module,
      hitWall: false,
      reachedGoal: false,
    };
  }

  // Check if there's a wall
  if (hasWall(wallSet, playerPosition, targetPosition)) {
    return {
      newState: { ...module, status: "strike" },
      hitWall: true,
      reachedGoal: false,
    };
  }

  // Move successful
  const reachedGoal =
    targetPosition.row === goalPosition.row &&
    targetPosition.col === goalPosition.col;

  return {
    newState: {
      ...module,
      playerPosition: targetPosition,
      status: reachedGoal ? "solved" : "unsolved",
    },
    hitWall: false,
    reachedGoal,
  };
}

/**
 * Get the wall data for rendering
 * Returns which walls exist for each cell
 */
export function getWallsForRendering(mazeIndex: number): {
  row: number;
  col: number;
  walls: { up: boolean; right: boolean; down: boolean; left: boolean };
}[] {
  const wallSet = buildWallSet(mazeIndex);
  const result: {
    row: number;
    col: number;
    walls: { up: boolean; right: boolean; down: boolean; left: boolean };
  }[] = [];

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      result.push({
        row,
        col,
        walls: {
          up:
            row === 0 ||
            hasWall(wallSet, { row, col }, { row: row - 1, col }),
          right:
            col === 5 ||
            hasWall(wallSet, { row, col }, { row, col: col + 1 }),
          down:
            row === 5 ||
            hasWall(wallSet, { row, col }, { row: row + 1, col }),
          left:
            col === 0 ||
            hasWall(wallSet, { row, col }, { row, col: col - 1 }),
        },
      });
    }
  }

  return result;
}
