import {
  GameState,
  Player,
  Enemy,
  Projectile,
  Placeable,
  PlayerNumber,
  BoundingBox,
  Vector2D,
} from "../types";
import {
  PLAYER_SIZE,
  ZOMBIE_SIZE,
  DEVIL_SIZE,
  ZOMBIE_DAMAGE,
  WEAPON_DEFINITIONS,
} from "../constants";
import { checkAABBCollision, checkCircleCollision } from "../utils/canvasHelpers";
import { distance } from "../utils/vector";
import { damagePlayer, addKill, getPlayerBoundingBox } from "./entities/player";
import { damageZombie, getZombieBoundingBox, canZombieAttack, zombieAttacked } from "./entities/zombie";
import { damageDevil, getDevilBoundingBox } from "./entities/devil";
import { getProjectileBoundingBox, shouldProjectileExplode, getProjectileExplosionRadius } from "./entities/projectile";

export interface CollisionResult {
  players: Map<PlayerNumber, Player>;
  enemies: Enemy[];
  projectiles: Projectile[];
  placeables: Placeable[];
  kills: number;
  scoreGained: number;
  explosions: Explosion[];
}

export interface Explosion {
  position: Vector2D;
  radius: number;
  damage: number;
  source: "player1" | "player2" | "devil" | "placeable";
  createdAt: number;
}

export function processCollisions(state: GameState): CollisionResult {
  let players = new Map(state.players);
  let enemies = [...state.enemies];
  let projectiles = [...state.projectiles];
  let placeables = [...state.placeables];
  let kills = 0;
  let scoreGained = 0;
  const explosions: Explosion[] = [];

  // 1. Process projectile-enemy collisions
  const projectileEnemyResult = processProjectileEnemyCollisions(
    projectiles,
    enemies
  );
  projectiles = projectileEnemyResult.projectiles;
  enemies = projectileEnemyResult.enemies;
  kills += projectileEnemyResult.kills;
  scoreGained += projectileEnemyResult.score;
  explosions.push(...projectileEnemyResult.explosions);

  // 2. Process projectile-player collisions (deathmatch or devil fireballs)
  const projectilePlayerResult = processProjectilePlayerCollisions(
    projectiles,
    players,
    state.mode
  );
  projectiles = projectilePlayerResult.projectiles;
  players = projectilePlayerResult.players;
  explosions.push(...projectilePlayerResult.explosions);

  // 3. Process enemy-player collisions (melee damage)
  const enemyPlayerResult = processEnemyPlayerCollisions(enemies, players);
  players = enemyPlayerResult.players;
  enemies = enemyPlayerResult.enemies;

  // 4. Process claymore proximity triggers
  const claymoreResult = processClaymoreProximity(placeables, enemies, players);
  placeables = claymoreResult.placeables;
  explosions.push(...claymoreResult.explosions);

  // 5. Process explosions damaging entities
  const explosionResult = processExplosionDamage(
    explosions,
    enemies,
    players,
    placeables
  );
  enemies = explosionResult.enemies;
  players = explosionResult.players;
  placeables = explosionResult.placeables;
  kills += explosionResult.kills;
  scoreGained += explosionResult.score;

  return {
    players,
    enemies,
    projectiles,
    placeables,
    kills,
    scoreGained,
    explosions,
  };
}

