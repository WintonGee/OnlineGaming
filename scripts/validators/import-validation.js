const path = require('path');
const fs = require('fs');
const { getAllGameDirectories } = require('../utils/file-utils');
const { extractImports } = require('../utils/import-parser');
const {
  resolveImportType,
  isReactImport,
  isHookImport,
  isComponentImport,
  isLogicImport,
  isFoundationImport,
  getGameNameFromPath,
  getFileLayer,
} = require('../utils/path-resolver');

/**
 * Get all files in a directory recursively with specific extensions
 * @param {string} dirPath - Directory path
 * @param {Array<string>} extensions - File extensions to include (e.g., ['.ts', '.tsx'])
 * @returns {Array<string>} Array of absolute file paths
 */
function getFilesRecursive(dirPath, extensions = ['.ts', '.tsx']) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getFilesRecursive(fullPath, extensions));
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  });

  return files;
}

/**
 * RULE 1: Logic Purity - Logic files cannot import React, hooks, or components
 * @param {string} projectRoot - Project root path
 * @param {string} gameName - Game name
 * @param {string} filePath - Absolute path to logic file
 * @returns {Array} Violations
 */
function validateLogicImports(projectRoot, gameName, filePath) {
  const violations = [];
  const imports = extractImports(filePath);
  const fileName = path.basename(filePath);
  const relativeFilePath = `logic/${fileName}`;

  imports.forEach(imp => {
    const { source } = imp;

    // Check for React imports
    if (isReactImport(source)) {
      violations.push({
        rule: 'LOGIC_INVALID_IMPORT',
        game: gameName,
        file: relativeFilePath,
        message: `Logic file imports React (${source})`,
        expected: 'Logic files must be pure TypeScript with no React dependencies',
        actual: `import from "${source}"`,
      });
    }

    // Check for hook imports
    if (isHookImport(source)) {
      violations.push({
        rule: 'LOGIC_INVALID_IMPORT',
        game: gameName,
        file: relativeFilePath,
        message: `Logic file imports from hooks directory`,
        expected: 'Logic files cannot import hooks (must be pure functions)',
        actual: `import from "${source}"`,
      });
    }

    // Check for component imports
    if (isComponentImport(source)) {
      violations.push({
        rule: 'LOGIC_INVALID_IMPORT',
        game: gameName,
        file: relativeFilePath,
        message: `Logic file imports from components directory`,
        expected: 'Logic files cannot import components (must be pure functions)',
        actual: `import from "${source}"`,
      });
    }
  });

  return violations;
}

/**
 * RULE 2: Hook Import Boundaries - Hooks can import logic, but not components
 * @param {string} projectRoot - Project root path
 * @param {string} gameName - Game name
 * @param {string} filePath - Absolute path to hook file
 * @returns {Array} Violations
 */
function validateHookImports(projectRoot, gameName, filePath) {
  const violations = [];
  const imports = extractImports(filePath);
  const fileName = path.basename(filePath);
  const relativeFilePath = `hooks/${fileName}`;

  imports.forEach(imp => {
    const { source } = imp;

    // Hooks CAN import React - this is allowed
    // Hooks CAN import logic - this is allowed
    // Hooks CAN import other hooks - this is allowed
    // Hooks CAN import shared libs - this is allowed

    // Check for component imports (NOT ALLOWED)
    if (isComponentImport(source)) {
      // Exception: Check if it's importing from same game's components
      // This is still not allowed - hooks should not import UI components
      violations.push({
        rule: 'HOOK_INVALID_IMPORT',
        game: gameName,
        file: relativeFilePath,
        message: `Hook file imports from components directory`,
        expected: 'Hooks cannot import components (separation of concerns)',
        actual: `import from "${source}"`,
      });
    }
  });

  return violations;
}

/**
 * RULE 3: Component Import Restrictions - Components cannot import directly from logic
 * @param {string} projectRoot - Project root path
 * @param {string} gameName - Game name
 * @param {string} filePath - Absolute path to component file
 * @returns {Array} Violations
 */
