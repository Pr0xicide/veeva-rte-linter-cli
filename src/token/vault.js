const { GRADE, createLogMessage } = require('../util/logging')

const standardTokens = [
  '{{engageLink}}',
  '{{ISILink}}',
  '{{PieceLink}}',
  '{{PILink}}',
  '{{surveyLink}}',
]

const validDocumentID = (token) => {
  const docID = token.substring('{{$'.length, token.length - '}}'.length)

  if (isNaN(docID)) {
    return createLogMessage(
      GRADE.CRITICAL,
      'Syntax Error: Expect a number value for Vault document tokens.'
    )
  }

  return
}

const lint = (veevaToken) => {
  const { value: token } = veevaToken

  // Check standard Vault tokens with no additional parameters.
  if (standardTokens.indexOf(token) >= 0) return
  else if (token.indexOf('{{$') === 0) return validDocumentID(token)

  return
}

module.exports = {
  lint,
}
