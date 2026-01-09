import { WaveState, WaveConfig, Enemy, GameMap } from "../types";
import {
  BASE_ZOMBIES_PER_WAVE,
  ZOMBIES_INCREASE_PER_WAVE,
  DEVILS_START_WAVE,
  DEVILS_PER_WAVE,
  DEVILS_INCREASE_INTERVAL,
  WAVE_DELAY,
  SPAWN_INTERVAL,
} from "../constants";
import { createZombie } from "./entities/zombie";
import { createDevil } from "./entities/devil";
import { getRandomEnemySpawn } from "./map";

export function createInitialWaveState(): WaveState {
  return {
    currentWave: 0,
    enemiesRemaining: 0,
    enemiesSpawned: 0,
    totalEnemies: 0,
    isSpawning: false,
    waveStartedAt: 0,
    nextSpawnAt: 0,
    betweenWaves: true,
    betweenWaveTimer: Date.now() + WAVE_DELAY,
  };
}

export function calculateWaveConfig(waveNumber: number): WaveConfig {
  const zombieCount =
    BASE_ZOMBIES_PER_WAVE + (waveNumber - 1) * ZOMBIES_INCREASE_PER_WAVE;

  let devilCount = 0;
  if (waveNumber >= DEVILS_START_WAVE) {
    const wavesWithDevils = waveNumber - DEVILS_START_WAVE + 1;
    devilCount =
      DEVILS_PER_WAVE +
      Math.floor(wavesWithDevils / DEVILS_INCREASE_INTERVAL);
  }

  // Scale enemy stats with wave number
  const healthMultiplier = 1 + (waveNumber - 1) * 0.1;
  const speedMultiplier = 1 + (waveNumber - 1) * 0.02;

  return {
    waveNumber,
    zombieCount,
    devilCount,
    zombieHealth: 50 * healthMultiplier,
    devilHealth: 80 * healthMultiplier,
    zombieSpeed: 1.5 * speedMultiplier,
    devilSpeed: 3 * speedMultiplier,
    spawnDelay: Math.max(200, SPAWN_INTERVAL - waveNumber * 10),
  };
}

export function startNextWave(waveState: WaveState): WaveState {
  const nextWave = waveState.currentWave + 1;
  const config = calculateWaveConfig(nextWave);
  const totalEnemies = config.zombieCount + config.devilCount;

  return {
    currentWave: nextWave,
    enemiesRemaining: totalEnemies,
    enemiesSpawned: 0,
    totalEnemies,
    isSpawning: true,
    waveStartedAt: Date.now(),
    nextSpawnAt: Date.now(),
    betweenWaves: false,
    betweenWaveTimer: 0,
  };
}

export function updateWaveSpawning(
  waveState: WaveState,
  currentEnemies: Enemy[],
  map: GameMap
): { waveState: WaveState; newEnemy: Enemy | null } {
  const now = Date.now();

  // Between waves
  if (waveState.betweenWaves) {
    if (now >= waveState.betweenWaveTimer) {
      return {
        waveState: startNextWave(waveState),
        newEnemy: null,
      };
    }
    return { waveState, newEnemy: null };
  }

  // Check if wave is complete (all enemies spawned and killed)
  const aliveEnemies = currentEnemies.filter((e) => e.isAlive).length;
  if (
    waveState.enemiesSpawned >= waveState.totalEnemies &&
    aliveEnemies === 0
  ) {
    return {
      waveState: {
        ...waveState,
        betweenWaves: true,
        betweenWaveTimer: now + WAVE_DELAY,
        isSpawning: false,
      },
      newEnemy: null,
    };
  }

  // Spawn next enemy if it's time
  if (
    waveState.isSpawning &&
    waveState.enemiesSpawned < waveState.totalEnemies &&
    now >= waveState.nextSpawnAt
  ) {
    const config = calculateWaveConfig(waveState.currentWave);
    const spawnPosition = getRandomEnemySpawn(map);

    // Determine what to spawn
    // Spawn zombies first, then devils
    let newEnemy: Enemy;
    if (waveState.enemiesSpawned < config.zombieCount) {
      newEnemy = createZombie(spawnPosition, waveState.currentWave);
    } else {
      newEnemy = createDevil(spawnPosition, waveState.currentWave);
    }

    return {
      waveState: {
        ...waveState,
        enemiesSpawned: waveState.enemiesSpawned + 1,
        nextSpawnAt: now + config.spawnDelay,
      },
      newEnemy,
    };
  }

  return { waveState, newEnemy: null };
}

export function getWaveProgress(waveState: WaveState): {
  current: number;
  total: number;
  percentage: number;
} {
  const killed = waveState.totalEnemies - waveState.enemiesRemaining;
  const percentage =
    waveState.totalEnemies > 0
      ? (killed / waveState.totalEnemies) * 100
      : 0;

  return {
    current: killed,
    total: waveState.totalEnemies,
    percentage,
  };
}
