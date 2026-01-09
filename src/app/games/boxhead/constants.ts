import { WeaponType, WeaponDefinition, Direction, Vector2D } from "./types";

// ============== CANVAS ==============

export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 600;
export const TICK_RATE = 16; // ~60fps

// ============== PLAYER ==============

export const PLAYER_SIZE = 32;
export const PLAYER_SPEED = 4;
export const PLAYER_MAX_HEALTH = 100;
export const HEALTH_REGEN_DELAY = 3000; // ms before regen starts
export const HEALTH_REGEN_RATE = 5; // health per second

// ============== ENEMIES ==============

export const ZOMBIE_SIZE = 28;
export const ZOMBIE_BASE_SPEED = 1.5;
export const ZOMBIE_BASE_HEALTH = 50;
export const ZOMBIE_DAMAGE = 10;
export const ZOMBIE_ATTACK_COOLDOWN = 1000; // ms

export const DEVIL_SIZE = 30;
export const DEVIL_BASE_SPEED = 3;
export const DEVIL_BASE_HEALTH = 80;
export const DEVIL_DAMAGE = 15;
export const DEVIL_FIRE_RATE = 2000; // ms between shots
export const DEVIL_MIN_DISTANCE = 100; // back away if closer
export const DEVIL_MAX_DISTANCE = 200; // approach if farther

export const FIREBALL_SPEED = 6;
export const FIREBALL_DAMAGE = 15;

// ============== COMBO ==============

export const COMBO_DECAY_DELAY = 2000; // ms before decay starts
export const COMBO_DECAY_RATE = 10; // combo per second

export const COMBO_MULTIPLIER_THRESHOLDS = [
  { combo: 0, multiplier: 1 },
  { combo: 10, multiplier: 2 },
  { combo: 25, multiplier: 3 },
  { combo: 50, multiplier: 4 },
  { combo: 100, multiplier: 5 },
];

// ============== WAVES ==============

export const WAVE_DELAY = 3000; // ms between waves
export const SPAWN_INTERVAL = 500; // ms between enemy spawns
export const BASE_ZOMBIES_PER_WAVE = 5;
export const ZOMBIES_INCREASE_PER_WAVE = 3;
export const DEVILS_START_WAVE = 3;
export const DEVILS_PER_WAVE = 1;
export const DEVILS_INCREASE_INTERVAL = 2; // add another devil every N waves

// ============== WEAPONS ==============

