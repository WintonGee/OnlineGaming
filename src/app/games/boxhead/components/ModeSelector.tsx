"use client";

import { GameMode, HighScores } from "../types";
import { Users, User, Swords } from "lucide-react";

interface ModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  highScores: HighScores;
  onShowInstructions: () => void;
}

export default function ModeSelector({
  onSelectMode,
  highScores,
  onShowInstructions,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <h2 className="text-3xl font-bold text-white mb-4">Select Game Mode</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {/* Single Player */}
        <button
          onClick={() => onSelectMode("single")}
          className="flex flex-col items-center gap-3 p-6 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border-2 border-transparent hover:border-green-500"
        >
          <User className="w-12 h-12 text-green-500" />
          <div className="text-lg font-bold text-white">Single Player</div>
          <div className="text-sm text-gray-400 text-center">
            Survive endless waves alone
          </div>
          {highScores.single > 0 && (
            <div className="text-xs text-gray-500">
              Best: {highScores.single.toLocaleString()}
            </div>
          )}
        </button>

        {/* Cooperative */}
        <button
          onClick={() => onSelectMode("coop")}
          className="flex flex-col items-center gap-3 p-6 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border-2 border-transparent hover:border-blue-500"
        >
          <Users className="w-12 h-12 text-blue-500" />
          <div className="text-lg font-bold text-white">Cooperative</div>
          <div className="text-sm text-gray-400 text-center">
            Team up against the horde
          </div>
          {highScores.coop > 0 && (
            <div className="text-xs text-gray-500">
              Best: {highScores.coop.toLocaleString()}
            </div>
          )}
        </button>

        {/* Deathmatch */}
        <button
          onClick={() => onSelectMode("deathmatch")}
          className="flex flex-col items-center gap-3 p-6 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border-2 border-transparent hover:border-red-500"
        >
          <Swords className="w-12 h-12 text-red-500" />
          <div className="text-lg font-bold text-white">Deathmatch</div>
          <div className="text-sm text-gray-400 text-center">
            Battle your friend
          </div>
          <div className="text-xs text-gray-500">First to 10 kills</div>
        </button>
      </div>

      {/* Controls Info */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-400 mb-2">Controls</div>
        <div className="flex flex-col sm:flex-row gap-4 text-xs text-gray-500">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-green-500 font-medium">P1:</span> Arrow keys +
            / to shoot + , . for weapons
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-blue-500 font-medium">P2:</span> WASD + Space
            to shoot + Q E for weapons
          </div>
        </div>
      </div>

      {/* How to Play */}
      <button
        onClick={onShowInstructions}
        className="mt-4 text-sm text-gray-400 hover:text-white underline"
      >
        How to Play
      </button>
    </div>
  );
}