function processProjectileEnemyCollisions(
  projectiles: Projectile[],
  enemies: Enemy[]
): {
  projectiles: Projectile[];
  enemies: Enemy[];
  kills: number;
  score: number;
  explosions: Explosion[];
} {
  const remainingProjectiles: Projectile[] = [];
  let updatedEnemies = [...enemies];
  let kills = 0;
  let score = 0;
  const explosions: Explosion[] = [];

  for (const projectile of projectiles) {
    // Skip devil fireballs hitting enemies
    if (projectile.source === "devil") {
      remainingProjectiles.push(projectile);
      continue;
    }

    let projectileConsumed = false;
    const projectileBox = getProjectileBoundingBox(projectile);

    for (let i = 0; i < updatedEnemies.length; i++) {
      const enemy = updatedEnemies[i];
      if (!enemy.isAlive) continue;

      // Skip if piercing projectile already hit this enemy
      if (projectile.piercing && projectile.hitEntities.has(enemy.id)) {
        continue;
      }

      const enemyBox =
        enemy.type === "zombie"
          ? getZombieBoundingBox(enemy)
          : getDevilBoundingBox(enemy);

      if (checkAABBCollision(projectileBox, enemyBox)) {
        // Hit!
        const damaged =
          enemy.type === "zombie"
            ? damageZombie(enemy, projectile.damage)
            : damageDevil(enemy, projectile.damage);
        updatedEnemies[i] = damaged;

        if (!damaged.isAlive) {
          kills++;
          score += enemy.type === "zombie" ? 10 : 20;
        }

        // Handle explosive projectiles
        if (shouldProjectileExplode(projectile)) {
          explosions.push({
            position: { ...projectile.position },
            radius: getProjectileExplosionRadius(projectile),
            damage: projectile.damage,
            source: projectile.source,
            createdAt: Date.now(),
          });
          projectileConsumed = true;
          break;
        }

        if (projectile.piercing) {
          projectile.hitEntities.add(enemy.id);
        } else {
          projectileConsumed = true;
          break;
        }
      }
    }

    if (!projectileConsumed) {
      remainingProjectiles.push(projectile);
    }
  }

  return {
    projectiles: remainingProjectiles,
    enemies: updatedEnemies,
    kills,
    score,
    explosions,
  };
}

function processProjectilePlayerCollisions(
  projectiles: Projectile[],
  players: Map<PlayerNumber, Player>,
  mode: string
): {
  projectiles: Projectile[];
  players: Map<PlayerNumber, Player>;
  explosions: Explosion[];
} {
  const remainingProjectiles: Projectile[] = [];
  const updatedPlayers = new Map(players);
  const explosions: Explosion[] = [];

  for (const projectile of projectiles) {
    let projectileConsumed = false;
    const projectileBox = getProjectileBoundingBox(projectile);

    updatedPlayers.forEach((player, playerId) => {
      if (!player.isAlive || projectileConsumed) return;

      // In non-deathmatch modes, player projectiles don't hit their own team
      if (mode !== "deathmatch" && projectile.source !== "devil") {
        const sourcePlayerId = projectile.source === "player1" ? 1 : 2;
        if (sourcePlayerId === playerId) return;
      }

      // Devil fireballs hit all players
      // In deathmatch, player projectiles hit the other player
      const shouldCheck =
        projectile.source === "devil" ||
        (mode === "deathmatch" &&
          projectile.source !== `player${playerId}`);

      if (!shouldCheck) return;

      const playerBox = getPlayerBoundingBox(player);

      if (checkAABBCollision(projectileBox, playerBox)) {
        const damaged = damagePlayer(player, projectile.damage);
        updatedPlayers.set(playerId, damaged);

        if (shouldProjectileExplode(projectile)) {
          explosions.push({
            position: { ...projectile.position },
            radius: getProjectileExplosionRadius(projectile),
            damage: projectile.damage,
            source: projectile.source,
            createdAt: Date.now(),
          });
        }

        projectileConsumed = true;
      }
    });

    if (!projectileConsumed) {
      remainingProjectiles.push(projectile);
    }
  }

  return {
    projectiles: remainingProjectiles,
    players: updatedPlayers,
    explosions,
  };
}

function processEnemyPlayerCollisions(
  enemies: Enemy[],
  players: Map<PlayerNumber, Player>
): {
  enemies: Enemy[];
  players: Map<PlayerNumber, Player>;
} {
  const updatedEnemies = [...enemies];
  const updatedPlayers = new Map(players);

  for (let i = 0; i < updatedEnemies.length; i++) {
    const enemy = updatedEnemies[i];
    if (!enemy.isAlive || enemy.type !== "zombie") continue;

    const zombie = enemy;
    if (!canZombieAttack(zombie)) continue;

    const enemyBox = getZombieBoundingBox(zombie);

    updatedPlayers.forEach((player, playerId) => {
      if (!player.isAlive) return;

      const playerBox = getPlayerBoundingBox(player);

      if (checkAABBCollision(enemyBox, playerBox)) {
        const damaged = damagePlayer(player, ZOMBIE_DAMAGE);
        updatedPlayers.set(playerId, damaged);
        updatedEnemies[i] = zombieAttacked(zombie);
      }
    });
  }

  return {
    enemies: updatedEnemies,
    players: updatedPlayers,
  };
}

