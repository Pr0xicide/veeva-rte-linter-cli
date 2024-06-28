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

const validate = (veevaToken) => {
  const { value } = veevaToken

  // Check if token is a valid short hand notation.
  if (standardContentTokens.indexOf(value) >= 0) return

  return createLogMessage(
    GRADE.ERROR,
    'Content Token: Unidentified content token'
  )
}

module.exports = {
  validate,
}
