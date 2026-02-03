const path = require('path');

/**
 * Classification of import sources
 */
const ImportSourceType = {
  EXTERNAL: 'external',           // node_modules package
  SAME_GAME: 'same-game',         // Relative import within same game
  SHARED_LIB: 'shared-lib',       // @/lib/* imports
  SHARED_COMPONENT: 'shared-component', // @/components/* imports
  SHARED_APP: 'shared-app',       // @/app/* but different game
  INVALID: 'invalid',             // Malformed or unresolvable
};

/**
 * Resolve the type of an import source
 * @param {string} importSource - The import source string (e.g., "../types", "@/lib/hooks/useTimer")
 * @param {string} currentFilePath - Absolute path to the file containing the import
 * @param {string} projectRoot - Absolute path to project root
 * @returns {{type: string, resolvedPath: string|null, category: string}}
 */
function resolveImportType(importSource, currentFilePath, projectRoot) {
  // External package (no ./ or ../ or @/)
  if (!importSource.startsWith('.') && !importSource.startsWith('@/')) {
    return {
      type: ImportSourceType.EXTERNAL,
      resolvedPath: null,
      category: 'external',
      source: importSource,
    };
  }

  // Handle @/ alias (maps to src/)
  if (importSource.startsWith('@/')) {
    const withoutAlias = importSource.replace('@/', '');
    const resolvedPath = path.join(projectRoot, 'src', withoutAlias);

    // Determine category
    if (withoutAlias.startsWith('lib/')) {
      return {
        type: ImportSourceType.SHARED_LIB,
        resolvedPath,
        category: 'shared-lib',
        source: importSource,
      };
    } else if (withoutAlias.startsWith('components/')) {
      return {
        type: ImportSourceType.SHARED_COMPONENT,
        resolvedPath,
        category: 'shared-component',
        source: importSource,
      };
    } else if (withoutAlias.startsWith('app/games/')) {
      return {
        type: ImportSourceType.SHARED_APP,
        resolvedPath,
        category: 'shared-app',
        source: importSource,
      };
    } else {
      // Other @/ imports (app-level)
      return {
        type: ImportSourceType.SHARED_APP,
        resolvedPath,
        category: 'shared-app',
        source: importSource,
      };
    }
  }

  // Relative import (./ or ../)
  const currentDir = path.dirname(currentFilePath);
  const resolvedPath = path.resolve(currentDir, importSource);

  // Check if it's within the same game directory
  // Games are in src/app/games/{game-name}/
  const gamesDir = path.join(projectRoot, 'src', 'app', 'games');

  // Get the game directory for current file
  const relativeToGames = path.relative(gamesDir, currentFilePath);
  const currentGameMatch = relativeToGames.match(/^([^/\\]+)/);

  if (currentGameMatch) {
    const currentGameName = currentGameMatch[1];
    const currentGameDir = path.join(gamesDir, currentGameName);

    // Check if resolved path is within the same game directory
    if (resolvedPath.startsWith(currentGameDir)) {
      return {
        type: ImportSourceType.SAME_GAME,
        resolvedPath,
        category: 'same-game',
        source: importSource,
        gameName: currentGameName,
      };
    }
  }

  // Relative import but not in same game (unusual, possibly crossing boundaries)
  return {
    type: ImportSourceType.INVALID,
    resolvedPath,
    category: 'invalid',
    source: importSource,
  };
}

/**
 * Check if import source is a React import
 * @param {string} source - Import source
 * @returns {boolean}
 */
function isReactImport(source) {
  return source === 'react' || source === 'react-dom' || source.startsWith('react/');
}

/**
 * Check if import source is from hooks directory
 * @param {string} source - Import source
 * @returns {boolean}
 */
function isHookImport(source) {
  // Relative imports
  if (source.includes('/hooks/') || source.includes('\\hooks\\')) {
    return true;
  }
  // Shared hooks
  if (source.startsWith('@/lib/hooks/')) {
    return true;
  }
  return false;
}

