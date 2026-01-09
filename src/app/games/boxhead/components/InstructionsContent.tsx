"use client";

import { WEAPON_DEFINITIONS, WEAPON_ORDER } from "../constants";

export default function InstructionsContent() {
  return (
    <div className="space-y-6 text-sm">
      {/* Objective */}
      <section>
        <h3 className="font-bold text-lg mb-2">Objective</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Survive endless waves of zombies and devils! Kill enemies to build
          your combo and unlock new weapons. Work together in cooperative mode
          or battle your friend in deathmatch.
        </p>
      </section>

      {/* Controls */}
      <section>
        <h3 className="font-bold text-lg mb-2">Controls</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="font-medium text-green-600 dark:text-green-400 mb-2">
              Player 1
            </div>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  ↑↓←→
                </kbd>{" "}
                Move
              </li>
              <li>
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  /
                </kbd>{" "}
                Shoot
              </li>
              <li>
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  ,
                </kbd>{" "}
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  .
                </kbd>{" "}
                Cycle weapons
              </li>
            </ul>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="font-medium text-blue-600 dark:text-blue-400 mb-2">
              Player 2
            </div>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  WASD
                </kbd>{" "}
                Move
              </li>
              <li>
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  Space
                </kbd>{" "}
                Shoot
              </li>
              <li>
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  Q
                </kbd>{" "}
                <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                  E
                </kbd>{" "}
                Cycle weapons
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-2 text-gray-500 text-center">
          <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">P</kbd> to
          Pause
        </div>
      </section>

      {/* Enemies */}
      <section>
        <h3 className="font-bold text-lg mb-2">Enemies</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-800 rounded" />
            <div>
              <div className="font-medium">Zombie</div>
              <div className="text-xs text-gray-500">
                Slow, melee attack
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded" />
            <div>
              <div className="font-medium">Devil</div>
              <div className="text-xs text-gray-500">
                Fast, shoots fireballs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weapons */}
      <section>
        <h3 className="font-bold text-lg mb-2">Weapons</h3>
        <p className="text-gray-500 text-xs mb-2">
          Unlock weapons by building your kill combo!
        </p>
        <div className="grid grid-cols-2 gap-2">
          {WEAPON_ORDER.map((type) => {
            const weapon = WEAPON_DEFINITIONS[type];
            return (
              <div
                key={type}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1"
              >
                <span>{weapon.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-medium">{weapon.name}</div>
                  <div className="text-xs text-gray-500">
                    {weapon.unlockCombo === 0
                      ? "Starting"
                      : `${weapon.unlockCombo} combo`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tips */}
      <section>
        <h3 className="font-bold text-lg mb-2">Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
          <li>Keep moving to avoid getting surrounded</li>
          <li>Health regenerates after not taking damage for 3 seconds</li>
          <li>Combo decays after 2 seconds without kills</li>
          <li>Barrels can chain explode for massive damage</li>
          <li>Devils appear starting from wave 3</li>
          <li>Use the railgun to pierce through lines of enemies</li>
        </ul>
      </section>
    </div>
  );
}
