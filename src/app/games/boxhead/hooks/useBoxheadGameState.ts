"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  GameState,
  GameMode,
  GamePhase,
  Player,
  PlayerNumber,
  Enemy,
  Projectile,
  Placeable,
  InputState,
  HighScores,
} from "../types";
import { TICK_RATE, HIGH_SCORES_KEY } from "../constants";
import { createStorage } from "@/lib/utils/storage";
import { createDefaultMap, getPlayerSpawn } from "../logic/map";
import { createPlayer, updatePlayer, unlockWeapon } from "../logic/entities/player";
import { updateZombie } from "../logic/entities/zombie";
import { updateDevil, DevilUpdateResult } from "../logic/entities/devil";
import { updateProjectile, isProjectileExpired } from "../logic/entities/projectile";
import { processCollisions, Explosion } from "../logic/collision";
import { createInitialWaveState, updateWaveSpawning } from "../logic/spawning";
import {
  createInitialComboState,
  addToCombo,
  updateComboDecay,
  checkWeaponUnlocks,
} from "../logic/combo";
import { fireWeapon } from "../logic/weapons";

const highScoresStorage = createStorage<HighScores>(HIGH_SCORES_KEY);

function createInitialHighScores(): HighScores {
  return {
    single: 0,
    coop: 0,
    deathmatch: {
      player1Wins: 0,
      player2Wins: 0,
    },
  };
}

function createInitialGameState(mode: GameMode): GameState {
  const map = createDefaultMap();
  const players = new Map<PlayerNumber, Player>();

  players.set(1, createPlayer(1, getPlayerSpawn(map, 1)));
  if (mode !== "single") {
    players.set(2, createPlayer(2, getPlayerSpawn(map, 2)));
  }

  return {
    phase: "menu",
    mode,
    players,
    enemies: [],
    projectiles: [],
    placeables: [],
    combo: createInitialComboState(),
    wave: createInitialWaveState(),
    map,
    gameStartedAt: 0,
    lastTickAt: Date.now(),
    tickCount: 0,
    totalKills: 0,
    totalScore: 0,
    deathmatchScoreLimit: 10,
  };
}

