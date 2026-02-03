# Architecture Validation System

## Overview

This is a strict, modular validation system that enforces architectural patterns across the OnlineGaming repository. The system runs automatically during the build process and fails the build if any violations are detected.

## Purpose

To maintain architectural consistency and prevent drift from established patterns by:
- Enforcing file structure standards
- Validating naming conventions
- Ensuring code pattern compliance
- Preventing architectural violations at build time

## How It Works

### Build Integration

```bash
npm run build
    ↓
npm run validate (Phase 1, 2, 3, 4)
    ↓
next build (only if validation passes)
    ↓
next-sitemap (only if build succeeds)
```

### Manual Validation

You can run validation manually at any time:

```bash
npm run validate
```

This will check all games and report any violations without running the full build.

---

## Architecture

```
scripts/
├── validate-architecture.js          # Main orchestrator
├── validators/
│   ├── file-structure.js            # Phase 1: File/directory validation
│   ├── naming-conventions.js         # Phase 2: Naming pattern validation
│   ├── code-patterns.js             # Phase 3: Hook & logic validation
│   └── import-validation.js         # Phase 4: Import dependency validation
└── utils/
    ├── file-utils.js                # File system helpers
    ├── reporter.js                  # Error reporting
    ├── import-parser.js             # Import statement extraction
    └── path-resolver.js             # Import path classification
```

---

## ✅ Implemented Phases

### Phase 1: File Structure Validation

**Validator:** `validators/file-structure.js`

**Enforces:**
- ✅ Every game must have required files:
  - `page.tsx` - Main game component
  - `layout.tsx` - Server component wrapper with metadata
  - `metadata.ts` - SEO configuration
  - `config.ts` - Game registration config
  - `types.ts` - Game-specific type definitions
  - `constants.ts` - Game configuration constants

- ✅ Every game must have required directories:
  - `components/` - Game-specific UI components
  - `hooks/` - React hooks (state management)
  - `logic/` - Pure game logic (no React)

- ✅ Every game must have required hooks:
  - `hooks/useGameState.ts` - Layer 1: State management
  - `hooks/useGameLogic.ts` - Layer 2: Orchestrator

**Strictness:** 🔒🔒🔒 Very Strict - No exceptions

**Example Violations:**
```
❌ Missing required file: config.ts
❌ Missing required directory: logic/
❌ Missing required hook: hooks/useGameState.ts
```

---

### Phase 2: Naming Convention Validation

**Validator:** `validators/naming-conventions.js`

**Enforces:**
- ✅ Game directories: `kebab-case` (e.g., `tic-tac-toe`, `rock-paper-scissors`)
- ✅ Component files: `PascalCase.tsx` (e.g., `GameBoard.tsx`, `InstructionsContent.tsx`)
- ✅ Hook files: `useCamelCase.ts` (e.g., `useGameState.ts`, `useKeyboardInput.ts`)
- ✅ Logic files: `camelCase.ts` or `kebab-case.ts` (e.g., `game.ts`, `tile-movement.ts`)
- ✅ Utils files: `camelCase.ts` or `kebab-case.ts` (e.g., `helpers.ts`, `array-utils.ts`)
- ✅ Subdirectories: `lowercase` only (e.g., `components`, `hooks`, `logic`, `utils`)
- ✅ Required files: exact lowercase names (e.g., `page.tsx`, `layout.tsx`, `metadata.ts`)

**Strictness:** 🔒🔒🔒 Very Strict - Enforces consistent patterns

**Example Violations:**
```
❌ Game directory "TicTacToe" must be kebab-case
❌ Component "gameBoard.tsx" must be PascalCase
❌ Hook "UseGameState.ts" must be useCamelCase
❌ Subdirectory "Components" must be lowercase
```

---

### Phase 3: Code Pattern Validation

**Validator:** `validators/code-patterns.js`

**Enforces:**

