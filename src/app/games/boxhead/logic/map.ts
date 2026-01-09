import { GameMap, Obstacle, SpawnPoint, Vector2D } from "../types";
import { MAP_WIDTH, MAP_HEIGHT } from "../constants";
import { generateId } from "../utils/vector";

export function createDefaultMap(): GameMap {
  const obstacles: Obstacle[] = [
    // Central obstacles
    createObstacle(200, 200, 60, 60),
    createObstacle(600, 200, 60, 60),
    createObstacle(200, 400, 60, 60),
    createObstacle(600, 400, 60, 60),
    createObstacle(400, 300, 80, 80),
    // Side barriers
    createObstacle(100, 300, 40, 100),
    createObstacle(700, 300, 40, 100),
    // Corner obstacles
    createObstacle(100, 100, 50, 50),
    createObstacle(700, 100, 50, 50),
    createObstacle(100, 500, 50, 50),
    createObstacle(700, 500, 50, 50),
  ];

  const playerSpawns: SpawnPoint[] = [
    { position: { x: 150, y: 300 }, type: "player" },
    { position: { x: 650, y: 300 }, type: "player" },
  ];

  const enemySpawns: SpawnPoint[] = [
    { position: { x: 50, y: 50 }, type: "enemy" },
    { position: { x: 750, y: 50 }, type: "enemy" },
    { position: { x: 50, y: 550 }, type: "enemy" },
    { position: { x: 750, y: 550 }, type: "enemy" },
    { position: { x: 400, y: 50 }, type: "enemy" },
    { position: { x: 400, y: 550 }, type: "enemy" },
  ];

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    obstacles,
    playerSpawns,
    enemySpawns,
  };
}

function createObstacle(
  x: number,
  y: number,
  width: number,
  height: number,
  destructible: boolean = false
): Obstacle {
  return {
    id: generateId(),
    bounds: {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
    },
    destructible,
    health: destructible ? 100 : undefined,
  };
}

export function getRandomEnemySpawn(map: GameMap): Vector2D {
  const spawn = map.enemySpawns[Math.floor(Math.random() * map.enemySpawns.length)];
  // Add some randomness to spawn position
  return {
    x: spawn.position.x + (Math.random() - 0.5) * 40,
    y: spawn.position.y + (Math.random() - 0.5) * 40,
  };
}

export function getPlayerSpawn(map: GameMap, playerNumber: 1 | 2): Vector2D {
  const spawnIndex = playerNumber - 1;
  if (spawnIndex < map.playerSpawns.length) {
    return { ...map.playerSpawns[spawnIndex].position };
  }
  // Fallback
  return { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
}

export function isPositionBlocked(
  position: Vector2D,
  size: number,
  obstacles: Obstacle[]
): boolean {
  const halfSize = size / 2;
  const entityBox = {
    x: position.x - halfSize,
    y: position.y - halfSize,
    width: size,
    height: size,
  };

  for (const obstacle of obstacles) {
    if (
      entityBox.x < obstacle.bounds.x + obstacle.bounds.width &&
      entityBox.x + entityBox.width > obstacle.bounds.x &&
      entityBox.y < obstacle.bounds.y + obstacle.bounds.height &&
      entityBox.y + entityBox.height > obstacle.bounds.y
    ) {
      return true;
    }
  }

  return false;
}

export function resolveObstacleCollision(
  position: Vector2D,
  previousPosition: Vector2D,
  size: number,
  obstacles: Obstacle[]
): Vector2D {
  // Try the new position
  if (!isPositionBlocked(position, size, obstacles)) {
    return position;
  }

  // Try moving only horizontally
  const horizontalOnly = { x: position.x, y: previousPosition.y };
  if (!isPositionBlocked(horizontalOnly, size, obstacles)) {
    return horizontalOnly;
  }

  // Try moving only vertically
  const verticalOnly = { x: previousPosition.x, y: position.y };
  if (!isPositionBlocked(verticalOnly, size, obstacles)) {
    return verticalOnly;
  }

  // Can't move at all, stay in place
  return previousPosition;
}

export function clampToMapBounds(
  position: Vector2D,
  size: number
): Vector2D {
  const halfSize = size / 2;
  return {
    x: Math.max(halfSize, Math.min(MAP_WIDTH - halfSize, position.x)),
    y: Math.max(halfSize, Math.min(MAP_HEIGHT - halfSize, position.y)),
  };
}
