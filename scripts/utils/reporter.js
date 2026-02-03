/**
 * Format and print validation violations
 * @param {Array} violations - Array of violation objects
 */
function reportViolations(violations) {
  if (violations.length === 0) {
    console.log('\n✅ All architecture validation checks passed!\n');
    return;
  }

  console.error('\n❌ Architecture Validation Failed\n');
  console.error(`Found ${violations.length} violation(s):\n`);

  violations.forEach((violation, index) => {
    console.error(`${index + 1}. [${violation.rule}]`);
    console.error(`   Game: ${violation.game}`);
    console.error(`   Issue: ${violation.message}`);
    if (violation.expected) {
      console.error(`   Expected: ${violation.expected}`);
    }
    if (violation.actual) {
      console.error(`   Actual: ${violation.actual}`);
    }
    console.error('');
  });

  console.error('❌ Build failed due to architecture violations.');
  console.error('Fix the above issues to proceed.\n');
}

/**
 * Print validation progress
 * @param {string} message - Progress message
 */
function logProgress(message) {
  console.log(`🔍 ${message}`);
}

/**
 * Print validation summary
 * @param {string} validatorName - Name of the validator
 * @param {number} violationCount - Number of violations found
 */
function logValidatorResult(validatorName, violationCount) {
  if (violationCount === 0) {
    console.log(`✅ ${validatorName}: PASSED`);
  } else {
    console.log(`❌ ${validatorName}: FAILED (${violationCount} violations)`);
  }
}

module.exports = {
  reportViolations,
  logProgress,
  logValidatorResult,
};
