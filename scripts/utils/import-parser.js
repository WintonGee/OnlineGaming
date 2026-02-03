const fs = require('fs');

/**
 * Extract all import statements from a TypeScript/JavaScript file
 * @param {string} filePath - Absolute path to the file
 * @returns {Array<{source: string, specifiers: Array<string>, raw: string}>}
 */
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];

    // Pattern 1: ES6 named imports - import { A, B } from "source"
    // Pattern 2: ES6 default imports - import A from "source"
    // Pattern 3: ES6 namespace imports - import * as A from "source"
    // Pattern 4: ES6 side-effect imports - import "source"
    // Pattern 5: Type imports - import type { A } from "source"
    // Handles multiline imports
    const es6ImportPattern = /import\s+(?:type\s+)?(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g;

    // Pattern for require statements - const A = require("source")
    const requirePattern = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    let match;

    // Extract ES6 imports
    while ((match = es6ImportPattern.exec(content)) !== null) {
      const raw = match[0];
      const source = match[1];

      // Extract specifiers (what's being imported)
      const specifiers = [];

      // Extract from { A, B, C }
      const namedMatch = raw.match(/\{\s*([^}]+)\s*\}/);
      if (namedMatch) {
        const names = namedMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
        specifiers.push(...names);
      }

      // Extract default import (import A from)
      const defaultMatch = raw.match(/import\s+(\w+)\s+from/);
      if (defaultMatch && !raw.includes('{')) {
        specifiers.push(defaultMatch[1]);
      }

      // Extract namespace import (import * as A)
      const namespaceMatch = raw.match(/import\s+\*\s+as\s+(\w+)/);
      if (namespaceMatch) {
        specifiers.push(namespaceMatch[1]);
      }

      imports.push({
        source,
        specifiers,
        raw,
        type: 'es6',
      });
    }

    // Extract require statements
    while ((match = requirePattern.exec(content)) !== null) {
      const source = match[1];
      imports.push({
        source,
        specifiers: [],
        raw: match[0],
        type: 'require',
      });
    }

    return imports;
  } catch (error) {
    // File doesn't exist or can't be read
    return [];
  }
}

/**
 * Check if a file has any imports from a specific source pattern
 * @param {string} filePath - Absolute path to the file
 * @param {string|RegExp} sourcePattern - Source to match (string or regex)
 * @returns {boolean}
 */
function hasImportFrom(filePath, sourcePattern) {
  const imports = extractImports(filePath);

  if (typeof sourcePattern === 'string') {
    return imports.some(imp => imp.source === sourcePattern);
  } else if (sourcePattern instanceof RegExp) {
    return imports.some(imp => sourcePattern.test(imp.source));
  }

  return false;
}

/**
 * Get all import sources from a file
 * @param {string} filePath - Absolute path to the file
 * @returns {Array<string>}
 */
function getImportSources(filePath) {
  const imports = extractImports(filePath);
  return imports.map(imp => imp.source);
}

/**
 * Filter imports by a condition function
 * @param {string} filePath - Absolute path to the file
 * @param {Function} filterFn - Function that takes import object and returns boolean
 * @returns {Array}
 */
function filterImports(filePath, filterFn) {
  const imports = extractImports(filePath);
  return imports.filter(filterFn);
}

module.exports = {
  extractImports,
  hasImportFrom,
  getImportSources,
  filterImports,
};
