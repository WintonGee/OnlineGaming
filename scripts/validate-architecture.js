#!/usr/bin/env node

const path = require('path');
const { validateFileStructure } = require('./validators/file-structure');
const { validateNamingConventions } = require('./validators/naming-conventions');
const { validateCodePatterns } = require('./validators/code-patterns');
const { validateImportDependencies } = require('./validators/import-validation');
const { reportViolations, logProgress, logValidatorResult } = require('./utils/reporter');

/**
 * Main validation orchestrator
 */
function main() {
  console.log('\n========================================');
  console.log('🏗️  Architecture Validation Tool');
  console.log('========================================\n');

  const projectRoot = path.resolve(__dirname, '..');
  const gamesDir = path.join(projectRoot, 'src', 'app', 'games');

  // Collect all violations
  const allViolations = [];

  // Run file structure validation
  logProgress('Validating game directory structure...');
  const fileStructureViolations = validateFileStructure(gamesDir);
  allViolations.push(...fileStructureViolations);
  logValidatorResult('File Structure Validator', fileStructureViolations.length);

  // Run naming convention validation
  logProgress('Validating naming conventions...');
  const namingViolations = validateNamingConventions(gamesDir);
  allViolations.push(...namingViolations);
  logValidatorResult('Naming Convention Validator', namingViolations.length);

  // Run code pattern validation
  logProgress('Validating code patterns (hook architecture & logic purity)...');
  const codePatternViolations = validateCodePatterns(gamesDir);
  allViolations.push(...codePatternViolations);
  logValidatorResult('Code Pattern Validator', codePatternViolations.length);

  // Run import dependency validation (Phase 4)
  logProgress('Validating import dependencies (layered architecture)...');
  const importViolations = validateImportDependencies(gamesDir);
  allViolations.push(...importViolations);
  logValidatorResult('Import Dependency Validator', importViolations.length);

  // Report results
  console.log('\n========================================');
  console.log('📊 Validation Summary');
  console.log('========================================');
  reportViolations(allViolations);

  // Exit with appropriate code
  if (allViolations.length > 0) {
    process.exit(1); // Fail build
  } else {
    process.exit(0); // Success
  }
}

// Run validation
main();
