import {
  Player,
  Projectile,
  Placeable,
  WeaponType,
  WeaponState,
  PlayerNumber,
  Vector2D,
} from "../../types";
import { WEAPON_DEFINITIONS, WEAPON_ORDER } from "../../constants";
import { generateId, directionToVector, scale, add } from "../../utils/vector";
import { createProjectile, createGrenadeProjectile, createRocketProjectile } from "../entities/projectile";

export interface FireResult {
  projectiles: Projectile[];
  placeable: Placeable | null;
  updatedWeapon: WeaponState;
  canFire: boolean;
}

export function canFireWeapon(weapon: WeaponState): boolean {
  const definition = WEAPON_DEFINITIONS[weapon.type];
  const now = Date.now();
  const timeSinceLastFire = now - weapon.lastFiredAt;
  const hasAmmo =
    definition.ammo === "infinite" || weapon.currentAmmo > 0;
  return hasAmmo && timeSinceLastFire >= definition.fireRate;
}

export function fireWeapon(player: Player): FireResult {
  const weaponState = player.weapons.get(player.currentWeapon);
  if (!weaponState) {
    return {
      projectiles: [],
      placeable: null,
      updatedWeapon: {
        type: player.currentWeapon,
        currentAmmo: 0,
        lastFiredAt: 0,
      },
      canFire: false,
    };
  }

  if (!canFireWeapon(weaponState)) {
    return {
      projectiles: [],
      placeable: null,
      updatedWeapon: weaponState,
      canFire: false,
    };
  }

  const definition = WEAPON_DEFINITIONS[player.currentWeapon];
  const now = Date.now();

  // Handle placeable weapons
  if (definition.isPlaceable) {
    const placeable = createPlaceable(player);
    const updatedWeapon: WeaponState = {
      ...weaponState,
      currentAmmo:
        definition.ammo === "infinite"
          ? weaponState.currentAmmo
          : weaponState.currentAmmo - 1,
      lastFiredAt: now,
    };
    return {
      projectiles: [],
      placeable,
      updatedWeapon,
      canFire: true,
    };
  }

  // Handle projectile weapons
  let projectiles: Projectile[];

  switch (player.currentWeapon) {
    case "grenade":
      projectiles = [createGrenadeProjectile(player)];
      break;
    case "rockets":
      projectiles = [createRocketProjectile(player)];
      break;
    default:
      projectiles = createProjectile(player, player.currentWeapon);
  }

  const updatedWeapon: WeaponState = {
    ...weaponState,
    currentAmmo:
      definition.ammo === "infinite"
        ? weaponState.currentAmmo
        : weaponState.currentAmmo - 1,
    lastFiredAt: now,
  };

  return {
    projectiles,
    placeable: null,
    updatedWeapon,
    canFire: true,
  };
}

function createPlaceable(player: Player): Placeable {
  const definition = WEAPON_DEFINITIONS[player.currentWeapon];
  const direction = directionToVector(player.direction);
  const offset = scale(direction, 30); // Place in front of player
  const position = add(player.position, offset);

  return {
    id: generateId(),
    type: player.currentWeapon as "barrel" | "fakeWall" | "claymore" | "chargePack",
    position,
    owner: player.id,
    state: "active",
    health: player.currentWeapon === "fakeWall" ? 100 : 1,
    createdAt: Date.now(),
  };
}

export function addAmmo(
  weapons: Map<WeaponType, WeaponState>,
  weaponType: WeaponType,
  amount: number
): Map<WeaponType, WeaponState> {
  const weapon = weapons.get(weaponType);
  if (!weapon) return weapons;

  const definition = WEAPON_DEFINITIONS[weaponType];
  if (definition.maxAmmo === "infinite") return weapons;

  const newWeapons = new Map(weapons);
  newWeapons.set(weaponType, {
    ...weapon,
    currentAmmo: Math.min(definition.maxAmmo, weapon.currentAmmo + amount),
  });

  return newWeapons;
}

export function getWeaponDisplayName(weaponType: WeaponType): string {
  return WEAPON_DEFINITIONS[weaponType].name;
}

export function getWeaponIcon(weaponType: WeaponType): string {
  return WEAPON_DEFINITIONS[weaponType].icon;
}

export function getWeaponAmmoDisplay(
  weapons: Map<WeaponType, WeaponState>,
  currentWeapon: WeaponType
): string {
  const weapon = weapons.get(currentWeapon);
  if (!weapon) return "0";

  const definition = WEAPON_DEFINITIONS[currentWeapon];
  if (definition.ammo === "infinite") {
    return "∞";
  }

  return weapon.currentAmmo.toString();
}

export function activateChargePacks(
  placeables: Placeable[],
  owner: PlayerNumber
): { placeables: Placeable[]; explosions: Vector2D[] } {
  const updatedPlaceables: Placeable[] = [];
  const explosions: Vector2D[] = [];

  for (const placeable of placeables) {
    if (
      placeable.type === "chargePack" &&
      placeable.owner === owner &&
      placeable.state === "active"
    ) {
      explosions.push({ ...placeable.position });
      // Don't add to updated list (destroyed)
    } else {
      updatedPlaceables.push(placeable);
    }
  }

  return { placeables: updatedPlaceables, explosions };
}
