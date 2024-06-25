const { GRADE, createLogMessage } = require('../util/logging')

const standardTokens = [
  '{{engageLink}}',
  '{{ISILink}}',
  '{{PieceLink}}',
  '{{PILink}}',
  '{{surveyLink}}',
  // "{{$VaultDocID}}",
]

const validate = (veevaToken) => {}

module.exports = {
  validate,
}
