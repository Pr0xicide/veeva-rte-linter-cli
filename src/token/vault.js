const { GRADE } = require('../util/grading')
const { InvalidTokenMessage, VerifiedTokenMessage } = require('../util/message')

const standardTokens = [
  '{{engageLink}}',
  '{{ISILink}}',
  '{{PieceLink}}',
  '{{PILink}}',
  '{{surveyLink}}',
]

const validDocumentID = (veevaToken) => {
  const { token, line } = veevaToken
  const docID = token.substring('{{$'.length, token.length - '}}'.length)

  if (isNaN(docID)) {
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Expecting a number value for Vault tokens.',
    })
  }

  return new VerifiedTokenMessage()
}

const lint = (veevaToken) => {
  const { token } = veevaToken

  // Check standard Vault tokens with no additional parameters.
  if (standardTokens.indexOf(token) >= 0) return new VerifiedTokenMessage()
  // Check for syntax for Vault documents.
  else if (token.indexOf('{{$') === 0) return validDocumentID(veevaToken)

  return new VerifiedTokenMessage()
}

module.exports = {
  lint,
}
