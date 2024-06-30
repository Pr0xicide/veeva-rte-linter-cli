const { GRADE, createLogMessage } = require('../util/logging')

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
  const { value: token } = veevaToken

  // Check if token is a valid short hand notation.
  if (standardContentTokens.indexOf(token) >= 0) return

  return createLogMessage(
    GRADE.ERROR,
    'Content Token: Unidentified content token'
  )
}

module.exports = {
  lint,
}
