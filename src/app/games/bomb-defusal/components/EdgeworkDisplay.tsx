"use client";

import { Edgework, PortType } from "../types";
import { Battery, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PORT_LABELS: Record<PortType, string> = {
  "DVI-D": "DVI-D",
  "Parallel": "Parallel",
  "PS/2": "PS/2",
  "RJ-45": "RJ-45",
  "Serial": "Serial",
  "Stereo RCA": "Stereo RCA",
};

interface EdgeworkDisplayProps {
  edgework: Edgework;
}

export function EdgeworkDisplay({ edgework }: EdgeworkDisplayProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
      <h4 className="text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase tracking-wide mb-3">
        Bomb Info
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Serial Number */}
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Serial Number</p>
          <p className="text-black dark:text-white font-mono font-bold text-lg tracking-wider">
            {edgework.serialNumber.value}
          </p>
        </div>

        {/* Batteries */}
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Batteries</p>
          <div className="flex items-center gap-2">
            <Battery className="text-gray-500 dark:text-gray-400 w-4 h-4" />
            <span className="text-black dark:text-white font-bold font-mono">
              {edgework.batteries}
            </span>
          </div>
        </div>

        {/* Indicators */}
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Indicators</p>
          {edgework.indicators.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {edgework.indicators.map((ind, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-mono font-bold",
                    ind.lit
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-400 dark:border-yellow-600"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  )}
                >
                  {ind.lit && <Circle className="inline w-2 h-2 mr-1 fill-current" />}
                  {ind.label}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">None</span>
          )}
        </div>

        {/* Ports */}
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Ports</p>
          {edgework.ports.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {edgework.ports.map((port, i) => (
                <div
                  key={i}
                  className="px-2 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300"
                >
                  {PORT_LABELS[port]}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">None</span>
          )}
        </div>
      </div>
    </div>
  );
}
