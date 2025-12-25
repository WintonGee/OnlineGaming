"use client";

import { useBombGame } from "../hooks/useBombGame";
import { WiresModule } from "./WiresModule";
import { ButtonModule } from "./ButtonModule";
import { SimonSaysModule } from "./SimonSaysModule";
import { MemoryModule } from "./MemoryModule";
import { PasswordModule } from "./PasswordModule";
import { MorseCodeModule } from "./MorseCodeModule";
import { EdgeworkDisplay } from "./EdgeworkDisplay";
import { ManualPanel } from "./ManualPanel";
import { Difficulty } from "../types";
import { DIFFICULTY_CONFIG } from "../constants";
import { Bomb, AlertTriangle, Trophy, RotateCcw, BookOpen } from "lucide-react";
import { useState } from "react";

export function BombGame() {
  const game = useBombGame();
  const [showManual, setShowManual] = useState(false);

  // Menu screen
  if (game.gamePhase === "menu") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
          <Bomb className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-3xl font-bold text-white mb-2">Bomb Defusal</h1>
          <p className="text-gray-400 mb-6">
            Defuse the bomb by solving all modules before time runs out!
          </p>

          {/* Difficulty selection */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">Select Difficulty</p>
            <div className="flex gap-2 justify-center">
              {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => game.setDifficulty(diff)}
                  className={`
                    px-4 py-2 rounded-lg font-medium capitalize transition-colors
                    ${game.difficulty === diff
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }
                  `}
                >
                  {diff}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {DIFFICULTY_CONFIG[game.difficulty].moduleCount} modules |{" "}
              {Math.floor(DIFFICULTY_CONFIG[game.difficulty].timerSeconds / 60)}:00 |{" "}
              {DIFFICULTY_CONFIG[game.difficulty].maxStrikes} strikes allowed
            </p>
          </div>

          {/* Stats */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-sm">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-gray-400">Games Played</p>
                <p className="text-white font-bold">{game.stats.gamesPlayed}</p>
              </div>
              <div>
                <p className="text-gray-400">Games Won</p>
                <p className="text-white font-bold">{game.stats.gamesWon}</p>
              </div>
              <div>
                <p className="text-gray-400">Best Time ({game.difficulty})</p>
                <p className="text-white font-bold">
                  {game.stats.bestTime[game.difficulty] !== null
                    ? `${Math.floor(game.stats.bestTime[game.difficulty]! / 60)}:${(game.stats.bestTime[game.difficulty]! % 60).toString().padStart(2, "0")}`
                    : "--:--"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Win Rate</p>
                <p className="text-white font-bold">
                  {game.stats.gamesPlayed > 0
                    ? `${Math.round((game.stats.gamesWon / game.stats.gamesPlayed) * 100)}%`
                    : "--%"}
                </p>
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => game.startGame()}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-lg transition-colors"
          >
            START DEFUSING
          </button>
        </div>
      </div>
    );
  }

  // Game over screens
  if (game.gamePhase === "exploded" || game.gamePhase === "defused") {
    const isWin = game.gamePhase === "defused";
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
          {isWin ? (
            <>
              <Trophy className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-3xl font-bold text-green-400 mb-2">BOMB DEFUSED!</h2>
              <p className="text-gray-400 mb-6">
                Time remaining: {game.formattedTime}
              </p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500 animate-pulse" />
              <h2 className="text-3xl font-bold text-red-400 mb-2">BOOM!</h2>
              <p className="text-gray-400 mb-6">
                The bomb exploded. Better luck next time!
              </p>
            </>
          )}

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => game.startGame()}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={() => game.returnToMenu()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  if (!game.bombState) return null;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
          {/* Timer */}
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">TIME</p>
            <p
              className={`text-4xl font-mono font-bold ${
                game.timeRemaining <= 30 ? "text-red-500 animate-pulse" : "text-white"
              }`}
            >
              {game.formattedTime}
            </p>
          </div>

          {/* Strikes */}
          <div className="flex items-center gap-2">
            {Array.from({ length: game.bombState.maxStrikes }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 ${
                  i < game.bombState!.strikes
                    ? "bg-red-500 border-red-500"
                    : "border-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Manual toggle */}
          <button
            onClick={() => setShowManual(!showManual)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${
              showManual ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Manual
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-4">
        {/* Main game area */}
        <div className="flex-1">
          {/* Edgework */}
          <div className="mb-4">
            <EdgeworkDisplay edgework={game.bombState.edgework} />
          </div>

          {/* Modules grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {game.bombState.modules.map((module) => {
              const isDisabled = game.gamePhase !== "playing" || module.status === "solved";

              switch (module.type) {
                case "wires":
                  return (
                    <WiresModule
                      key={module.id}
                      module={module}
                      onCutWire={(idx) => game.handleCutWire(module.id, idx)}
                      disabled={isDisabled}
                    />
                  );
                case "button":
                  return (
                    <ButtonModule
                      key={module.id}
                      module={module}
                      onPress={() => game.handleButtonPress(module.id)}
                      onRelease={() => game.handleButtonRelease(module.id)}
                      disabled={isDisabled}
                      currentTime={game.formattedTime}
                    />
                  );
                case "simon-says":
                  return (
                    <SimonSaysModule
                      key={module.id}
                      module={module}
                      onColorPress={(color) => game.handleSimonInput(module.id, color)}
                      onStartSequence={() => game.startSimonSequence(module.id)}
                      disabled={isDisabled}
                    />
                  );
                case "memory":
                  return (
                    <MemoryModule
                      key={module.id}
                      module={module}
                      onButtonPress={(pos) => game.handleMemoryPress(module.id, pos)}
                      disabled={isDisabled}
                    />
                  );
                case "password":
                  return (
                    <PasswordModule
                      key={module.id}
                      module={module}
                      onCycleUp={(col) => game.handlePasswordCycleUp(module.id, col)}
                      onCycleDown={(col) => game.handlePasswordCycleDown(module.id, col)}
                      onSubmit={() => game.handlePasswordSubmit(module.id)}
                      disabled={isDisabled}
                    />
                  );
                case "morse-code":
                  return (
                    <MorseCodeModule
                      key={module.id}
                      module={module}
                      isLightOn={game.morseIsOn}
                      onFrequencyUp={() => game.handleMorseFrequencyUp(module.id)}
                      onFrequencyDown={() => game.handleMorseFrequencyDown(module.id)}
                      onSubmit={() => game.handleMorseSubmit(module.id)}
                      disabled={isDisabled}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>

        {/* Manual panel (collapsible) */}
        {showManual && (
          <div className="w-80 flex-shrink-0">
            <ManualPanel />
          </div>
        )}
      </div>
    </div>
  );
}
