const { GRADE } = require('../util/logging')

const REGEX_FRAGMENT_LIMIT = /\[(.*?)\]/
const STANDARD_FRAGMENT_TOKEN = '{{insertEmailFragments}}'

const lint = (veevaToken) => {
  const { value: token, line } = veevaToken

  // If no fragment limit is defined, and standard token is defined correctly.
  if (token === STANDARD_FRAGMENT_TOKEN)
    return {
      grade: GRADE.PASS,
      line,
      token,
      message: '',
    }

  // Check proper syntax for defining the fragment limit.
  if (token.indexOf('[]') > 0)
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Need to define minimum and maximum limit for email fragments',
    }
  else if (token.indexOf('[') != 22)
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Incorrect syntax to define fragment limits',
    }
  else if (token[token.length - 3] != ']')
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Incorrect syntax to define fragment limits',
    }

  // Check fragment min/max limit.
  const limit = REGEX_FRAGMENT_LIMIT.exec(token)[1]
  if (limit.split(',').length < 2)
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Need to define min and max limit for fragments',
    }

  const min = limit.split(',')[0]
  const max = limit.split(',')[1]
  if (min < 0)
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Minimum fragment limit cannot be less than zero',
    }
  else if (max < 0)
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Maximum fragment limit cannot be less than zero',
    }
  else if (min > max)
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message:
        'Fragment minimum limit value is greater than maximum value limit',
    }

  return {
    grade: GRADE.PASS,
    line,
    token,
    message: '',
  }
}

module.exports = {
  lint,
}
