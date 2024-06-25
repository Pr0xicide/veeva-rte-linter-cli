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

const validate = (veevaToken) => {}

module.exports = {
  validate,
}
