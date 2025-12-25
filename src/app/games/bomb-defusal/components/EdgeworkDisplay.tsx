"use client";

import { Edgework, PortType } from "../types";
import { Battery, Circle, Usb } from "lucide-react";

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
    <div className="bg-gray-800 rounded-lg p-3 text-sm">
      <h4 className="text-gray-400 font-bold mb-3 text-xs uppercase tracking-wide">
        Bomb Info
      </h4>

      {/* Serial Number */}
      <div className="mb-3">
        <p className="text-gray-500 text-xs mb-1">Serial Number</p>
        <p className="text-white font-mono font-bold text-lg tracking-wider">
          {edgework.serialNumber.value}
        </p>
      </div>

      {/* Batteries */}
      <div className="mb-3 flex items-center gap-2">
        <Battery className="text-gray-400 w-4 h-4" />
        <span className="text-gray-500 text-xs">Batteries:</span>
        <span className="text-white font-bold">{edgework.batteries}</span>
      </div>

      {/* Indicators */}
      {edgework.indicators.length > 0 && (
        <div className="mb-3">
          <p className="text-gray-500 text-xs mb-1">Indicators</p>
          <div className="flex flex-wrap gap-2">
            {edgework.indicators.map((ind, i) => (
              <div
                key={i}
                className={`
                  px-2 py-1 rounded text-xs font-mono font-bold
                  ${ind.lit ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500" : "bg-gray-700 text-gray-400"}
                `}
              >
                {ind.lit && <Circle className="inline w-2 h-2 mr-1 fill-current" />}
                {ind.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ports */}
      {edgework.ports.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs mb-1">Ports</p>
          <div className="flex flex-wrap gap-2">
            {edgework.ports.map((port, i) => (
              <div
                key={i}
                className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
              >
                {PORT_LABELS[port]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