function processClaymoreProximity(
  placeables: Placeable[],
  enemies: Enemy[],
  players: Map<PlayerNumber, Player>
): {
  placeables: Placeable[];
  explosions: Explosion[];
} {
  const CLAYMORE_TRIGGER_DISTANCE = 40;
  const updatedPlaceables: Placeable[] = [];
  const explosions: Explosion[] = [];

  for (const placeable of placeables) {
    if (placeable.type !== "claymore" || placeable.state !== "active") {
      updatedPlaceables.push(placeable);
      continue;
    }

    let triggered = false;

    // Check enemies
    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;
      if (distance(placeable.position, enemy.position) < CLAYMORE_TRIGGER_DISTANCE) {
        triggered = true;
        break;
      }
    }

    if (triggered) {
      const definition = WEAPON_DEFINITIONS.claymore;
      explosions.push({
        position: { ...placeable.position },
        radius: definition.explosionRadius,
        damage: definition.damage,
        source: `player${placeable.owner}` as "player1" | "player2",
        createdAt: Date.now(),
      });
      // Don't add to updated list (destroyed)
    } else {
      updatedPlaceables.push(placeable);
    }
  }

  return {
    placeables: updatedPlaceables,
    explosions,
  };
}

function processExplosionDamage(
  explosions: Explosion[],
  enemies: Enemy[],
  players: Map<PlayerNumber, Player>,
  placeables: Placeable[]
): {
  enemies: Enemy[];
  players: Map<PlayerNumber, Player>;
  placeables: Placeable[];
  kills: number;
  score: number;
} {
  let updatedEnemies = [...enemies];
  const updatedPlayers = new Map(players);
  let updatedPlaceables = [...placeables];
  let kills = 0;
  let score = 0;

  for (const explosion of explosions) {
    // Damage enemies
    for (let i = 0; i < updatedEnemies.length; i++) {
      const enemy = updatedEnemies[i];
      if (!enemy.isAlive) continue;

      if (distance(explosion.position, enemy.position) <= explosion.radius) {
        const damaged =
          enemy.type === "zombie"
            ? damageZombie(enemy, explosion.damage)
            : damageDevil(enemy, explosion.damage);
        updatedEnemies[i] = damaged;

        if (!damaged.isAlive) {
          kills++;
          score += enemy.type === "zombie" ? 10 : 20;
        }
      }
    }

    // Damage players (if not their own explosion or in deathmatch)
    updatedPlayers.forEach((player, playerId) => {
      if (!player.isAlive) return;

      if (distance(explosion.position, player.position) <= explosion.radius) {
        // Players take reduced self-damage from their own explosions
        const isSelfDamage = explosion.source === `player${playerId}`;
        const damageMultiplier = isSelfDamage ? 0.5 : 1;
        const damaged = damagePlayer(player, explosion.damage * damageMultiplier);
        updatedPlayers.set(playerId, damaged);
      }
    });

    // Chain explosions from barrels
    const newExplosions: Explosion[] = [];
    updatedPlaceables = updatedPlaceables.filter((placeable) => {
      if (placeable.type === "fakeWall") return true; // Walls don't explode

      if (
        (placeable.type === "barrel" || placeable.type === "chargePack") &&
        placeable.state === "active"
      ) {
        if (distance(explosion.position, placeable.position) <= explosion.radius) {
          const definition = WEAPON_DEFINITIONS[placeable.type];
          newExplosions.push({
            position: { ...placeable.position },
            radius: definition.explosionRadius,
            damage: definition.damage,
            source: `player${placeable.owner}` as "player1" | "player2",
            createdAt: Date.now(),
          });
          return false; // Remove exploded placeable
        }
      }
      return true;
    });

    // Recursively process chain explosions
    if (newExplosions.length > 0) {
      const chainResult = processExplosionDamage(
        newExplosions,
        updatedEnemies,
        updatedPlayers,
        updatedPlaceables
      );
      updatedEnemies = chainResult.enemies;
      updatedPlaceables = chainResult.placeables;
      kills += chainResult.kills;
      score += chainResult.score;
    }
  }

  return {
    enemies: updatedEnemies,
    players: updatedPlayers,
    placeables: updatedPlaceables,
    kills,
    score,
  };
}