export const WEAPON_DEFINITIONS: Record<WeaponType, WeaponDefinition> = {
  pistol: {
    type: "pistol",
    name: "Pistol",
    damage: 20,
    fireRate: 400,
    ammo: "infinite",
    maxAmmo: "infinite",
    projectileSpeed: 12,
    spread: 0,
    projectileCount: 1,
    piercing: false,
    explosive: false,
    explosionRadius: 0,
    isPlaceable: false,
    unlockCombo: 0,
    icon: "🔫",
  },
  uzi: {
    type: "uzi",
    name: "Uzi",
    damage: 10,
    fireRate: 80,
    ammo: 100,
    maxAmmo: 200,
    projectileSpeed: 14,
    spread: 5,
    projectileCount: 1,
    piercing: false,
    explosive: false,
    explosionRadius: 0,
    isPlaceable: false,
    unlockCombo: 50,
    icon: "🔫",
  },
  shotgun: {
    type: "shotgun",
    name: "Shotgun",
    damage: 15,
    fireRate: 800,
    ammo: 20,
    maxAmmo: 50,
    projectileSpeed: 10,
    spread: 30,
    projectileCount: 5,
    piercing: false,
    explosive: false,
    explosionRadius: 0,
    isPlaceable: false,
    unlockCombo: 100,
    icon: "🔫",
  },
  barrel: {
    type: "barrel",
    name: "Barrel",
    damage: 100,
    fireRate: 500,
    ammo: 5,
    maxAmmo: 20,
    projectileSpeed: 0,
    spread: 0,
    projectileCount: 0,
    piercing: false,
    explosive: true,
    explosionRadius: 80,
    isPlaceable: true,
    unlockCombo: 150,
    icon: "🛢️",
  },
  grenade: {
    type: "grenade",
    name: "Grenade",
    damage: 80,
    fireRate: 1000,
    ammo: 10,
    maxAmmo: 30,
    projectileSpeed: 8,
    spread: 0,
    projectileCount: 1,
    piercing: false,
    explosive: true,
    explosionRadius: 60,
    isPlaceable: false,
    unlockCombo: 200,
    icon: "💣",
  },
  fakeWall: {
    type: "fakeWall",
    name: "Fake Wall",
    damage: 0,
    fireRate: 300,
    ammo: 10,
    maxAmmo: 30,
    projectileSpeed: 0,
    spread: 0,
    projectileCount: 0,
    piercing: false,
    explosive: false,
    explosionRadius: 0,
    isPlaceable: true,
    unlockCombo: 250,
    icon: "🧱",
  },
  claymore: {
    type: "claymore",
    name: "Claymore",
    damage: 120,
    fireRate: 400,
    ammo: 5,
    maxAmmo: 15,
    projectileSpeed: 0,
    spread: 0,
    projectileCount: 0,
    piercing: false,
    explosive: true,
    explosionRadius: 70,
    isPlaceable: true,
    unlockCombo: 300,
    icon: "💥",
  },
  rockets: {
    type: "rockets",
    name: "Rockets",
    damage: 150,
    fireRate: 1200,
    ammo: 8,
    maxAmmo: 20,
    projectileSpeed: 10,
    spread: 0,
    projectileCount: 1,
    piercing: false,
    explosive: true,
    explosionRadius: 70,
    isPlaceable: false,
    unlockCombo: 400,
    icon: "🚀",
  },
  chargePack: {
    type: "chargePack",
    name: "Charge Pack",
    damage: 200,
    fireRate: 600,
    ammo: 3,
    maxAmmo: 10,
    projectileSpeed: 0,
    spread: 0,
    projectileCount: 0,
    piercing: false,
    explosive: true,
    explosionRadius: 100,
    isPlaceable: true,
    unlockCombo: 450,
    icon: "📦",
  },
  railgun: {
    type: "railgun",
    name: "Railgun",
    damage: 200,
    fireRate: 1500,
    ammo: 5,
    maxAmmo: 10,
    projectileSpeed: 30,
    spread: 0,
    projectileCount: 1,
    piercing: true,
    explosive: false,
    explosionRadius: 0,
    isPlaceable: false,
    unlockCombo: 500,
    icon: "⚡",
  },
};

// Weapon unlock order
export const WEAPON_ORDER: WeaponType[] = [
  "pistol",
  "uzi",
  "shotgun",
  "barrel",
  "grenade",
  "fakeWall",
  "claymore",
  "rockets",
  "chargePack",
  "railgun",
];

// ============== DEATHMATCH ==============

export const DEATHMATCH_SCORE_LIMIT = 10;
export const RESPAWN_DELAY = 2000;

// ============== STORAGE ==============

export const HIGH_SCORES_KEY = "boxhead-high-scores";
export const CONFIG_KEY = "boxhead-config";

// ============== DIRECTION HELPERS ==============

export const DIRECTION_VECTORS: Record<Direction, Vector2D> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  "up-left": { x: -0.707, y: -0.707 },
  "up-right": { x: 0.707, y: -0.707 },
  "down-left": { x: -0.707, y: 0.707 },
  "down-right": { x: 0.707, y: 0.707 },
};

export const DIRECTION_ANGLES: Record<Direction, number> = {
  right: 0,
  "down-right": 45,
  down: 90,
  "down-left": 135,
  left: 180,
  "up-left": 225,
  up: 270,
  "up-right": 315,
};

// ============== COLORS ==============

export const COLORS = {
  background: "#1a1a2e",
  player1: "#4CAF50",
  player2: "#2196F3",
  zombie: "#8B4513",
  devil: "#FF4444",
  projectile: "#FFFF00",
  fireball: "#FF6600",
  explosion: "#FF8800",
  obstacle: "#444444",
  health: "#00FF00",
  healthBg: "#333333",
  combo: "#FFD700",
};

// ============== PROJECTILE ==============

export const PROJECTILE_SIZE = 6;
export const PROJECTILE_LIFETIME = 2000; // ms

// ============== EXPLOSION ==============

export const EXPLOSION_DURATION = 300; // ms