function validateComponentImports(projectRoot, gameName, filePath) {
  const violations = [];
  const imports = extractImports(filePath);
  const fileName = path.basename(filePath);
  const relativeFilePath = `components/${fileName}`;

  imports.forEach(imp => {
    const { source } = imp;

    // Components CAN import React - allowed
    // Components CAN import hooks - allowed and encouraged
    // Components CAN import types/constants - allowed
    // Components CAN import other components - allowed
    // Components CAN import shared libraries - allowed

    // Check for logic imports (NOT ALLOWED)
    if (isLogicImport(source)) {
      violations.push({
        rule: 'COMPONENT_IMPORTS_LOGIC',
        game: gameName,
        file: relativeFilePath,
        message: `Component imports directly from logic directory`,
        expected: 'Components must access logic through hooks (layered architecture)',
        actual: `import from "${source}"`,
      });
    }
  });

  return violations;
}

/**
 * RULE 4: Page Import Restrictions - Pages should use useGameLogic, not useGameState directly
 * @param {string} projectRoot - Project root path
 * @param {string} gameName - Game name
 * @param {string} filePath - Absolute path to page file
 * @returns {Array} Violations
 */
function validatePageImports(projectRoot, gameName, filePath) {
  const violations = [];
  const imports = extractImports(filePath);
  const fileName = path.basename(filePath);

  imports.forEach(imp => {
    const { source, specifiers } = imp;

    // Check for direct useGameState import (should use useGameLogic instead)
    if (source.includes('/hooks/useGameState') || source === './hooks/useGameState') {
      violations.push({
        rule: 'PAGE_IMPORTS_GAMESTATE',
        game: gameName,
        file: fileName,
        message: `Page imports useGameState directly`,
        expected: 'Pages should import useGameLogic (orchestration layer), not useGameState',
        actual: `import from "${source}"`,
      });
    }

    // Check for direct logic imports
    if (isLogicImport(source)) {
      violations.push({
        rule: 'PAGE_IMPORTS_LOGIC',
        game: gameName,
        file: fileName,
        message: `Page imports directly from logic directory`,
        expected: 'Pages must access logic through hooks (useGameLogic)',
        actual: `import from "${source}"`,
      });
    }
  });

  return violations;
}

/**
 * Validate import dependencies for a single game
 * @param {string} projectRoot - Project root path
 * @param {string} gameName - Game name
 * @param {string} gameDir - Absolute path to game directory
 * @returns {Array} Violations
 */
function validateGameImports(projectRoot, gameName, gameDir) {
  const violations = [];

  // Get all TypeScript files in the game directory
  const logicDir = path.join(gameDir, 'logic');
  const hooksDir = path.join(gameDir, 'hooks');
  const componentsDir = path.join(gameDir, 'components');
  const pagePath = path.join(gameDir, 'page.tsx');

  // Rule 1: Validate logic files
  if (fs.existsSync(logicDir)) {
    const logicFiles = getFilesRecursive(logicDir, ['.ts']);
    logicFiles.forEach(filePath => {
      const logicViolations = validateLogicImports(projectRoot, gameName, filePath);
      violations.push(...logicViolations);
    });
  }

  // Rule 2: Validate hook files
  if (fs.existsSync(hooksDir)) {
    const hookFiles = getFilesRecursive(hooksDir, ['.ts', '.tsx']);
    hookFiles.forEach(filePath => {
      const hookViolations = validateHookImports(projectRoot, gameName, filePath);
      violations.push(...hookViolations);
    });
  }

  // Rule 3: Validate component files
  if (fs.existsSync(componentsDir)) {
    const componentFiles = getFilesRecursive(componentsDir, ['.tsx', '.ts']);
    componentFiles.forEach(filePath => {
      const componentViolations = validateComponentImports(projectRoot, gameName, filePath);
      violations.push(...componentViolations);
    });
  }

  // Rule 4: Validate page file
  if (fs.existsSync(pagePath)) {
    const pageViolations = validatePageImports(projectRoot, gameName, pagePath);
    violations.push(...pageViolations);
  }

  return violations;
}

/**
 * Main validator function - validate import dependencies for all games
 * @param {string} gamesDir - Path to games directory
 * @returns {Array} Array of violations
 */
function validateImportDependencies(gamesDir) {
  const violations = [];
  const projectRoot = path.resolve(gamesDir, '..', '..', '..');
  const gameDirectories = getAllGameDirectories(gamesDir);

  gameDirectories.forEach(gameName => {
    const gameDir = path.join(gamesDir, gameName);
    const gameViolations = validateGameImports(projectRoot, gameName, gameDir);
    violations.push(...gameViolations);
  });

  return violations;
}

module.exports = {
  validateImportDependencies,
  validateLogicImports,
  validateHookImports,
  validateComponentImports,
  validatePageImports,
};