/**
 * Check if import source is from components directory
 * @param {string} source - Import source
 * @returns {boolean}
 */
function isComponentImport(source) {
  // Relative imports
  if (source.includes('/components/') || source.includes('\\components\\')) {
    return true;
  }
  // Shared components
  if (source.startsWith('@/components/')) {
    return true;
  }
  return false;
}

/**
 * Check if import source is from logic directory
 * @param {string} source - Import source
 * @returns {boolean}
 */
function isLogicImport(source) {
  return source.includes('/logic/') || source.includes('\\logic\\');
}

/**
 * Check if import source is from types or constants
 * @param {string} source - Import source
 * @returns {boolean}
 */
function isFoundationImport(source) {
  // Check for types.ts, constants.ts, metadata.ts, config.ts
  const foundationFiles = ['types', 'constants', 'metadata', 'config'];
  const fileName = path.basename(source, path.extname(source));
  return foundationFiles.includes(fileName);
}

/**
 * Check if import source is from utils directory
 * @param {string} source - Import source
 * @returns {boolean}
 */
function isUtilsImport(source) {
  return source.includes('/utils/') || source.includes('\\utils\\') || source.startsWith('@/lib/utils/');
}

/**
 * Check if import uses relative path for shared code (anti-pattern)
 * @param {string} source - Import source
 * @returns {boolean}
 */
function isLongRelativePath(source) {
  // Count ../ occurrences
  const upDirCount = (source.match(/\.\.\//g) || []).length;
  return upDirCount >= 3; // ../../../ or more is considered long
}

/**
 * Get the game name from a file path
 * @param {string} filePath - Absolute file path
 * @param {string} projectRoot - Project root path
 * @returns {string|null}
 */
function getGameNameFromPath(filePath, projectRoot) {
  const gamesDir = path.join(projectRoot, 'src', 'app', 'games');
  const relative = path.relative(gamesDir, filePath);
  const match = relative.match(/^([^/\\]+)/);
  return match ? match[1] : null;
}

/**
 * Get the layer classification of a file
 * @param {string} filePath - Absolute file path
 * @param {string} projectRoot - Project root path
 * @returns {string} - One of: logic, hook, component, page, foundation, shared-component, shared-lib, other
 */
function getFileLayer(filePath, projectRoot) {
  const gameName = getGameNameFromPath(filePath, projectRoot);

  if (!gameName) {
    // Not in a game directory
    if (filePath.includes('/components/')) {
      return 'shared-component';
    }
    if (filePath.includes('/lib/')) {
      return 'shared-lib';
    }
    return 'other';
  }

  const gamesDir = path.join(projectRoot, 'src', 'app', 'games');
  const gameDir = path.join(gamesDir, gameName);
  const relative = path.relative(gameDir, filePath);
  const fileName = path.basename(filePath);

  // Foundation files
  if (fileName === 'types.ts' || fileName === 'constants.ts' ||
      fileName === 'metadata.ts' || fileName === 'config.ts') {
    return 'foundation';
  }

  // Page
  if (fileName === 'page.tsx' || fileName === 'layout.tsx') {
    return 'page';
  }

  // Layer directories
  if (relative.startsWith('logic/') || relative.startsWith('logic\\')) {
    return 'logic';
  }
  if (relative.startsWith('hooks/') || relative.startsWith('hooks\\')) {
    return 'hook';
  }
  if (relative.startsWith('components/') || relative.startsWith('components\\')) {
    return 'component';
  }
  if (relative.startsWith('utils/') || relative.startsWith('utils\\')) {
    return 'utils';
  }

  return 'other';
}

module.exports = {
  ImportSourceType,
  resolveImportType,
  isReactImport,
  isHookImport,
  isComponentImport,
  isLogicImport,
  isFoundationImport,
  isUtilsImport,
  isLongRelativePath,
  getGameNameFromPath,
  getFileLayer,
};
