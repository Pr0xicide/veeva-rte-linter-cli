const { GRADE, createLogMessage } = require('../util/logging')

const REGEX_FRAGMENT_LIMIT = /\[(.*?)\]/
const STANDARD_FRAGMENT_TOKEN = '{{insertEmailFragments}}'

const validate = (veevaToken) => {
  const { value: token } = veevaToken

  // If no fragment limit is defined, and standard token is defined correctly.
  if (token === STANDARD_FRAGMENT_TOKEN) return

  // Check proper syntax for defining the fragment limit.
  if (token.indexOf('[]') > 0)
    return createLogMessage(
      GRADE.CRITICAL,
      'Syntax Error: Need to define min and max limit for fragments.'
    )
  if (token.indexOf('[') != 22)
    return createLogMessage(
      GRADE.CRITICAL,
      'Syntax Error: Incorrect syntax to define fragment limits.'
    )
  if (token[token.length - 3] != ']')
    return createLogMessage(
      GRADE.CRITICAL,
      'Syntax Error: Incorrect syntax to define fragment limits.'
    )

  // Check fragment min/max limit.
  const limit = REGEX_FRAGMENT_LIMIT.exec(token)[1]
  if (limit.split(',').length < 2)
    return createLogMessage(
      GRADE.CRITICAL,
      'Syntax Error: Need to define min and max limit for fragments.'
    )

  const min = limit.split(',')[0]
  const max = limit.split(',')[1]
  if (min < 0)
    return createLogMessage(
      GRADE.ERROR,
      'Syntax Error: Minimum fragment limit cannot be less than zero.'
    )
  if (max < 0)
    return createLogMessage(
      GRADE.ERROR,
      'Syntax Error: Maximum fragment limit cannot be less than zero.'
    )
  if (min > max)
    return createLogMessage(
      GRADE.CRITICAL,
      'Syntax Error: Fragment minimum limit value is greater than maximum value limit.'
    )
}

module.exports = {
  validate,
}
