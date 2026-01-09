import {
  Projectile,
  ProjectileSource,
  Player,
  WeaponType,
  Vector2D,
} from "../../types";
import {
  WEAPON_DEFINITIONS,
  PROJECTILE_LIFETIME,
  PROJECTILE_SIZE,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "../../constants";
import {
  add,
  scale,
  generateId,
  directionToAngle,
  angleToVector,
  rotate,
} from "../../utils/vector";

export function createProjectile(
  player: Player,
  weaponType: WeaponType
): Projectile[] {
  const definition = WEAPON_DEFINITIONS[weaponType];

  if (definition.isPlaceable || definition.projectileCount === 0) {
    return [];
  }

  const projectiles: Projectile[] = [];
  const baseAngle = directionToAngle(player.direction);

  for (let i = 0; i < definition.projectileCount; i++) {
    // Calculate spread angle
    let spreadOffset = 0;
    if (definition.projectileCount > 1) {
      const spreadRange = definition.spread;
      spreadOffset =
        (i - (definition.projectileCount - 1) / 2) *
        (spreadRange / (definition.projectileCount - 1));
    }

    // Add slight randomness for weapons with spread
    const randomSpread =
      definition.spread > 0 ? (Math.random() - 0.5) * 2 : 0;
    const angle = baseAngle + spreadOffset + randomSpread;

    const velocity = scale(angleToVector(angle), definition.projectileSpeed);

    projectiles.push({
      id: generateId(),
      position: { ...player.position },
      velocity,
      weaponType,
      source: `player${player.id}` as ProjectileSource,
      damage: definition.damage,
      piercing: definition.piercing,
      hitEntities: new Set(),
      createdAt: Date.now(),
      maxLifetime: PROJECTILE_LIFETIME,
    });
  }

  return projectiles;
}

export function createGrenadeProjectile(
  player: Player
): Projectile {
  const definition = WEAPON_DEFINITIONS.grenade;
  const angle = directionToAngle(player.direction);
  const velocity = scale(angleToVector(angle), definition.projectileSpeed);

  return {
    id: generateId(),
    position: { ...player.position },
    velocity,
    weaponType: "grenade",
    source: `player${player.id}` as ProjectileSource,
    damage: definition.damage,
    piercing: false,
    hitEntities: new Set(),
    createdAt: Date.now(),
    maxLifetime: 1000, // Grenades explode after 1 second
  };
}

export function createRocketProjectile(
  player: Player
): Projectile {
  const definition = WEAPON_DEFINITIONS.rockets;
  const angle = directionToAngle(player.direction);
  const velocity = scale(angleToVector(angle), definition.projectileSpeed);

  return {
    id: generateId(),
    position: { ...player.position },
    velocity,
    weaponType: "rockets",
    source: `player${player.id}` as ProjectileSource,
    damage: definition.damage,
    piercing: false,
    hitEntities: new Set(),
    createdAt: Date.now(),
    maxLifetime: PROJECTILE_LIFETIME,
  };
}

export function updateProjectile(
  projectile: Projectile,
  deltaTime: number
): Projectile {
  const movement = scale(projectile.velocity, deltaTime / 16);
  const newPosition = add(projectile.position, movement);

  return {
    ...projectile,
    position: newPosition,
  };
}

export function isProjectileExpired(projectile: Projectile): boolean {
  const now = Date.now();
  const age = now - projectile.createdAt;

  // Check lifetime
  if (age >= projectile.maxLifetime) {
    return true;
  }

  // Check bounds
  if (
    projectile.position.x < -PROJECTILE_SIZE ||
    projectile.position.x > MAP_WIDTH + PROJECTILE_SIZE ||
    projectile.position.y < -PROJECTILE_SIZE ||
    projectile.position.y > MAP_HEIGHT + PROJECTILE_SIZE
  ) {
    return true;
  }

  return false;
}

export function getProjectileBoundingBox(projectile: Projectile) {
  return {
    x: projectile.position.x - PROJECTILE_SIZE / 2,
    y: projectile.position.y - PROJECTILE_SIZE / 2,
    width: PROJECTILE_SIZE,
    height: PROJECTILE_SIZE,
  };
}

export function shouldProjectileExplode(projectile: Projectile): boolean {
  const definition = WEAPON_DEFINITIONS[projectile.weaponType];
  return definition.explosive;
}

export function getProjectileExplosionRadius(projectile: Projectile): number {
  const definition = WEAPON_DEFINITIONS[projectile.weaponType];
  return definition.explosionRadius;
}
