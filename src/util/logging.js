const MESSAGES = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
}

const GRADES = {
  PASS: 'PASS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
}

const FILE_TYPES = {
  EMAIL_TEMPLATE: 1,
  EMAIL_FRAGMENT: 2,
  TEMPLATE_FRAGMENT: 3,
}

module.exports = {
  MESSAGES,
  GRADES,
  FILE_TYPES,
}
