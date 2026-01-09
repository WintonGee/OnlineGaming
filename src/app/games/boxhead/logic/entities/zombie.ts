import {
  Zombie,
  Player,
  PlayerNumber,
  Vector2D,
  Obstacle,
} from "../../types";
import {
  ZOMBIE_SIZE,
  ZOMBIE_BASE_SPEED,
  ZOMBIE_BASE_HEALTH,
  ZOMBIE_DAMAGE,
  ZOMBIE_ATTACK_COOLDOWN,
} from "../../constants";
import {
  subtract,
  normalize,
  scale,
  add,
  distance,
  generateId,
} from "../../utils/vector";
import { resolveObstacleCollision, clampToMapBounds } from "../map";

export function createZombie(
  position: Vector2D,
  waveNumber: number = 1
): Zombie {
  // Scale health and speed with wave number
  const healthMultiplier = 1 + (waveNumber - 1) * 0.1;
  const speedMultiplier = 1 + (waveNumber - 1) * 0.02;

  return {
    id: generateId(),
    type: "zombie",
    position: { ...position },
    velocity: { x: 0, y: 0 },
    health: Math.floor(ZOMBIE_BASE_HEALTH * healthMultiplier),
    maxHealth: Math.floor(ZOMBIE_BASE_HEALTH * healthMultiplier),
    isAlive: true,
    targetPlayerId: null,
    lastActionAt: 0,
    speed: ZOMBIE_BASE_SPEED * speedMultiplier,
    damage: ZOMBIE_DAMAGE,
  };
}

export function updateZombie(
  zombie: Zombie,
  players: Map<PlayerNumber, Player>,
  deltaTime: number,
  obstacles: Obstacle[]
): Zombie {
  if (!zombie.isAlive) return zombie;

  // Find nearest alive player
  const target = findNearestPlayer(zombie.position, players);
  if (!target) {
    return {
      ...zombie,
      velocity: { x: 0, y: 0 },
      targetPlayerId: null,
    };
  }

  // Calculate direction towards player
  const toTarget = subtract(target.position, zombie.position);
  const direction = normalize(toTarget);

  // Move towards player
  const velocity = scale(direction, zombie.speed);
  const movement = scale(velocity, deltaTime / 16);
  let newPosition = add(zombie.position, movement);

  // Resolve collisions with obstacles
  newPosition = resolveObstacleCollision(
    newPosition,
    zombie.position,
    ZOMBIE_SIZE,
    obstacles
  );

  // Clamp to map bounds
  newPosition = clampToMapBounds(newPosition, ZOMBIE_SIZE);

  return {
    ...zombie,
    position: newPosition,
    velocity,
    targetPlayerId: target.id,
  };
}

export function damageZombie(zombie: Zombie, damage: number): Zombie {
  if (!zombie.isAlive) return zombie;

  const newHealth = Math.max(0, zombie.health - damage);
  return {
    ...zombie,
    health: newHealth,
    isAlive: newHealth > 0,
  };
}

export function canZombieAttack(zombie: Zombie): boolean {
  const now = Date.now();
  return now - zombie.lastActionAt >= ZOMBIE_ATTACK_COOLDOWN;
}

export function zombieAttacked(zombie: Zombie): Zombie {
  return {
    ...zombie,
    lastActionAt: Date.now(),
  };
}

export function getZombieBoundingBox(zombie: Zombie) {
  return {
    x: zombie.position.x - ZOMBIE_SIZE / 2,
    y: zombie.position.y - ZOMBIE_SIZE / 2,
    width: ZOMBIE_SIZE,
    height: ZOMBIE_SIZE,
  };
}

function findNearestPlayer(
  position: Vector2D,
  players: Map<PlayerNumber, Player>
): Player | null {
  let nearest: Player | null = null;
  let nearestDistance = Infinity;

  players.forEach((player) => {
    if (!player.isAlive) return;

    const dist = distance(position, player.position);
    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearest = player;
    }
  });

  return nearest;
}
