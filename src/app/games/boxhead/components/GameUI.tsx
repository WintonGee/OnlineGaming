"use client";

import { GameState, HighScores, Player } from "../types";
import { WEAPON_DEFINITIONS } from "../constants";
import { getComboProgress, formatCombo } from "../logic/combo";
import { getWeaponAmmoDisplay } from "../logic/weapons";

interface GameUIProps {
  gameState: GameState;
  highScores: HighScores;
}

export default function GameUI({ gameState, highScores }: GameUIProps) {
  const player1 = gameState.players.get(1);
  const player2 = gameState.players.get(2);

  const currentHighScore =
    gameState.mode === "single"
      ? highScores.single
      : gameState.mode === "coop"
      ? highScores.coop
      : 0;

  const comboProgress = player1
    ? getComboProgress(gameState.combo.currentCombo, player1.unlockedWeapons)
    : null;

  return (
    <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
      {/* Player 1 Status */}
      {player1 && (
        <PlayerStatus
          player={player1}
          label="P1 (Arrows + /)"
          color="text-green-500"
        />
      )}

      {/* Center Stats */}
      <div className="flex flex-col items-center gap-2">
        {/* Score */}
        <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400 uppercase">Score</div>
          <div className="text-2xl font-bold text-white font-mono">
            {gameState.totalScore.toLocaleString()}
          </div>
          {currentHighScore > 0 && (
            <div className="text-xs text-gray-500">
              Best: {currentHighScore.toLocaleString()}
            </div>
          )}
        </div>

        {/* Combo */}
        <div className="bg-gray-800 rounded-lg px-4 py-2 text-center min-w-[120px]">
          <div className="text-xs text-gray-400 uppercase">Combo</div>
          <div className="text-xl font-bold text-yellow-400 font-mono">
            {formatCombo(gameState.combo.currentCombo)}
            <span className="text-sm text-yellow-600 ml-1">
              x{gameState.combo.multiplier}
            </span>
          </div>
          {comboProgress && comboProgress.nextWeapon && (
            <div className="text-xs text-gray-500 mt-1">
              Next: {WEAPON_DEFINITIONS[comboProgress.nextWeapon].name} (
              {comboProgress.comboNeeded})
            </div>
          )}
        </div>

        {/* Wave */}
        <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400 uppercase">Wave</div>
          <div className="text-lg font-bold text-white">
            {gameState.wave.currentWave}
          </div>
          <div className="text-xs text-gray-500">
            {gameState.wave.enemiesRemaining} remaining
          </div>
        </div>
      </div>

      {/* Player 2 Status */}
      {player2 && (
        <PlayerStatus
          player={player2}
          label="P2 (WASD + Space)"
          color="text-blue-500"
        />
      )}
    </div>
  );
}

interface PlayerStatusProps {
  player: Player;
  label: string;
  color: string;
}

function PlayerStatus({ player, label, color }: PlayerStatusProps) {
  const weaponDef = WEAPON_DEFINITIONS[player.currentWeapon];
  const ammoDisplay = getWeaponAmmoDisplay(player.weapons, player.currentWeapon);

  return (
    <div className="bg-gray-800 rounded-lg p-3 min-w-[140px]">
      <div className={`text-xs font-medium ${color} mb-2`}>{label}</div>

      {/* Health */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>HP</span>
          <span>
            {Math.ceil(player.health)}/{player.maxHealth}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              player.health > 30 ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
          />
        </div>
      </div>

      {/* Weapon */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{weaponDef.icon}</span>
        <div>
          <div className="text-sm font-medium text-white">{weaponDef.name}</div>
          <div className="text-xs text-gray-400">Ammo: {ammoDisplay}</div>
        </div>
      </div>

      {/* Kills (for deathmatch) */}
      {player.kills > 0 && (
        <div className="mt-2 text-xs text-gray-400">
          Kills: <span className="text-white">{player.kills}</span>
        </div>
      )}
    </div>
  );
}
