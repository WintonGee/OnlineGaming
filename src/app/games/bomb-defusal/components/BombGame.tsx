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
import GameHeader from "@/components/games/GameHeader";
import { cn } from "@/lib/utils/cn";

export function BombGame() {
  const game = useBombGame();
  const [showManual, setShowManual] = useState(false);

  // Menu screen
  if (game.gamePhase === "menu") {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <GameHeader title="Bomb Defusal" />
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-300 dark:border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                <Bomb className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Defuse the bomb by solving all modules before time runs out!
            </p>

            {/* Difficulty selection */}
            <div className="mb-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-3">
                Select Difficulty
              </p>
              <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-200 dark:bg-gray-800 w-full justify-center">
                {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => game.setDifficulty(diff)}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-full transition-all flex-1",
                      game.difficulty === diff
                        ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs text-center mt-2">
                {DIFFICULTY_CONFIG[game.difficulty].moduleCount} modules |{" "}
                {Math.floor(DIFFICULTY_CONFIG[game.difficulty].timerSeconds / 60)}:00 |{" "}
                {DIFFICULTY_CONFIG[game.difficulty].maxStrikes} strikes
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Games Played</p>
                  <p className="text-black dark:text-white font-bold font-mono">
                    {game.stats.gamesPlayed}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Games Won</p>
                  <p className="text-black dark:text-white font-bold font-mono">
                    {game.stats.gamesWon}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Best Time</p>
                  <p className="text-black dark:text-white font-bold font-mono">
                    {game.stats.bestTime[game.difficulty] !== null
                      ? `${Math.floor(game.stats.bestTime[game.difficulty]! / 60)}:${(game.stats.bestTime[game.difficulty]! % 60).toString().padStart(2, "0")}`
                      : "--:--"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Win Rate</p>
                  <p className="text-black dark:text-white font-bold font-mono">
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
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-sm uppercase tracking-wide transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Start Defusing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game over screens
  if (game.gamePhase === "exploded" || game.gamePhase === "defused") {
    const isWin = game.gamePhase === "defused";
    return (
      <div className="min-h-screen bg-white dark:bg-black py-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <GameHeader title="Bomb Defusal" />
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-300 dark:border-gray-700 text-center">
            {isWin ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                    <Trophy className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-serif font-bold text-green-600 dark:text-green-400 mb-2">
                  Bomb Defused!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Time remaining: <span className="font-mono font-bold text-black dark:text-white">{game.formattedTime}</span>
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                    <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-serif font-bold text-red-600 dark:text-red-400 mb-2">
                  Boom!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  The bomb exploded. Better luck next time!
                </p>
              </>
            )}

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => game.startGame()}
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-sm uppercase tracking-wide transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
              <button
                onClick={() => game.returnToMenu()}
                className="px-6 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-full font-semibold text-sm uppercase tracking-wide transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  if (!game.bombState) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-4">
          <GameHeader title="Bomb Defusal" />
        </div>

        {/* Game info bar */}
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700 mb-4">
          {/* Timer */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
              Time
            </p>
            <p
              className={cn(
                "text-3xl font-mono font-bold",
                game.timeRemaining <= 30
                  ? "text-red-600 dark:text-red-400 animate-pulse"
                  : "text-black dark:text-white"
              )}
            >
              {game.formattedTime}
            </p>
          </div>

          {/* Strikes */}
          <div className="flex flex-col items-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
              Strikes
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: game.bombState.maxStrikes }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-colors",
                    i < game.bombState!.strikes
                      ? "bg-red-500 border-red-500"
                      : "border-gray-400 dark:border-gray-600"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Manual toggle */}
          <button
            onClick={() => setShowManual(!showManual)}
            className={cn(
              "px-4 py-2 rounded-full flex items-center gap-2 font-semibold text-sm transition-colors border-2",
              showManual
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                : "bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Manual
          </button>
        </div>

        <div className="flex gap-4">
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
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <ManualPanel />
            </div>
          )}
        </div>

        {/* Mobile manual (full width below game) */}
        {showManual && (
          <div className="mt-4 lg:hidden">
            <ManualPanel />
          </div>
        )}
      </div>
    </div>
  );
}
