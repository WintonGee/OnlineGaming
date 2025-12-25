# Game Implementation Guide

A practical guide for implementing new games in the OnlineGaming codebase. This covers the essential patterns, file structures, and conventions used across all games.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Game Configuration](#game-configuration)
4. [Hook Architecture](#hook-architecture)
5. [State Management](#state-management)
6. [UI Components](#ui-components)
7. [Styling Patterns](#styling-patterns)
8. [Input Handling](#input-handling)
9. [Storage & Persistence](#storage--persistence)
10. [SEO & Metadata](#seo--metadata)
11. [New Game Checklist](#new-game-checklist)

---

## Project Overview

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | App Router framework |
| React | 18.3.1 | UI library |
| TypeScript | 5.4.5 | Type safety |
| Tailwind CSS | 3.4.3 | Styling |
| Radix UI | - | Accessible primitives |
| Lucide React | 0.378.0 | Icons |
| next-themes | 0.3.0 | Dark/light mode |

### Key Conventions

- **Client Components**: All game pages are client-side (`"use client"`)
- **Path Aliases**: Use `@/` for imports (maps to `./src/`)
- **Dark Mode**: Class-based theming via next-themes
- **Styling**: Tailwind CSS with CSS variables for colors

---

## Directory Structure

### Game Directory Layout

```
src/app/games/{game-name}/
├── page.tsx                 # Main game component (client-side)
├── layout.tsx               # Layout with metadata export
├── metadata.ts              # SEO metadata configuration
├── config.ts                # GameConfig export
├── types.ts                 # TypeScript interfaces
├── constants.ts             # Game constants & configuration
├── components/              # Game UI components
│   ├── GameBoard.tsx        # Main game board/grid
│   ├── [GamePiece].tsx      # Individual game pieces
│   └── InstructionsContent.tsx
├── hooks/                   # Game-specific hooks
│   ├── useGameState.ts      # Core state management
│   └── useGameLogic.ts      # Orchestrator hook
├── logic/                   # Pure game logic (no React)
│   ├── game.ts              # Core game rules
│   ├── validation.ts        # Input validation
│   └── ai.ts                # AI opponent (if applicable)
├── utils/                   # Utility functions
│   └── helpers.ts
└── styles.css               # Game-specific CSS (optional)
```

### Shared Resources

```
src/lib/
├── hooks/                   # Shared React hooks
│   ├── useKeyboardInput.ts  # Arrow key handling
│   ├── useSwipeInput.ts     # Touch gestures
│   ├── useTimer.ts          # Elapsed time
│   ├── useDialogState.ts    # Dialog open/close
│   ├── useWinDialog.ts      # Win state dialog
│   ├── useLongPress.ts      # Long press detection
│   ├── useResponsive.ts     # Viewport/breakpoints
│   └── useAIGameCore.ts     # AI opponent framework
├── utils/
│   ├── cn.ts                # Tailwind class merging
│   ├── storage.ts           # localStorage abstraction
│   └── formatTime.ts        # Time formatting
├── types/
│   └── shared.ts            # Common types
├── constants/
│   └── difficulty.ts        # Difficulty labels
├── metadata.ts              # SEO helpers
└── types.ts                 # GameConfig interface

src/components/
├── ui/                      # shadcn/ui components
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── card.tsx
│   └── ...
├── games/                   # Shared game components
│   ├── GameHeader.tsx
│   ├── GameHelpMenu.tsx
│   ├── WinDialog.tsx
│   ├── GameOverDialog.tsx
│   ├── InstructionsDialog.tsx
│   └── ToggleButtonGroup.tsx
└── app/
    ├── Header.tsx
    ├── theme-provider.tsx
    └── theme-toggle.tsx
```

---

## Game Configuration

### config.ts

Every game needs a `config.ts` file that exports a `GameConfig` object:

```typescript
import { GameConfig } from "@/lib/types";
import { Gamepad2 } from "lucide-react";

export const gameConfig: GameConfig = {
  name: "Game Name",
  slug: "game-name",
  href: "/games/game-name",
  description: "Short description for cards (1-2 lines)",
  longDescription: "Detailed description for SEO and instructions",
  genre: "Puzzle",  // Puzzle, Word Game, Strategy, Arcade, Card Game
  icon: Gamepad2,   // Lucide icon component
  ogImage: "/og-game-name.png",
  seoKeywords: [
    "game name online",
    "play game name free",
    "game name puzzle",
    // ... more keywords
  ],
};
```

### Registering the Game

Add your game to `src/app/games/index.ts`:

```typescript
import { gameConfig as gameNameConfig } from "./game-name/config";

export const allGames: GameConfig[] = [
  // ... existing games
  gameNameConfig,
];
```

---

## Hook Architecture

Games use a **two-layer hook composition pattern**:

### Layer 1: useGameState (Low-Level)

Manages core game state, no UI concerns:

```typescript
// hooks/useGameState.ts
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createNewGame(DEFAULT_DIFFICULTY)
  );
  const [bestScores, setBestScores] = useState<BestScores>({});

  // Load persisted data
  useEffect(() => {
    const saved = bestScoresStorage.load();
    if (saved) setBestScores(saved);
  }, []);

  // State update helper
  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  // Game actions
  const makeMove = useCallback((position: Position) => {
    // Game logic here
    setGameState(prev => applyMove(prev, position));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createNewGame(gameState.difficulty));
  }, [gameState.difficulty]);

  return {
    gameState,
    bestScores,
    makeMove,
    resetGame,
    updateState,
  };
}
```

### Layer 2: useGameLogic (Orchestrator)

Composes state hook with shared hooks, manages UI state:

```typescript
// hooks/useGameLogic.ts
export function useGameLogic() {
  const gameState = useGameState();
  const instructionsDialog = useDialogState();
  const { winDialog, resetWinDialog } = useWinDialog(gameState.gameState.won);
  const gameOverDialog = useDialogState();
  const hasShownEndDialog = useRef(false);

  // Input handling
  useKeyboardInput({
    onMove: gameState.handleMove,
    enabled: !gameState.gameState.gameOver,
  });

  // Auto-show dialogs
  useEffect(() => {
    if (gameState.gameState.gameOver && !hasShownEndDialog.current) {
      hasShownEndDialog.current = true;
      if (gameState.gameState.won) {
        winDialog.open();
      } else {
        gameOverDialog.open();
      }
    }
  }, [gameState.gameState.gameOver, gameState.gameState.won]);

  // New game handler
  const handleNewGame = useCallback(() => {
    hasShownEndDialog.current = false;
    resetWinDialog();
    gameOverDialog.close();
    gameState.resetGame();
  }, [resetWinDialog, gameOverDialog, gameState]);

  return {
    // State
    ...gameState.gameState,
    bestScores: gameState.bestScores,

    // Actions
    handleMove: gameState.makeMove,
    handleNewGame,

    // Dialogs
    instructionsDialog,
    winDialog,
    gameOverDialog,
  };
}
```

### Shared Hooks Reference

| Hook | Purpose | Usage |
|------|---------|-------|
| `useKeyboardInput` | Arrow key detection | Grid-based games |
| `useSwipeInput` | Touch swipe gestures | Mobile support |
| `useTimer` | Elapsed time tracking | Timed games |
| `useDialogState` | Dialog open/close | All dialogs |
| `useWinDialog` | Win state with auto-open | Win conditions |
| `useLongPress` | Long press detection | Mobile context menus |
| `useAIGameCore` | AI opponent framework | 2-player games |
| `useResponsive` | Viewport detection | Responsive sizing |

---

## State Management

### Types Pattern

```typescript
// types.ts
import { Difficulty } from "@/lib/types/shared";

export interface GameState {
  board: Cell[][];
  score: number;
  moves: number;
  difficulty: Difficulty;
  gameOver: boolean;
  won: boolean;
}

export interface Cell {
  id: string;
  value: number;
  status: CellStatus;
}

export type CellStatus = "hidden" | "revealed" | "flagged";

// For localStorage
export interface SavedGameState {
  board: Cell[][];
  score: number;
  // ... only serializable data
}
```

### Constants Pattern

```typescript
// constants.ts
import { Difficulty } from "@/lib/types/shared";

// Storage keys
export const GAME_STATE_KEY = "game-name-state";
export const BEST_SCORES_KEY = "game-name-best-scores";

// Game mechanics
export const GRID_SIZE = 8;
export const WIN_CONDITION = 2048;

// Timing
export const ANIMATION_DURATION = 300;
export const AI_DELAY = 500;

// Difficulty configuration
export interface DifficultyConfig {
  gridSize: number;
  mineCount: number;
  label: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { gridSize: 8, mineCount: 10, label: "Easy" },
  medium: { gridSize: 12, mineCount: 30, label: "Medium" },
  hard: { gridSize: 16, mineCount: 60, label: "Hard" },
};

export const DEFAULT_DIFFICULTY: Difficulty = "medium";
```

### Pure Logic Functions

Keep game logic in pure functions (no React):

```typescript
// logic/game.ts
import { GameState, Cell, Position } from "../types";

export function createNewGame(difficulty: Difficulty): GameState {
  const config = DIFFICULTY_CONFIG[difficulty];
  return {
    board: generateBoard(config.gridSize),
    score: 0,
    moves: 0,
    difficulty,
    gameOver: false,
    won: false,
  };
}

export function applyMove(state: GameState, position: Position): GameState {
  // Pure function - no side effects
  // Returns new state object
}

export function checkWinCondition(state: GameState): boolean {
  // Check if player has won
}
```

---

## UI Components

### Page Structure

```typescript
// page.tsx
"use client";

import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import WinDialog from "@/components/games/WinDialog";
import GameOverDialog from "@/components/games/GameOverDialog";
import InstructionsDialog from "@/components/games/InstructionsDialog";
import { useGameLogic } from "./hooks/useGameLogic";
import GameBoard from "./components/GameBoard";
import InstructionsContent from "./components/InstructionsContent";

export default function GamePage() {
  const {
    board,
    score,
    bestScores,
    difficulty,
    gameOver,
    won,
    handleMove,
    handleNewGame,
    handleDifficultyChange,
    instructionsDialog,
    winDialog,
    gameOverDialog,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <GameHeader title="Game Name" />

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          {/* Difficulty Toggle */}
          <div className="inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800">
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  difficulty === diff
                    ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>

          <GameHelpMenu
            onHowToPlay={instructionsDialog.open}
            onNewGame={handleNewGame}
          />
        </div>

        {/* Stats Display */}
        <div className="flex gap-4 justify-center mb-4">
          <StatBox label="Score" value={score} />
          <StatBox label="Best" value={bestScores[difficulty] ?? 0} />
        </div>

        {/* Game Board */}
        <GameBoard
          board={board}
          onCellClick={handleMove}
          disabled={gameOver}
        />

        {/* Dialogs */}
        <WinDialog
          open={winDialog.isOpen}
          onOpenChange={winDialog.setIsOpen}
          title="You Win!"
          message={`Score: ${score}`}
          onNewGame={handleNewGame}
        />

        <GameOverDialog
          open={gameOverDialog.isOpen}
          onOpenChange={gameOverDialog.setIsOpen}
          icon="frown"
          message="Game Over"
          score={score}
          highScore={bestScores[difficulty]}
          onNewGame={handleNewGame}
        />

        <InstructionsDialog
          open={instructionsDialog.isOpen}
          onOpenChange={instructionsDialog.setIsOpen}
          title="How to Play"
        >
          <InstructionsContent />
        </InstructionsDialog>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2 text-center">
      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-bold text-black dark:text-white font-mono">
        {value}
      </div>
    </div>
  );
}
```

### Shared Game Components

#### GameHeader

```typescript
<GameHeader title="Game Name" />
```

Renders a large serif title. Responsive sizing from 4xl to 6xl.

#### GameHelpMenu

```typescript
<GameHelpMenu
  onHowToPlay={() => {}}      // Required
  onNewGame={() => {}}        // Required
  onRevealHint={() => {}}     // Optional - adds "Reveal Hint" option
  onFlagHint={() => {}}       // Optional - adds "Flag Hint" option
  onRevealWord={() => {}}     // Optional - adds "Reveal Word" option
  variant="default"           // "default" | "rounded"
/>
```

#### WinDialog (3 Variants)

**Simple:**
```typescript
<WinDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="You Win!"
  message="Puzzle completed"
  solution="ANSWER"           // Optional - shows answer
/>
```

**With Continue Option:**
```typescript
<WinDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="You Win!"
  message="Keep going?"
  onContinue={handleContinue}
  onNewGame={handleNewGame}
/>
```

**With Time Stats:**
```typescript
<WinDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Level Complete!"
  time={elapsedSeconds}
  difficulty={difficulty}
  bestTimes={bestTimes}
  formatTime={formatTimeMMSS}
  onNewGame={handleNewGame}
/>
```

#### GameOverDialog

```typescript
<GameOverDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  icon="skull"              // "skull" | "frown" | "x"
  title="Game Over"         // Optional - defaults to "Game Over"
  message="Better luck next time"
  score={score}             // Optional - shows score
  highScore={highScore}     // Optional - shows high score comparison
  solution="ANSWER"         // Optional - shows answer
  onNewGame={handleNewGame}
/>
```

#### InstructionsDialog

```typescript
<InstructionsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="How to Play"
  maxWidth="lg"             // "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
>
  <InstructionsContent />
</InstructionsDialog>
```

---

## Styling Patterns

### Color System

Colors use HSL CSS variables defined in `globals.css`:

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--background` | white | black | Page background |
| `--foreground` | black | white | Primary text |
| `--muted` | gray-96% | gray-10% | Muted backgrounds |
| `--muted-foreground` | gray-45% | gray-65% | Secondary text |
| `--border` | gray-80% | gray-20% | Borders |
| `--primary` | black | white | Primary buttons |
| `--destructive` | red | red | Error states |

### Dark Mode Pattern

Always include both light and dark variants:

```typescript
className="bg-white dark:bg-black"
className="text-black dark:text-white"
className="border-gray-300 dark:border-gray-600"
className="hover:bg-gray-100 dark:hover:bg-gray-800"
```

### Responsive Pattern

Mobile-first with Tailwind breakpoints:

```typescript
// Text sizing
className="text-2xl sm:text-3xl md:text-4xl"

// Spacing
className="px-4 py-2 sm:px-6 sm:py-4"

// Layout
className="flex flex-col sm:flex-row gap-2 sm:gap-4"

// Grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

### Animation Patterns

#### CSS Transitions

```typescript
// Color/background transitions
className="transition-colors duration-200"

// Transform transitions
className="transition-transform duration-300"

// All properties
className="transition-all duration-300"
```

#### Custom Animations (in styles.css)

```css
/* Tile movement (2048-style) */
.tile-position {
  transition: left 100ms ease-out, top 100ms ease-out;
  transform: translateZ(0);  /* GPU acceleration */
}

/* New tile appear */
@keyframes tileNew {
  0% { scale: 0; opacity: 0; }
  100% { scale: 1; opacity: 1; }
}

/* Merge pulse */
@keyframes tileMerge {
  0% { scale: 1; }
  50% { scale: 1.15; }
  100% { scale: 1; }
}

/* Card flip (3D) */
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.4s ease-in-out;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tile-position { transition: none; }
  .card-inner { transition: none; }
}
```

### Class Merging Utility

Use `cn()` for conditional classes:

```typescript
import { cn } from "@/lib/utils/cn";

className={cn(
  // Base classes
  "px-4 py-2 rounded-lg font-medium",
  // Conditional classes
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed",
  // Dynamic classes
  size === "large" ? "text-lg" : "text-sm"
)}
```

---

## Input Handling

### Keyboard Input

```typescript
import { useKeyboardInput } from "@/lib/hooks/useKeyboardInput";

// In your hook
useKeyboardInput({
  onMove: (direction) => handleMove(direction),
  enabled: !gameOver,
  arrowKeys: {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  },
});
```

For custom keyboard handling:

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        submitGuess();
        break;
      case "Backspace":
        e.preventDefault();
        deleteLetter();
        break;
      default:
        if (/^[a-zA-Z]$/.test(e.key)) {
          e.preventDefault();
          addLetter(e.key.toUpperCase());
        }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [gameOver, submitGuess, deleteLetter, addLetter]);
```

### Touch/Swipe Input

```typescript
import { useSwipeInput } from "@/lib/hooks/useSwipeInput";

// In your component
const boardRef = useRef<HTMLDivElement>(null);

useSwipeInput({
  onMove: (direction) => handleMove(direction),
  enabled: !gameOver,
  elementRef: boardRef,
  threshold: 50,  // Minimum swipe distance
});

return <div ref={boardRef}>...</div>;
```

### Long Press (Mobile)

```typescript
import { useLongPress } from "@/lib/hooks/useLongPress";

function Cell({ onReveal, onFlag }) {
  const longPress = useLongPress({
    onLongPress: onFlag,
    onClick: onReveal,
    delay: 500,
  });

  return <div {...longPress}>Cell</div>;
}
```

---

## Storage & Persistence

### Creating Storage

```typescript
import { createStorage } from "@/lib/utils/storage";

// At module level (outside component)
const gameStateStorage = createStorage<SavedGameState>("game-name-state");
const bestScoresStorage = createStorage<BestScores>("game-name-best-scores");
```

### Loading Data

```typescript
// In useEffect (runs once on mount)
useEffect(() => {
  const saved = bestScoresStorage.load();
  if (saved) {
    setBestScores(saved);
  }
}, []);
```

### Saving Data

```typescript
// Option 1: Save on every change
useEffect(() => {
  if (score > 0) {
    gameStateStorage.save({ board, score, moves });
  }
}, [board, score, moves]);

// Option 2: Save on specific events
const updateBestScore = (newScore: number) => {
  const currentBest = bestScores[difficulty] ?? 0;
  if (newScore > currentBest) {
    const updated = { ...bestScores, [difficulty]: newScore };
    setBestScores(updated);
    bestScoresStorage.save(updated);
  }
};
```

### Clearing Data

```typescript
const handleNewGame = () => {
  gameStateStorage.clear();
  setGameState(createNewGame(difficulty));
};
```

---

## SEO & Metadata

### metadata.ts

```typescript
import { createGameMetadataAndStructuredData } from "@/lib/metadata";
import { gameConfig } from "./config";

const gameOptions = {
  title: `Play ${gameConfig.name} Online Free - No Ads | ${gameConfig.genre}`,
  description: `${gameConfig.longDescription}. Free to play with no ads. Multiple difficulty levels.`,
  keywords: gameConfig.seoKeywords,
  gamePath: gameConfig.href,
  ogImage: gameConfig.ogImage,
  structuredData: {
    name: `${gameConfig.name} - Free Online ${gameConfig.genre}`,
    alternateName: `${gameConfig.name} Game`,
    description: gameConfig.longDescription,
    genre: [gameConfig.genre, "Browser Game", "Free Online Game"],
    featureList: [
      "No download required",
      "Multiple difficulty levels",
      "Track your best scores",
      "Works on mobile and desktop",
    ],
    ratingValue: "4.5",
    ratingCount: "500",
  },
};

export const { metadata, structuredData } = createGameMetadataAndStructuredData(gameOptions);
```

### layout.tsx

```typescript
import { metadata, structuredData } from "./metadata";

export { metadata };

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
```

---

## New Game Checklist

### Phase 1: Setup

- [ ] Create directory: `src/app/games/{game-name}/`
- [ ] Create subdirectories: `components/`, `hooks/`, `logic/`, `utils/`
- [ ] Create `types.ts` with game interfaces
- [ ] Create `constants.ts` with game configuration
- [ ] Create `config.ts` with GameConfig

### Phase 2: Core Logic

- [ ] Create `logic/game.ts` with pure game functions:
  - [ ] `createNewGame(difficulty)`
  - [ ] `applyMove(state, action)`
  - [ ] `checkWinCondition(state)`
- [ ] Create validation functions if needed

### Phase 3: Hooks

- [ ] Create `hooks/useGameState.ts`:
  - [ ] State initialization
  - [ ] Storage loading/saving
  - [ ] Game actions (makeMove, resetGame)
- [ ] Create `hooks/useGameLogic.ts`:
  - [ ] Compose useGameState
  - [ ] Add dialog state (useDialogState, useWinDialog)
  - [ ] Add input handling (useKeyboardInput, useSwipeInput)
  - [ ] Add auto-dialog effects

### Phase 4: Components

- [ ] Create `components/GameBoard.tsx`
- [ ] Create individual piece components
- [ ] Create `components/InstructionsContent.tsx`

### Phase 5: Page

- [ ] Create `page.tsx`:
  - [ ] Import useGameLogic
  - [ ] Add GameHeader
  - [ ] Add difficulty controls (if applicable)
  - [ ] Add stats display
  - [ ] Add GameBoard
  - [ ] Add GameHelpMenu
  - [ ] Add dialogs (Win, GameOver, Instructions)

### Phase 6: SEO & Registration

- [ ] Create `metadata.ts`
- [ ] Create `layout.tsx` with metadata export
- [ ] Add game to `src/app/games/index.ts`
- [ ] Create OG image at `public/og-{game-name}.png` (1200x630)

### Phase 7: Polish

- [ ] Test keyboard controls
- [ ] Test touch/swipe controls
- [ ] Test dark mode
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test storage persistence
- [ ] Verify all dialogs work correctly
- [ ] Test reduced motion preferences

### Optional Enhancements

- [ ] Add custom CSS animations (`styles.css`)
- [ ] Add AI opponent (useAIGameCore)
- [ ] Add timer (useTimer)
- [ ] Add hints (onRevealHint in GameHelpMenu)
- [ ] Add difficulty-specific high scores

---

## Quick Reference

### Common Imports

```typescript
// Shared hooks
import { useKeyboardInput } from "@/lib/hooks/useKeyboardInput";
import { useSwipeInput } from "@/lib/hooks/useSwipeInput";
import { useTimer } from "@/lib/hooks/useTimer";
import { useDialogState } from "@/lib/hooks/useDialogState";
import { useWinDialog } from "@/lib/hooks/useWinDialog";
import { useAIGameCore } from "@/lib/hooks/useAIGameCore";
import { useLongPress } from "@/lib/hooks/useLongPress";

// Shared utils
import { cn } from "@/lib/utils/cn";
import { createStorage } from "@/lib/utils/storage";
import { formatTimeMMSS } from "@/lib/utils/formatTime";

// Shared types
import type { Difficulty, Direction, Position } from "@/lib/types/shared";
import type { GameConfig } from "@/lib/types";

// Shared components
import GameHeader from "@/components/games/GameHeader";
import GameHelpMenu from "@/components/games/GameHelpMenu";
import WinDialog from "@/components/games/WinDialog";
import GameOverDialog from "@/components/games/GameOverDialog";
import InstructionsDialog from "@/components/games/InstructionsDialog";

// UI components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
```

### Common Tailwind Classes

```typescript
// Page container
"min-h-screen bg-white dark:bg-black"

// Content wrapper
"container mx-auto px-4 py-8 max-w-2xl"

// Card/panel
"bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2"

// Text
"text-black dark:text-white"
"text-gray-600 dark:text-gray-400"

// Borders
"border-2 border-gray-300 dark:border-gray-600"

// Interactive
"hover:bg-gray-100 dark:hover:bg-gray-800"
"focus:ring-2 focus:ring-blue-500 focus:outline-none"
"disabled:opacity-50 disabled:cursor-not-allowed"

// Transitions
"transition-colors duration-200"
"transition-transform duration-300"
```

---

*Last updated: December 2024*