export function useBoxheadGameState() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState("single")
  );
  const [highScores, setHighScores] = useState<HighScores>(
    createInitialHighScores
  );
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const inputStateRef = useRef<InputState>({
    player1: {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
      shoot: false,
      cycleWeaponNext: false,
      cycleWeaponPrev: false,
      activateChargePack: false,
    },
    player2: {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
      shoot: false,
      cycleWeaponNext: false,
      cycleWeaponPrev: false,
      activateChargePack: false,
    },
  });
  const hasInitialized = useRef(false);

  // Load high scores on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const saved = highScoresStorage.load();
    if (saved) {
      setHighScores(saved);
    }
  }, []);

  // Update input ref
  const updateInput = useCallback((input: InputState) => {
    inputStateRef.current = input;
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameState.phase !== "playing") {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const lastTickTime = { value: Date.now() };

    gameLoopRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTickTime.value;
      lastTickTime.value = now;

      setGameState((prev) => {
        if (prev.phase !== "playing") return prev;

        const input = inputStateRef.current;
        let state = { ...prev };

        // 1. Update players
        const updatedPlayers = new Map(state.players);
        let allProjectiles = [...state.projectiles];
        let allPlaceables = [...state.placeables];

        updatedPlayers.forEach((player, playerId) => {
          const playerInput =
            playerId === 1 ? input.player1 : input.player2;

          // Update player movement
          let updatedPlayer = updatePlayer(
            player,
            playerInput,
            deltaTime,
            state.map.obstacles
          );

          // Handle shooting
          if (updatedPlayer.isShooting && updatedPlayer.isAlive) {
            const fireResult = fireWeapon(updatedPlayer);
            if (fireResult.canFire) {
              allProjectiles.push(...fireResult.projectiles);
              if (fireResult.placeable) {
                allPlaceables.push(fireResult.placeable);
              }
              // Update weapon state
              updatedPlayer = {
                ...updatedPlayer,
                weapons: new Map(updatedPlayer.weapons).set(
                  updatedPlayer.currentWeapon,
                  fireResult.updatedWeapon
                ),
              };
            }
          }

          updatedPlayers.set(playerId, updatedPlayer);
        });

        state.players = updatedPlayers;
        state.projectiles = allProjectiles;
        state.placeables = allPlaceables;

        // 2. Update projectiles
        state.projectiles = state.projectiles
          .map((p) => updateProjectile(p, deltaTime))
          .filter((p) => !isProjectileExpired(p));

        // 3. Update enemies
        const updatedEnemies: Enemy[] = [];
        const newDevilProjectiles: Projectile[] = [];

        for (const enemy of state.enemies) {
          if (enemy.type === "zombie") {
            updatedEnemies.push(
              updateZombie(enemy, state.players, deltaTime, state.map.obstacles)
            );
          } else {
            const result: DevilUpdateResult = updateDevil(
              enemy,
              state.players,
              deltaTime,
              state.map.obstacles
            );
            updatedEnemies.push(result.devil);
            if (result.projectile) {
              newDevilProjectiles.push(result.projectile);
            }
          }
        }

        state.enemies = updatedEnemies;
        state.projectiles = [...state.projectiles, ...newDevilProjectiles];

        // 4. Process collisions
        const collisionResult = processCollisions(state);
        state.players = collisionResult.players;
        state.enemies = collisionResult.enemies;
        state.projectiles = collisionResult.projectiles;
        state.placeables = collisionResult.placeables;

        // Update explosions for rendering
        if (collisionResult.explosions.length > 0) {
          setExplosions((prev) => [...prev, ...collisionResult.explosions]);
        }

        // 5. Update combo
        if (collisionResult.kills > 0) {
          state.combo = addToCombo(state.combo, collisionResult.kills);
          state.totalKills += collisionResult.kills;
          state.totalScore += collisionResult.scoreGained * state.combo.multiplier;

          // Update wave enemies remaining
          state.wave = {
            ...state.wave,
            enemiesRemaining: state.wave.enemiesRemaining - collisionResult.kills,
          };

          // Check for weapon unlocks
          state.players.forEach((player, playerId) => {
            const unlocks = checkWeaponUnlocks(
              state.combo.currentCombo,
              player.unlockedWeapons
            );
            let updatedPlayer = player;
            for (const weaponType of unlocks) {
              updatedPlayer = unlockWeapon(updatedPlayer, weaponType);
            }
            if (unlocks.length > 0) {
              state.players.set(playerId, updatedPlayer);
            }
          });
        }

        state.combo = updateComboDecay(state.combo, deltaTime);

        // 6. Update wave spawning
        const waveResult = updateWaveSpawning(
          state.wave,
          state.enemies,
          state.map
        );
        state.wave = waveResult.waveState;
        if (waveResult.newEnemy) {
          state.enemies = [...state.enemies, waveResult.newEnemy];
        }

        // 7. Check game over conditions
        if (state.mode !== "deathmatch") {
          // In coop/single, game over when all players are dead
          const anyAlive = Array.from(state.players.values()).some(
            (p) => p.isAlive
          );
          if (!anyAlive) {
            state.phase = "gameOver";
          }
        } else {
          // In deathmatch, check for winner
          state.players.forEach((player, playerId) => {
            if (player.kills >= (state.deathmatchScoreLimit || 10)) {
              state.phase = "gameOver";
              state.deathmatchWinner = playerId;
            }
          });
        }

        return {
          ...state,
          lastTickAt: now,
          tickCount: state.tickCount + 1,
        };
      });

      // Clean up old explosions
      setExplosions((prev) =>
        prev.filter((e) => Date.now() - e.createdAt < 300)
      );
    }, TICK_RATE);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.phase]);

  // Start game
  const startGame = useCallback((mode: GameMode) => {
    const newState = createInitialGameState(mode);
    setGameState({
      ...newState,
      phase: "playing",
      gameStartedAt: Date.now(),
    });
    setExplosions([]);
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: prev.phase === "playing" ? "paused" : prev.phase,
    }));
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: prev.phase === "paused" ? "playing" : prev.phase,
    }));
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase === "playing") {
        return { ...prev, phase: "paused" };
      } else if (prev.phase === "paused") {
        return { ...prev, phase: "playing" };
      }
      return prev;
    });
  }, []);

  // Return to menu
  const returnToMenu = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: "menu",
    }));
  }, []);

  // Save high score
  const saveHighScore = useCallback(
    (score: number, mode: GameMode) => {
      setHighScores((prev) => {
        let updated = { ...prev };

        if (mode === "single" && score > prev.single) {
          updated.single = score;
        } else if (mode === "coop" && score > prev.coop) {
          updated.coop = score;
        }

        highScoresStorage.save(updated);
        return updated;
      });
    },
    []
  );

  return {
    gameState,
    highScores,
    explosions,
    updateInput,
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    returnToMenu,
    saveHighScore,
  };
}