#### Hook Architecture
- ✅ `useGameState.ts` must export a hook function (starts with "use")
- ✅ `useGameLogic.ts` must export a hook function (starts with "use")
- ✅ Validates the two-layer hook composition pattern

#### Logic Purity
- ✅ Files in `logic/` directory CANNOT import from 'react' or 'react-dom'
- ✅ Files in `logic/` directory CANNOT contain JSX syntax
- ✅ Enforces separation between pure logic and UI concerns
- ✅ Distinguishes between TypeScript generics (`<T>`) and actual JSX (`<Component>`)

**Strictness:** 🔒🔒🔒 Very Strict - Enforces architectural separation

**Example Violations:**
```
❌ useGameState.ts must export a hook function
❌ Logic file "game.ts" contains React imports
❌ Logic file "validation.ts" contains JSX syntax
```

---

### Phase 4: Import Dependency Validation

**Validator:** `validators/import-validation.js`
**Utilities:** `utils/import-parser.js`, `utils/path-resolver.js`

**Enforces:**

#### Rule 1: Logic Layer Purity
- ✅ Files in `logic/` CANNOT import React hooks or components
- ✅ Files in `logic/` CANNOT import game-specific components
- ✅ Logic files may only import:
  - Other logic files from same game
  - Shared utilities, types, constants
  - External libraries (except React/React-DOM)

#### Rule 2: Hook Layer Composition
- ✅ Files in `hooks/` CANNOT import from `components/`
- ✅ Hooks may import from:
  - Other hooks in same game
  - Logic files from same game
  - Shared hooks, types, constants
  - React and React hooks

#### Rule 3: Component Layer Access
- ✅ Files in `components/` CANNOT import from `logic/` directly
- ✅ Components must access logic through hooks (layered architecture)
- ✅ Components may import from:
  - Other components (same game or shared)
  - Hooks from same game or shared
  - Shared UI components, types, constants
  - React and UI libraries

#### Rule 4: Page Layer Orchestration
- ✅ `page.tsx` CANNOT import from `logic/` directly
- ✅ Pages must orchestrate through hooks only
- ✅ Pages may import from:
  - Hooks from same game
  - Components from same game or shared
  - Shared types and constants
  - React and Next.js

**Strictness:** 🔒🔒🔒🔒 Extremely Strict - Enforces layered architecture

**Example Violations:**
```
❌ Logic file "gameLogic.ts" imports from React
❌ Component "GameBoard.tsx" imports directly from "logic/game"
❌ Hook "useGameLogic.ts" imports from "components/Dialog"
❌ Page "page.tsx" imports from "logic/validation"
```

**Technical Implementation:**
- Regex-based import statement parser (handles ES6 imports, require statements, multiline imports)
- Path resolution with @/ alias support (resolves to src/)
- Import source classification (external, same-game, shared, component/hook/logic)
- JSX syntax detection (distinguishes from TypeScript generics)
- Multi-layer validation at build time

**Why This Matters:**
This phase enforces the layered architecture pattern where data and logic flow in one direction:
```
Logic (pure) → Hooks (state + orchestration) → Components (UI) → Page (composition)
```

By preventing backwards dependencies, we ensure:
- Logic remains testable and reusable
- Components don't bypass the hook layer
- Clear separation of concerns
- Predictable data flow

---

## ❌ TODO: Unimplemented Phases

### Phase 5: Game Registration Validation

**Status:** 📋 Not Implemented

**What it would enforce:**
- Every game directory in `src/app/games/` MUST be registered in `src/app/games/index.ts`
- The `allGames` array must contain config for every game
- Game slug in `config.ts` MUST match directory name exactly
- No duplicate slugs allowed across games
- No orphaned games (directory exists but not registered)
- No phantom registrations (registered but directory missing)
- Validate `GameConfig` structure completeness

**Benefits:**
- Ensures all games are discoverable
- Prevents games from being "hidden"
- Maintains homepage game listing accuracy
- Catches misconfiguration early

**Strictness:** 🔒🔒🔒 Very Strict

