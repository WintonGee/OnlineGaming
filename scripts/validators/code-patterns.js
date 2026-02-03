const path = require('path');
const fs = require('fs');
const { getAllGameDirectories } = require('../utils/file-utils');

/**
 * Check if a file contains React imports
 * @param {string} content - File content
 * @returns {boolean}
 */
function hasReactImports(content) {
  // Check for various React import patterns
  const reactImportPatterns = [
    /import\s+.*\s+from\s+['"]react['"]/,           // import ... from 'react'
    /import\s+['"]react['"]/,                        // import 'react'
    /require\s*\(\s*['"]react['"]\s*\)/,            // require('react')
    /import\s+.*\s+from\s+['"]react-dom['"]/,       // import ... from 'react-dom'
    /require\s*\(\s*['"]react-dom['"]\s*\)/,        // require('react-dom')
  ];

  return reactImportPatterns.some(pattern => pattern.test(content));
}

/**
 * Check if a file contains JSX syntax
 * @param {string} content - File content
 * @returns {boolean}
 */
function hasJSXSyntax(content) {
  // Very precise JSX detection patterns
  // Must avoid false positives from:
  // - TypeScript generics: function<T>, Array<Type>
  // - Comparison operators: x < y
  // - Bit shift operators: x << y

  const jsxPatterns = [
    // JSX opening tags with attributes: <Component prop= or <div className=
    /[^a-zA-Z0-9_]<[A-Z][a-zA-Z0-9]*\s+[a-z]/,
    /[^a-zA-Z0-9_]<[a-z]+\s+[a-z]+=/,

    // JSX self-closing tags: <Component />
    /<[A-Z][a-zA-Z0-9]*\s*\/>/,
    /<[a-z]+\s*\/>/,

    // JSX closing tags: </Component> or </div>
    /<\/[a-z]+>/,
    /<\/[A-Z][a-zA-Z0-9]*>/,

    // Return statements with JSX: return <Component or return (<Component
    /return\s*\(\s*<[A-Z][a-zA-Z0-9]*[\s/>]/,
    /return\s*\(\s*<[a-z]+[\s/>]/,
    /return\s+<[A-Z][a-zA-Z0-9]*[\s/>]/,
    /return\s+<[a-z]+[\s/>]/,

    // JSX fragments: <> or </>
    /[^a-zA-Z0-9_]<>\s*/,
    /<\/>/,

    // Adjacent JSX elements (not generics): > <Component or > <div
    // Make sure it's not part of a comparison: x > 0 < y
    />\s*\n\s*<[A-Z]/,
    />\s*\n\s*<[a-z][a-z]/,
  ];

  return jsxPatterns.some(pattern => pattern.test(content));
}

/**
 * Check if a file exports a hook function
 * @param {string} content - File content
 * @returns {boolean}
 */
function exportsHookFunction(content) {
  // Check for hook export patterns
  const hookExportPatterns = [
    /export\s+(function|const)\s+use[A-Z][a-zA-Z0-9]*/,     // export function useX or export const useX
    /export\s+\{\s*use[A-Z][a-zA-Z0-9]*.*\}/,                // export { useX }
    /export\s+default\s+function\s+use[A-Z][a-zA-Z0-9]*/,   // export default function useX
  ];

  return hookExportPatterns.some(pattern => pattern.test(content));
}

/**
 * Read file content safely
 * @param {string} filePath - Path to file
 * @returns {string|null}
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

/**
 * Validate hook architecture for a game
 * @param {string} gameDir - Path to game directory
 * @param {string} gameName - Name of the game
 * @returns {Array} Array of violations
 */
function validateHookArchitecture(gameDir, gameName) {
  const violations = [];

  // Check useGameState.ts
  const useGameStatePath = path.join(gameDir, 'hooks', 'useGameState.ts');
  if (fs.existsSync(useGameStatePath)) {
    const content = readFileContent(useGameStatePath);
    if (content) {
      // Check if it exports a hook function
      if (!exportsHookFunction(content)) {
        violations.push({
          rule: 'HOOK_NO_EXPORT',
          game: gameName,
          message: 'useGameState.ts must export a hook function',
          expected: 'File should export a function starting with "use" (e.g., export function useGameState)',
          actual: 'No hook function export found',
        });
      }
    }
  }

  // Check useGameLogic.ts
  const useGameLogicPath = path.join(gameDir, 'hooks', 'useGameLogic.ts');
  if (fs.existsSync(useGameLogicPath)) {
    const content = readFileContent(useGameLogicPath);
    if (content) {
      // Check if it exports a hook function
      if (!exportsHookFunction(content)) {
        violations.push({
          rule: 'HOOK_NO_EXPORT',
          game: gameName,
          message: 'useGameLogic.ts must export a hook function',
          expected: 'File should export a function starting with "use" (e.g., export function useGameLogic)',
          actual: 'No hook function export found',
        });
      }
    }
  }

  return violations;
}

/**
 * Validate logic purity for a game
 * @param {string} gameDir - Path to game directory
 * @param {string} gameName - Name of the game
 * @returns {Array} Array of violations
 */
function validateLogicPurity(gameDir, gameName) {
  const violations = [];
  const logicDir = path.join(gameDir, 'logic');

  // If logic directory doesn't exist, skip
  if (!fs.existsSync(logicDir)) {
    return violations;
  }

  // Get all .ts files in logic directory
  const logicFiles = fs.readdirSync(logicDir).filter(file => {
    const filePath = path.join(logicDir, file);
    return fs.statSync(filePath).isFile() && file.endsWith('.ts');
  });

  logicFiles.forEach(file => {
    const filePath = path.join(logicDir, file);
    const content = readFileContent(filePath);

    if (content) {
      // Check for React imports
      if (hasReactImports(content)) {
        violations.push({
          rule: 'LOGIC_HAS_REACT_IMPORT',
          game: gameName,
          message: `Logic file "${file}" contains React imports`,
          expected: 'Logic files must be pure (no React dependencies)',
          actual: 'File imports from "react" or "react-dom"',
        });
      }

      // Check for JSX syntax
      if (hasJSXSyntax(content)) {
        violations.push({
          rule: 'LOGIC_HAS_JSX',
          game: gameName,
          message: `Logic file "${file}" contains JSX syntax`,
          expected: 'Logic files must be pure TypeScript (no JSX)',
          actual: 'File contains JSX syntax',
        });
      }
    }
  });

  return violations;
}

/**
 * Validate code patterns for all games
 * @param {string} gamesDir - Path to games directory
 * @returns {Array} Array of violations
 */
function validateCodePatterns(gamesDir) {
  const violations = [];
  const gameDirectories = getAllGameDirectories(gamesDir);

  gameDirectories.forEach(gameName => {
    const gameDir = path.join(gamesDir, gameName);

    // Validate hook architecture
    const hookViolations = validateHookArchitecture(gameDir, gameName);
    violations.push(...hookViolations);

    // Validate logic purity
    const logicViolations = validateLogicPurity(gameDir, gameName);
    violations.push(...logicViolations);
  });

  return violations;
}

module.exports = {
  validateCodePatterns,
  hasReactImports,
  hasJSXSyntax,
  exportsHookFunction,
};
