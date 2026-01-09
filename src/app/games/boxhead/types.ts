// ============== BASIC TYPES ==============

export type GameMode = "single" | "coop" | "deathmatch";
export type PlayerNumber = 1 | 2;
export type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right";

// ============== VECTOR & POSITION ==============

export interface Vector2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============== WEAPONS ==============

export type WeaponType =
  | "pistol"
  | "uzi"
  | "shotgun"
  | "barrel"
  | "grenade"
  | "fakeWall"
  | "claymore"
  | "rockets"
  | "chargePack"
  | "railgun";

export interface WeaponDefinition {
  type: WeaponType;
  name: string;
  damage: number;
  fireRate: number; // ms between shots
  ammo: number | "infinite";
  maxAmmo: number | "infinite";
  projectileSpeed: number; // pixels per frame (0 for placeable)
  spread: number; // angle spread in degrees
  projectileCount: number; // number of projectiles per shot
  piercing: boolean; // railgun pierces enemies
  explosive: boolean; // causes explosion
  explosionRadius: number;
  isPlaceable: boolean; // barrel, claymore, charge pack, fake wall
  unlockCombo: number; // combo threshold to unlock
  icon: string;
}

export interface WeaponState {
  type: WeaponType;
  currentAmmo: number;
  lastFiredAt: number;
}

// ============== PROJECTILES ==============

export type ProjectileSource = "player1" | "player2" | "devil";

export interface Projectile {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  weaponType: WeaponType;
  source: ProjectileSource;
  damage: number;
  piercing: boolean;
  hitEntities: Set<string>;
  createdAt: number;
  maxLifetime: number;
}

// ============== PLACEABLE OBJECTS ==============

export type PlaceableType = "barrel" | "fakeWall" | "claymore" | "chargePack";
export type PlaceableState =
  | "active"
  | "triggered"
  | "exploding"
  | "destroyed";

export interface Placeable {
  id: string;
  type: PlaceableType;
  position: Vector2D;
  owner: PlayerNumber;
  state: PlaceableState;
  health: number;
  createdAt: number;
  triggeredAt?: number;
}

// ============== ENTITIES: PLAYER ==============

export interface Player {
  id: PlayerNumber;
  position: Vector2D;
  velocity: Vector2D;
  direction: Direction;
  health: number;
  maxHealth: number;
  isAlive: boolean;
  lastDamagedAt: number;
  weapons: Map<WeaponType, WeaponState>;
  unlockedWeapons: Set<WeaponType>;
  currentWeapon: WeaponType;
  isShooting: boolean;
  score: number;
  kills: number;
}

// ============== ENTITIES: ENEMIES ==============

export type EnemyType = "zombie" | "devil";

export interface BaseEnemy {
  id: string;
  type: EnemyType;
  position: Vector2D;
  velocity: Vector2D;
  health: number;
  maxHealth: number;
  isAlive: boolean;
  targetPlayerId: PlayerNumber | null;
  lastActionAt: number;
}

export interface Zombie extends BaseEnemy {
  type: "zombie";
  speed: number;
  damage: number;
}

export interface Devil extends BaseEnemy {
  type: "devil";
  speed: number;
  damage: number;
  fireRate: number;
  lastFiredAt: number;
}

export type Enemy = Zombie | Devil;

// ============== MAP ==============

export interface Obstacle {
  id: string;
  bounds: BoundingBox;
  destructible: boolean;
  health?: number;
}

export interface SpawnPoint {
  position: Vector2D;
  type: "player" | "enemy";
}

export interface GameMap {
  width: number;
  height: number;
  obstacles: Obstacle[];
  playerSpawns: SpawnPoint[];
  enemySpawns: SpawnPoint[];
}

// ============== COMBO SYSTEM ==============

export interface ComboState {
  currentCombo: number;
  multiplier: number;
  lastKillAt: number;
  decayRate: number;
  highestCombo: number;
}

// ============== WAVE SYSTEM ==============

export interface WaveConfig {
  waveNumber: number;
  zombieCount: number;
  devilCount: number;
  zombieHealth: number;
  devilHealth: number;
  zombieSpeed: number;
  devilSpeed: number;
  spawnDelay: number;
}

export interface WaveState {
  currentWave: number;
  enemiesRemaining: number;
  enemiesSpawned: number;
  totalEnemies: number;
  isSpawning: boolean;
  waveStartedAt: number;
  nextSpawnAt: number;
  betweenWaves: boolean;
  betweenWaveTimer: number;
}

// ============== GAME STATE ==============

export type GamePhase = "menu" | "playing" | "paused" | "gameOver" | "victory";

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  players: Map<PlayerNumber, Player>;
  enemies: Enemy[];
  projectiles: Projectile[];
  placeables: Placeable[];
  combo: ComboState;
  wave: WaveState;
  map: GameMap;
  gameStartedAt: number;
  lastTickAt: number;
  tickCount: number;
  totalKills: number;
  totalScore: number;
  deathmatchScoreLimit?: number;
  deathmatchWinner?: PlayerNumber;
}

// ============== INPUT ==============

export interface PlayerInput {
  moveUp: boolean;
  moveDown: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  shoot: boolean;
  cycleWeaponNext: boolean;
  cycleWeaponPrev: boolean;
  activateChargePack: boolean;
}

export interface InputState {
  player1: PlayerInput;
  player2: PlayerInput;
}

// ============== SAVED STATE ==============

export interface HighScores {
  single: number;
  coop: number;
  deathmatch: {
    player1Wins: number;
    player2Wins: number;
  };
}

export interface SavedGameConfig {
  highScores: HighScores;
  lastMode: GameMode;
}