**Implementation Notes:**
- Compare game directories with registered configs
- Parse `src/app/games/index.ts` to extract `allGames` array
- Validate slug matches directory name
- Check for duplicate slugs

---

### Phase 6: Build Integration Enhancements

**Status:** 📋 Not Implemented

**What it would include:**

#### Pre-commit Git Hooks
- Run validation before every commit
- Prevent commits with violations
- Faster feedback loop (catch issues before push)
- Use husky + lint-staged for implementation

#### CI/CD Integration
- GitHub Actions workflow
- Validation runs on every pull request
- Block merges if validation fails
- Status checks on PRs

#### Developer Experience
- VS Code task integration
- ESLint custom rules for architecture
- Auto-fix capabilities where possible
- Better error messages with fix suggestions

**Benefits:**
- Earlier detection of violations
- Prevents bad code from entering codebase
- Improved developer workflow
- Consistent enforcement across all environments

**Strictness:** 🔒🔒🔒 Very Strict - Multi-layer enforcement

**Implementation Notes:**
- Install husky for git hooks
- Create `.husky/pre-commit` script
- Set up GitHub Actions workflow file
- Create VS Code tasks.json

---

## 💡 Additional Enhancement Ideas

### Phase 7: Type Safety Validation

**What it could enforce:**
- Every game's `types.ts` must export a `GameState` interface
- Hook return types must be explicitly typed
- Component prop types must be defined
- No `@ts-ignore` or `@ts-nocheck` comments allowed
- Strict TypeScript config compliance

**Benefit:** Maximum type safety

---

### Phase 8: Component Structure Validation

**What it could enforce:**
- Every game must have `InstructionsContent.tsx` component
- Game pages must import shared UI from `@/components/games`
- Components can't exceed complexity limits
- Detect and prevent code duplication

**Benefit:** Code reusability and maintainability

---

### Phase 9: Documentation Validation

**What it could enforce:**
- Every game's `config.ts` must have all SEO fields populated
- Public functions must have JSDoc comments
- Components must have purpose comments
- README updates required for new games

**Benefit:** Well-documented codebase

---

### Phase 10: Asset Validation

**What it could enforce:**
- Every game must have OpenGraph image: `/public/og-{game-slug}.png`
- Images must meet size requirements
- Icons in `config.ts` must exist in lucide-react
- No unused assets in `/public/`

**Benefit:** Consistent SEO and asset management

---

### Phase 11: Testing Validation

**What it could enforce:**
- Every logic file must have corresponding `.test.ts`
- Minimum test coverage threshold (e.g., 80%)
- Hook tests required for useGameState and useGameLogic
- No skipped tests in main branch

**Benefit:** Enforces test-driven development

---

### Phase 12: Performance Validation

**What it could enforce:**
- Bundle size limits per game
- No large dependencies in client components
- Images must use Next.js Image component
- No console.log statements in production

**Benefit:** Performance best practices

---

## Usage

### Running Validation

```bash
# Run all validators
npm run validate

# Run as part of build
npm run build
```

### Understanding Errors

When validation fails, you'll see output like:

```
❌ Architecture Validation Failed

Found 3 violation(s):

1. [MISSING_REQUIRED_FILE]
   Game: my-new-game
   Issue: Missing required file: config.ts
   Expected: File exists at src/app/games/my-new-game/config.ts
   Actual: File does not exist

2. [COMPONENT_NOT_PASCAL_CASE]
   Game: my-new-game
   Issue: Component file "gameBoard.tsx" must be PascalCase
   Expected: PascalCase.tsx (e.g., "GameBoard.tsx")
   Actual: gameBoard.tsx

3. [LOGIC_HAS_REACT_IMPORT]
   Game: my-new-game
   Issue: Logic file "game.ts" contains React imports
   Expected: Logic files must be pure (no React dependencies)
   Actual: File imports from "react"
```

### Fixing Violations

