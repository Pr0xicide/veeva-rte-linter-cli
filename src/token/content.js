const { GRADE } = require('../util/logging')

const standardContentTokens = [
  '{{accTitle}}',
  '{{accFname}}',
  '{{accLname}}',
  '{{accCredentials}}',
  '{{userEmailAddress}}',
  '{{userName}}',
  '{{userPhoto}}',
  '{{parentCallDatetime}}',
  // "{{User.Phone}}",
  // "{{User.MobilePhone}}",
]

const lint = (veevaToken) => {
  const { value: token, line } = veevaToken

  // Check if token is a valid short hand notation.
  if (standardContentTokens.indexOf(token) >= 0) {
    return {
      grade: GRADE.PASS,
      line,
      token,
      message: '',
    }
  }

  return {
    grade: GRADE.ERROR,
    line,
    token,
    message: 'Unidentified content token',
  }
}

module.exports = {
  lint,
}
