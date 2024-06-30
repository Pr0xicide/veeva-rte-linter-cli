const { GRADE } = require('../util/logging')

const standardTokens = [
  '{{engageLink}}',
  '{{ISILink}}',
  '{{PieceLink}}',
  '{{PILink}}',
  '{{surveyLink}}',
]

const validDocumentID = (veevaToken) => {
  const { value: token, line } = veevaToken
  const docID = token.substring('{{$'.length, token.length - '}}'.length)

  if (isNaN(docID))
    return {
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Expect a number value for Vault document tokens.',
    }

  return {
    grade: GRADE.PASS,
    line,
    token,
    message: '',
  }
}

const lint = (veevaToken) => {
  const { value: token, line } = veevaToken

  // Check standard Vault tokens with no additional parameters.
  if (standardTokens.indexOf(token) >= 0)
    return {
      grade: GRADE.PASS,
      line,
      token,
      message: '',
    }
  // Check for syntax for Vault documents.
  else if (token.indexOf('{{$') === 0) return validDocumentID(veevaToken)

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
