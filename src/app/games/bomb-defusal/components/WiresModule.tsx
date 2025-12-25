"use client";

import { WiresModuleState, WireColor } from "../types";

const WIRE_COLORS: Record<WireColor, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  white: "bg-white border border-gray-300",
  black: "bg-gray-900",
};

interface WiresModuleProps {
  module: WiresModuleState;
  onCutWire: (wireIndex: number) => void;
  disabled: boolean;
}

export function WiresModule({ module, onCutWire, disabled }: WiresModuleProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs">
      <h3 className="text-white text-center font-bold mb-4">WIRES</h3>

      <div className="relative bg-gray-700 rounded p-4 min-h-[200px]">
        {/* Wire slots */}
        <div className="flex flex-col gap-3">
          {module.wires.map((wire, index) => (
            <div key={index} className="relative flex items-center">
              {/* Left connector */}
              <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500" />

              {/* Wire */}
              <button
                onClick={() => !wire.cut && !disabled && onCutWire(index)}
                disabled={wire.cut || disabled}
                className={`
                  flex-1 h-4 mx-1 rounded-sm transition-all relative
                  ${WIRE_COLORS[wire.color]}
                  ${wire.cut ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:brightness-110"}
                  ${!wire.cut && !disabled ? "hover:scale-y-125" : ""}
                `}
              >
                {wire.cut && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-800 transform rotate-12" />
                  </div>
                )}
              </button>

              {/* Right connector */}
              <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500" />
            </div>
          ))}
        </div>
      </div>

      {module.status === "solved" && (
        <div className="mt-2 text-green-400 text-center text-sm font-bold">
          DEFUSED
        </div>
      )}
      {module.status === "strike" && (
        <div className="mt-2 text-red-400 text-center text-sm font-bold">
          STRIKE!
        </div>
      )}
    </div>
  );
}
