"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MORSE_WORDS } from "../constants";

type Section = "wires" | "button" | "simon" | "memory" | "password" | "morse";

export function ManualPanel() {
  const [openSection, setOpenSection] = useState<Section | null>("wires");

  const toggleSection = (section: Section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-fit max-h-[calc(100vh-200px)] overflow-y-auto">
      <h3 className="text-white font-bold p-4 bg-gray-700 sticky top-0">
        BOMB DEFUSAL MANUAL
      </h3>

      {/* Wires */}
      <SectionHeader
        title="Wires"
        isOpen={openSection === "wires"}
        onClick={() => toggleSection("wires")}
      />
      {openSection === "wires" && (
        <div className="p-4 text-sm text-gray-300 space-y-3">
          <p className="font-bold text-white">3 Wires:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>No red wires: Cut 2nd wire</li>
            <li>Last wire white: Cut last wire</li>
            <li>More than 1 blue: Cut last blue</li>
            <li>Otherwise: Cut last wire</li>
          </ul>

          <p className="font-bold text-white">4 Wires:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>More than 1 red + serial odd: Cut last red</li>
            <li>Last wire yellow + no red: Cut 1st wire</li>
            <li>Exactly 1 blue: Cut 1st wire</li>
            <li>More than 1 yellow: Cut last wire</li>
            <li>Otherwise: Cut 2nd wire</li>
          </ul>

          <p className="font-bold text-white">5 Wires:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Last wire black + serial odd: Cut 4th wire</li>
            <li>Exactly 1 red + more than 1 yellow: Cut 1st wire</li>
            <li>No black wires: Cut 2nd wire</li>
            <li>Otherwise: Cut 1st wire</li>
          </ul>

          <p className="font-bold text-white">6 Wires:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>No yellow + serial odd: Cut 3rd wire</li>
            <li>Exactly 1 yellow + more than 1 white: Cut 4th wire</li>
            <li>No red wires: Cut last wire</li>
            <li>Otherwise: Cut 4th wire</li>
          </ul>
        </div>
      )}

      {/* Button */}
      <SectionHeader
        title="The Button"
        isOpen={openSection === "button"}
        onClick={() => toggleSection("button")}
      />
      {openSection === "button" && (
        <div className="p-4 text-sm text-gray-300 space-y-3">
          <p className="font-bold text-white">When to Hold:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Blue button with &quot;Abort&quot;</li>
            <li>White button with lit CAR indicator</li>
            <li>Yellow button</li>
            <li>Otherwise (if no press rules apply)</li>
          </ul>

          <p className="font-bold text-white">When to Press Immediately:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>More than 1 battery + &quot;Detonate&quot;</li>
            <li>More than 2 batteries + lit FRK</li>
            <li>Red button with &quot;Hold&quot;</li>
          </ul>

          <p className="font-bold text-white">Holding Release Rules:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Blue strip: Release when timer has 4</li>
            <li>Yellow strip: Release when timer has 5</li>
            <li>Other color: Release when timer has 1</li>
          </ul>
        </div>
      )}

      {/* Simon Says */}
      <SectionHeader
        title="Simon Says"
        isOpen={openSection === "simon"}
        onClick={() => toggleSection("simon")}
      />
      {openSection === "simon" && (
        <div className="p-4 text-sm text-gray-300 space-y-3">
          <p className="font-bold text-white">Serial Has Vowel:</p>
          <div className="text-xs grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-400">0 strikes:</p>
              <p>Red → Blue</p>
              <p>Blue → Red</p>
              <p>Green → Yellow</p>
              <p>Yellow → Green</p>
            </div>
            <div>
              <p className="text-gray-400">1 strike:</p>
              <p>Red → Yellow</p>
              <p>Blue → Green</p>
              <p>Green → Blue</p>
              <p>Yellow → Red</p>
            </div>
          </div>

          <p className="font-bold text-white mt-3">Serial No Vowel:</p>
          <div className="text-xs grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-400">0 strikes:</p>
              <p>Red → Blue</p>
              <p>Blue → Yellow</p>
              <p>Green → Green</p>
              <p>Yellow → Red</p>
            </div>
            <div>
              <p className="text-gray-400">1 strike:</p>
              <p>Red → Red</p>
              <p>Blue → Blue</p>
              <p>Green → Yellow</p>
              <p>Yellow → Green</p>
            </div>
          </div>
        </div>
      )}

      {/* Memory */}
      <SectionHeader
        title="Memory"
        isOpen={openSection === "memory"}
        onClick={() => toggleSection("memory")}
      />
      {openSection === "memory" && (
        <div className="p-4 text-sm text-gray-300 space-y-3">
          <p className="font-bold text-white">Stage 1:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Display 1: Press position 2</li>
            <li>Display 2: Press position 2</li>
            <li>Display 3: Press position 3</li>
            <li>Display 4: Press position 4</li>
          </ul>

          <p className="font-bold text-white">Stage 2:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Display 1: Press label &quot;4&quot;</li>
            <li>Display 2: Press same position as Stage 1</li>
            <li>Display 3: Press position 1</li>
            <li>Display 4: Press same position as Stage 1</li>
          </ul>

          <p className="font-bold text-white">Stage 3:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Display 1: Press same label as Stage 2</li>
            <li>Display 2: Press same label as Stage 1</li>
            <li>Display 3: Press position 3</li>
            <li>Display 4: Press label &quot;4&quot;</li>
          </ul>

          <p className="font-bold text-white">Stage 4:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Display 1: Press same position as Stage 1</li>
            <li>Display 2: Press position 1</li>
            <li>Display 3: Press same position as Stage 2</li>
            <li>Display 4: Press same position as Stage 2</li>
          </ul>

          <p className="font-bold text-white">Stage 5:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Display 1: Press same label as Stage 1</li>
            <li>Display 2: Press same label as Stage 2</li>
            <li>Display 3: Press same label as Stage 4</li>
            <li>Display 4: Press same label as Stage 3</li>
          </ul>
        </div>
      )}

      {/* Password */}
      <SectionHeader
        title="Password"
        isOpen={openSection === "password"}
        onClick={() => toggleSection("password")}
      />
      {openSection === "password" && (
        <div className="p-4 text-sm text-gray-300">
          <p className="font-bold text-white mb-2">Valid Words:</p>
          <div className="grid grid-cols-3 gap-1 text-xs font-mono">
            {[
              "about", "after", "again", "below", "could",
              "every", "first", "found", "great", "house",
              "large", "learn", "never", "other", "place",
              "plant", "point", "right", "small", "sound",
              "spell", "still", "study", "their", "there",
              "these", "thing", "think", "three", "water",
              "where", "which", "world", "would", "write"
            ].map((word) => (
              <span key={word} className="uppercase">{word}</span>
            ))}
          </div>
        </div>
      )}

      {/* Morse Code */}
      <SectionHeader
        title="Morse Code"
        isOpen={openSection === "morse"}
        onClick={() => toggleSection("morse")}
      />
      {openSection === "morse" && (
        <div className="p-4 text-sm text-gray-300">
          <p className="font-bold text-white mb-2">Word Frequencies:</p>
          <div className="space-y-1 text-xs">
            {Object.entries(MORSE_WORDS)
              .sort((a, b) => a[1] - b[1])
              .map(([word, freq]) => (
                <div key={word} className="flex justify-between">
                  <span className="uppercase font-mono">{word}</span>
                  <span className="text-green-400">{freq.toFixed(3)} MHz</span>
                </div>
              ))}
          </div>

          <p className="font-bold text-white mt-4 mb-2">Morse Alphabet:</p>
          <div className="grid grid-cols-3 gap-1 text-xs font-mono">
            <span>A: .-</span>
            <span>B: -...</span>
            <span>C: -.-.</span>
            <span>D: -..</span>
            <span>E: .</span>
            <span>F: ..-.</span>
            <span>G: --.</span>
            <span>H: ....</span>
            <span>I: ..</span>
            <span>J: .---</span>
            <span>K: -.-</span>
            <span>L: .-..</span>
            <span>M: --</span>
            <span>N: -.</span>
            <span>O: ---</span>
            <span>P: .--.</span>
            <span>Q: --.-</span>
            <span>R: .-.</span>
            <span>S: ...</span>
            <span>T: -</span>
            <span>U: ..-</span>
            <span>V: ...-</span>
            <span>W: .--</span>
            <span>X: -..-</span>
            <span>Y: -.--</span>
            <span>Z: --..</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  isOpen,
  onClick,
}: {
  title: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 text-white font-medium text-sm border-t border-gray-600"
    >
      {title}
      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );
}