1. Read the error message carefully
2. Locate the game and file mentioned
3. Follow the "Expected" guidance
4. Re-run `npm run validate` to confirm fix
5. Build should succeed once all violations are resolved

---

## Adding New Validators

To add a new validator:

1. **Create validator file** in `scripts/validators/`:
   ```javascript
   // scripts/validators/my-validator.js
   function validateMyPattern(gamesDir) {
     const violations = [];
     // Your validation logic
     return violations;
   }

   module.exports = { validateMyPattern };
   ```

2. **Import in main orchestrator** (`scripts/validate-architecture.js`):
   ```javascript
   const { validateMyPattern } = require('./validators/my-validator');
   ```

3. **Add to validation flow**:
   ```javascript
   logProgress('Validating my pattern...');
   const myViolations = validateMyPattern(gamesDir);
   allViolations.push(...myViolations);
   logValidatorResult('My Pattern Validator', myViolations.length);
   ```

4. **Test your validator**:
   ```bash
   npm run validate
   ```

---

## Violation Object Structure

All validators return arrays of violation objects with this structure:

```javascript
{
  rule: 'RULE_NAME',              // Uppercase snake_case identifier
  game: 'game-name',              // Game directory name
  message: 'Clear description',   // Human-readable issue description
  expected: 'What should be',     // Expected state/format
  actual: 'What was found',       // Actual state/format
}
```

---

## Configuration

Currently, the validation system has **zero configuration** - it is intentionally strict with no exceptions allowed. This ensures consistent enforcement across all games.

If you need to add configuration in the future, consider:
- `.architecturerc.json` for validator settings
- Command-line flags for specific validator control
- Environment-based configuration for different strictness levels

---

## Maintenance

### When Adding New Required Files
Update `REQUIRED_FILES` in `validators/file-structure.js`:
```javascript
const REQUIRED_FILES = [
  'page.tsx',
  'layout.tsx',
  'metadata.ts',
  'config.ts',
  'types.ts',
  'constants.ts',
  'new-required-file.ts', // Add here
];
```

### When Adding New Naming Patterns
Update patterns in `validators/naming-conventions.js`:
```javascript
const PATTERNS = {
  KEBAB_CASE: /^[a-z0-9]+(-[a-z0-9]+)*$/,
  PASCAL_CASE: /^[A-Z][a-zA-Z0-9]*$/,
  // Add new pattern here
};
```

### When Adding New Code Rules
Update detection functions in `validators/code-patterns.js`

---

## Troubleshooting

### Validation passes locally but fails in CI
- Ensure file permissions are correct (execute bit for scripts)
- Check Node.js version consistency
- Verify all files are committed (not in .gitignore)

### False positives for JSX detection
- The JSX detector is refined to avoid TypeScript generics
- If you find a false positive, update the regex patterns in `hasJSXSyntax()`

### Performance issues with large codebases
- Current implementation is fast (< 1 second for 19 games)
- If performance degrades, consider caching or incremental validation

---

## Contributing

When adding new validators:
1. Keep them modular and single-purpose
2. Return violations in the standard format
3. Include clear error messages with actionable guidance
4. Test against the entire codebase
5. Update this documentation

---

## Version History

### v2.0.0 - Phase 4 Implementation
- Phase 4: Import Dependency Validation
- Created `validators/import-validation.js` with 4 strict rules
- Created `utils/import-parser.js` for import statement extraction
- Created `utils/path-resolver.js` for import classification
- Enforces layered architecture at import level
- Validates Logic → Hook → Component → Page dependency flow
- Prevents backward dependencies and architectural violations
- Fixed 11 violations across 7 games (sudoku, mastermind, reaction-timer, connect-four, sliding-puzzle, bomb-defusal, minesweeper)

### v1.0.0 - Initial Release
- Phase 1: File Structure Validation
- Phase 2: Naming Convention Validation
- Phase 3: Code Pattern Validation
- Build integration via npm scripts
- Comprehensive error reporting

---

## License

This validation system is part of the OnlineGaming project.
