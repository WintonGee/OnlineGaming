"use client";

import { useState, useEffect, useCallback } from "react";
import { MorseCodeModuleState } from "../types";
import { formatFrequency } from "../utils/display";
import {
  MORSE_FREQUENCY_STEP,
  MORSE_FREQUENCY_MIN,
  MORSE_FREQUENCY_MAX,
} from "../constants";
import { cn } from "@/lib/utils/cn";
import { Volume2, VolumeX } from "lucide-react";

interface MorseCodeModuleProps {
  module: MorseCodeModuleState;
  isLightOn: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onFrequencyUp: () => void;
  onFrequencyDown: () => void;
  onFrequencySet: (frequency: number) => void;
  onSubmit: () => void;
  disabled: boolean;
}

const SPEED_OPTIONS = [
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "1x" },
];

// Audio context singleton for morse code beeps
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function MorseCodeModule({
  module,
  isLightOn,
  speed,
  onSpeedChange,
  onFrequencyUp,
  onFrequencyDown,
  onFrequencySet,
  onSubmit,
  disabled,
}: MorseCodeModuleProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [frequencyInput, setFrequencyInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Play continuous tone while light is on (real-time audio)
  useEffect(() => {
    if (!audioEnabled || !isLightOn) return;

    // Play continuous tone while light is on
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      oscillator = ctx.createOscillator();
      gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 600;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;

      oscillator.start();
    } catch {
      // Audio not available
    }

    return () => {
      if (oscillator) {
        try {
          oscillator.stop();
        } catch {
          // Already stopped
        }
      }
    };
  }, [isLightOn, audioEnabled]);

  const handleFrequencyInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFrequencyInput(e.target.value);
    },
    []
  );

  const handleFrequencyInputBlur = useCallback(() => {
    setIsEditing(false);
    const value = parseFloat(frequencyInput);
    if (!isNaN(value) && value >= MORSE_FREQUENCY_MIN && value <= MORSE_FREQUENCY_MAX) {
      onFrequencySet(value);
    }
    setFrequencyInput("");
  }, [frequencyInput, onFrequencySet]);

  const handleFrequencyInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleFrequencyInputBlur();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setFrequencyInput("");
      }
    },
    [handleFrequencyInputBlur]
  );

  const handleFrequencyClick = useCallback(() => {
    if (!disabled && module.status === "unsolved") {
      setIsEditing(true);
      setFrequencyInput(module.currentFrequency.toFixed(3));
    }
  }, [disabled, module.status, module.currentFrequency]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-black dark:text-white font-semibold text-sm uppercase tracking-wide">
          Morse Code
        </h3>
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          title={audioEnabled ? "Mute audio" : "Enable audio"}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          )}
        </button>
      </div>

      {/* Light indicator */}
      <div className="flex justify-center mb-4">
        <div
          className={cn(
            "w-8 h-8 rounded-full transition-all duration-75",
            isLightOn
              ? "bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.9)]"
              : "bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600"
          )}
        />
      </div>

      {/* Frequency display / input */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-3 mb-4 border border-gray-300 dark:border-gray-600">
        <p className="text-gray-500 dark:text-gray-400 text-xs text-center mb-2 uppercase tracking-wide">
          TX Frequency
        </p>
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              value={frequencyInput}
              onChange={handleFrequencyInputChange}
              onBlur={handleFrequencyInputBlur}
              onKeyDown={handleFrequencyInputKeyDown}
              autoFocus
              className="w-full text-xl font-mono font-bold text-center bg-white dark:bg-gray-900 text-black dark:text-white rounded px-2 py-1 border border-gray-400 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3.XXX"
            />
          ) : (
            <button
              onClick={handleFrequencyClick}
              disabled={disabled || module.status !== "unsolved"}
              className={cn(
                "text-xl font-mono font-bold text-black dark:text-white transition-colors",
                !disabled &&
                  module.status === "unsolved" &&
                  "hover:text-blue-600 dark:hover:text-blue-400 cursor-text"
              )}
              title="Click to type frequency"
            >
              {formatFrequency(module.currentFrequency)}
            </button>
          )}
        </div>
      </div>

      {/* Frequency controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onFrequencyDown}
          disabled={disabled || module.status !== "unsolved"}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium text-sm transition-colors",
            "bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
            "hover:bg-gray-300 dark:hover:bg-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          - {MORSE_FREQUENCY_STEP * 1000} kHz
        </button>
        <button
          onClick={onFrequencyUp}
          disabled={disabled || module.status !== "unsolved"}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium text-sm transition-colors",
            "bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
            "hover:bg-gray-300 dark:hover:bg-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          + {MORSE_FREQUENCY_STEP * 1000} kHz
        </button>
      </div>

      {/* Speed control */}
      <div className="mb-4">
        <p className="text-gray-500 dark:text-gray-400 text-xs text-center mb-2 uppercase tracking-wide">
          Playback Speed
        </p>
        <div className="flex gap-1">
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSpeedChange(option.value)}
              className={cn(
                "flex-1 py-1.5 rounded-lg font-medium text-xs transition-colors",
                speed === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={disabled || module.status !== "unsolved"}
        className={cn(
          "w-full py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-colors",
          "bg-black dark:bg-white text-white dark:text-black",
          "hover:bg-gray-800 dark:hover:bg-gray-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        TX
      </button>

      {module.status === "solved" && (
        <div className="mt-3 text-green-600 dark:text-green-400 text-center text-sm font-semibold uppercase tracking-wide">
          Defused
        </div>
      )}
      {module.status === "strike" && (
        <div className="mt-3 text-red-600 dark:text-red-400 text-center text-sm font-semibold uppercase tracking-wide">
          Strike!
        </div>
      )}
    </div>
  );
}
