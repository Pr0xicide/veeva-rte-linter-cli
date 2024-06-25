const MESSAGE_LEVELS = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
}

const GRADE = {
  PASS: 'PASS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
}

/**
 * Creates a log message with grade and message description of the warning/error
 *
 * @param {Enumerator<GRADE>} grade
 * @param {String} message
 * @returns {Object}
 */
const createLogMessage = (grade, message) => {
  return {
    grade: grade,
    message: message,
  }
}

module.exports = {
  MESSAGE_LEVELS,
  GRADE,
  createLogMessage,
}
