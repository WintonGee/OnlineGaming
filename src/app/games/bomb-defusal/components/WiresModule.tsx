"use client";

import { WiresModuleState, WireColor } from "../types";
import { cn } from "@/lib/utils/cn";

const WIRE_COLORS: Record<WireColor, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  white: "bg-white border border-gray-400",
  black: "bg-gray-900 dark:bg-gray-950",
};

interface WiresModuleProps {
  module: WiresModuleState;
  onCutWire: (wireIndex: number) => void;
  disabled: boolean;
}

export function WiresModule({ module, onCutWire, disabled }: WiresModuleProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <h3 className="text-black dark:text-white text-center font-semibold text-sm uppercase tracking-wide mb-4">
        Wires
      </h3>

      <div className="relative bg-gray-200 dark:bg-gray-800 rounded-lg p-4 min-h-[180px]">
        {/* Wire slots */}
        <div className="flex flex-col gap-3">
          {module.wires.map((wire, index) => (
            <div key={index} className="relative flex items-center">
              {/* Left connector */}
              <div className="w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded-full border-2 border-gray-500 dark:border-gray-500" />

              {/* Wire */}
              <button
                onClick={() => !wire.cut && !disabled && onCutWire(index)}
                disabled={wire.cut || disabled}
                className={cn(
                  "flex-1 h-4 mx-1 rounded-sm transition-all relative",
                  WIRE_COLORS[wire.color],
                  wire.cut
                    ? "opacity-30 cursor-not-allowed"
                    : "cursor-pointer hover:brightness-110",
                  !wire.cut && !disabled && "hover:scale-y-125"
                )}
              >
                {wire.cut && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-800 dark:bg-gray-200 transform rotate-12" />
                  </div>
                )}
              </button>

              {/* Right connector */}
              <div className="w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded-full border-2 border-gray-500 dark:border-gray-500" />
            </div>
          ))}
        </div>
      </div>

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
