import {
  Player,
  PlayerNumber,
  PlayerInput,
  Vector2D,
  Direction,
  WeaponType,
  WeaponState,
  Obstacle,
} from "../../types";
import {
  PLAYER_SIZE,
  PLAYER_SPEED,
  PLAYER_MAX_HEALTH,
  HEALTH_REGEN_DELAY,
  HEALTH_REGEN_RATE,
  WEAPON_ORDER,
} from "../../constants";
import { add, scale, normalize, vectorToDirection } from "../../utils/vector";
import {
  resolveObstacleCollision,
  clampToMapBounds,
} from "../map";

export function createPlayer(
  id: PlayerNumber,
  spawnPosition: Vector2D
): Player {
  const initialWeapon: WeaponState = {
    type: "pistol",
    currentAmmo: Infinity,
    lastFiredAt: 0,
  };

  return {
    id,
    position: { ...spawnPosition },
    velocity: { x: 0, y: 0 },
    direction: id === 1 ? "right" : "left",
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
    isAlive: true,
    lastDamagedAt: 0,
    weapons: new Map([["pistol", initialWeapon]]),
    unlockedWeapons: new Set(["pistol"]),
    currentWeapon: "pistol",
    isShooting: false,
    score: 0,
    kills: 0,
  };
}

export function updatePlayer(
  player: Player,
  input: PlayerInput,
  deltaTime: number,
  obstacles: Obstacle[]
): Player {
  if (!player.isAlive) return player;

  const now = Date.now();

  // Calculate velocity from input
  let vx = 0;
  let vy = 0;

  if (input.moveUp) vy -= 1;
  if (input.moveDown) vy += 1;
  if (input.moveLeft) vx -= 1;
  if (input.moveRight) vx += 1;

  // Normalize diagonal movement
  if (vx !== 0 && vy !== 0) {
    const factor = 1 / Math.sqrt(2);
    vx *= factor;
    vy *= factor;
  }

  // Apply speed
  const velocity = { x: vx * PLAYER_SPEED, y: vy * PLAYER_SPEED };

  // Calculate new position
  const movement = scale(velocity, deltaTime / 16);
  let newPosition = add(player.position, movement);

  // Resolve collisions with obstacles
  newPosition = resolveObstacleCollision(
    newPosition,
    player.position,
    PLAYER_SIZE,
    obstacles
  );

  // Clamp to map bounds
  newPosition = clampToMapBounds(newPosition, PLAYER_SIZE);

  // Update direction based on movement
  let direction = player.direction;
  if (vx !== 0 || vy !== 0) {
    direction = vectorToDirection(velocity);
  }

  // Health regeneration
  let health = player.health;
  const timeSinceDamage = now - player.lastDamagedAt;
  if (timeSinceDamage > HEALTH_REGEN_DELAY && health < player.maxHealth) {
    const regenAmount = HEALTH_REGEN_RATE * (deltaTime / 1000);
    health = Math.min(player.maxHealth, health + regenAmount);
  }

  // Handle weapon cycling
  let currentWeapon = player.currentWeapon;
  if (input.cycleWeaponNext || input.cycleWeaponPrev) {
    currentWeapon = cycleWeapon(
      player.currentWeapon,
      player.unlockedWeapons,
      input.cycleWeaponNext
    );
  }

  return {
    ...player,
    position: newPosition,
    velocity,
    direction,
    health,
    currentWeapon,
    isShooting: input.shoot,
  };
}

export function damagePlayer(player: Player, damage: number): Player {
  if (!player.isAlive) return player;

  const newHealth = Math.max(0, player.health - damage);
  return {
    ...player,
    health: newHealth,
    isAlive: newHealth > 0,
    lastDamagedAt: Date.now(),
  };
}

export function healPlayer(player: Player, amount: number): Player {
  if (!player.isAlive) return player;

  return {
    ...player,
    health: Math.min(player.maxHealth, player.health + amount),
  };
}

export function respawnPlayer(player: Player, spawnPosition: Vector2D): Player {
  return {
    ...player,
    position: { ...spawnPosition },
    velocity: { x: 0, y: 0 },
    health: player.maxHealth,
    isAlive: true,
    lastDamagedAt: 0,
    isShooting: false,
  };
}

export function addKill(player: Player, points: number): Player {
  return {
    ...player,
    kills: player.kills + 1,
    score: player.score + points,
  };
}

export function unlockWeapon(player: Player, weaponType: WeaponType): Player {
  if (player.unlockedWeapons.has(weaponType)) return player;

  const newUnlockedWeapons = new Set(player.unlockedWeapons);
  newUnlockedWeapons.add(weaponType);

  const newWeapons = new Map(player.weapons);
  // Initialize the new weapon with its default ammo
  const { WEAPON_DEFINITIONS } = require("../../constants");
  const definition = WEAPON_DEFINITIONS[weaponType];
  newWeapons.set(weaponType, {
    type: weaponType,
    currentAmmo: definition.ammo === "infinite" ? Infinity : definition.ammo,
    lastFiredAt: 0,
  });

  return {
    ...player,
    unlockedWeapons: newUnlockedWeapons,
    weapons: newWeapons,
    currentWeapon: weaponType, // Auto-switch to new weapon
  };
}

function cycleWeapon(
  current: WeaponType,
  unlocked: Set<WeaponType>,
  forward: boolean
): WeaponType {
  const unlockedList = WEAPON_ORDER.filter((w) => unlocked.has(w));
  if (unlockedList.length <= 1) return current;

  const currentIndex = unlockedList.indexOf(current);
  if (currentIndex === -1) return unlockedList[0];

  const delta = forward ? 1 : -1;
  const newIndex =
    (currentIndex + delta + unlockedList.length) % unlockedList.length;
  return unlockedList[newIndex];
}

export function getPlayerBoundingBox(player: Player) {
  return {
    x: player.position.x - PLAYER_SIZE / 2,
    y: player.position.y - PLAYER_SIZE / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
  };
}
