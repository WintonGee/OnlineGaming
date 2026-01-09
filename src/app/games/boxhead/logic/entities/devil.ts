import {
  Devil,
  Player,
  PlayerNumber,
  Projectile,
  Vector2D,
  Obstacle,
} from "../../types";
import {
  DEVIL_SIZE,
  DEVIL_BASE_SPEED,
  DEVIL_BASE_HEALTH,
  DEVIL_DAMAGE,
  DEVIL_FIRE_RATE,
  DEVIL_MIN_DISTANCE,
  DEVIL_MAX_DISTANCE,
  FIREBALL_SPEED,
  FIREBALL_DAMAGE,
  PROJECTILE_LIFETIME,
} from "../../constants";
import {
  subtract,
  normalize,
  scale,
  add,
  distance,
  perpendicular,
  generateId,
} from "../../utils/vector";
import { resolveObstacleCollision, clampToMapBounds } from "../map";

export function createDevil(
  position: Vector2D,
  waveNumber: number = 1
): Devil {
  // Scale health and speed with wave number
  const healthMultiplier = 1 + (waveNumber - 1) * 0.1;
  const speedMultiplier = 1 + (waveNumber - 1) * 0.015;

  return {
    id: generateId(),
    type: "devil",
    position: { ...position },
    velocity: { x: 0, y: 0 },
    health: Math.floor(DEVIL_BASE_HEALTH * healthMultiplier),
    maxHealth: Math.floor(DEVIL_BASE_HEALTH * healthMultiplier),
    isAlive: true,
    targetPlayerId: null,
    lastActionAt: 0,
    speed: DEVIL_BASE_SPEED * speedMultiplier,
    damage: DEVIL_DAMAGE,
    fireRate: DEVIL_FIRE_RATE,
    lastFiredAt: 0,
  };
}

export interface DevilUpdateResult {
  devil: Devil;
  projectile: Projectile | null;
}

export function updateDevil(
  devil: Devil,
  players: Map<PlayerNumber, Player>,
  deltaTime: number,
  obstacles: Obstacle[]
): DevilUpdateResult {
  if (!devil.isAlive) {
    return { devil, projectile: null };
  }

  const now = Date.now();

  // Find nearest alive player
  const target = findNearestPlayer(devil.position, players);
  if (!target) {
    return {
      devil: {
        ...devil,
        velocity: { x: 0, y: 0 },
        targetPlayerId: null,
      },
      projectile: null,
    };
  }

  const distanceToTarget = distance(devil.position, target.position);
  const directionToTarget = normalize(subtract(target.position, devil.position));

  // Movement: maintain optimal distance
  let velocity: Vector2D;

  if (distanceToTarget < DEVIL_MIN_DISTANCE) {
    // Too close, back away
    velocity = scale(directionToTarget, -devil.speed);
  } else if (distanceToTarget > DEVIL_MAX_DISTANCE) {
    // Too far, approach
    velocity = scale(directionToTarget, devil.speed);
  } else {
    // Good distance, strafe
    const strafeDirection = perpendicular(directionToTarget);
    // Randomly switch strafe direction occasionally
    const strafeFactor = Math.sin(now / 1000 + devil.id.charCodeAt(0)) > 0 ? 1 : -1;
    velocity = scale(strafeDirection, devil.speed * 0.7 * strafeFactor);
  }

  const movement = scale(velocity, deltaTime / 16);
  let newPosition = add(devil.position, movement);

  // Resolve collisions with obstacles
  newPosition = resolveObstacleCollision(
    newPosition,
    devil.position,
    DEVIL_SIZE,
    obstacles
  );

  // Clamp to map bounds
  newPosition = clampToMapBounds(newPosition, DEVIL_SIZE);

  // Shooting
  let projectile: Projectile | null = null;
  if (now - devil.lastFiredAt >= devil.fireRate) {
    projectile = createFireball(devil, target.position);
  }

  return {
    devil: {
      ...devil,
      position: newPosition,
      velocity,
      targetPlayerId: target.id,
      lastFiredAt: projectile ? now : devil.lastFiredAt,
    },
    projectile,
  };
}

export function damageDevil(devil: Devil, damage: number): Devil {
  if (!devil.isAlive) return devil;

  const newHealth = Math.max(0, devil.health - damage);
  return {
    ...devil,
    health: newHealth,
    isAlive: newHealth > 0,
  };
}

export function getDevilBoundingBox(devil: Devil) {
  return {
    x: devil.position.x - DEVIL_SIZE / 2,
    y: devil.position.y - DEVIL_SIZE / 2,
    width: DEVIL_SIZE,
    height: DEVIL_SIZE,
  };
}

function createFireball(devil: Devil, targetPosition: Vector2D): Projectile {
  const direction = normalize(subtract(targetPosition, devil.position));
  const velocity = scale(direction, FIREBALL_SPEED);

  return {
    id: generateId(),
    position: { ...devil.position },
    velocity,
    weaponType: "pistol", // Using pistol type for fireball (no special handling needed)
    source: "devil",
    damage: FIREBALL_DAMAGE,
    piercing: false,
    hitEntities: new Set(),
    createdAt: Date.now(),
    maxLifetime: PROJECTILE_LIFETIME,
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
