const { GRADE, createLogMessage } = require('../util/logging')

const standardTokens = [
  '{{insertConsentLines}}',
  // "{{insertMCConsentLines[Subscribed,Unsubscribed]}}",
]

const validate = (veevaToken) => {}

module.exports = {
  validate,
}
