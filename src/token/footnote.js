const { GRADE } = require('../grading')
const { VerifiedTokenMessage, InvalidTokenMessage } = require('../message')

const REGEX_FOOTNOTE_SEQUENCE = /{{FootnoteSymbol\[(.*?)\]}}/
const standardTokens = [
  '{{FootnoteStart}}',
  '{{FootnoteEnd}}',
  // {{FootnoteSymbol[Sequence Number]}}
  '{{InsertFootnotes}}',
]

const isValidFootnoteSyntax = (token) => {
  if (
    token.indexOf('{{FootnoteSymbol[') !== 0 ||
    token.substring(token.length - 3) !== ']}}'
  ) {
    return false
  }

  return true
}

const isValidFootnoteDefintion = (token) => {
  const footnoteSequence = token.match(REGEX_FOOTNOTE_SEQUENCE)[1]

  if (!footnoteSequence) return false
  else if (isNaN(footnoteSequence)) return false

  return true
}

const lint = (veevaToken) => {
  const { token, line } = veevaToken

  // Check standard tokens with no additional parameters.
  if (standardTokens.indexOf(token) >= 0) return new VerifiedTokenMessage()

  // Check for valid syntax for the "{{FootnoteSymbol}}" token.
  if (!isValidFootnoteSyntax(token)) {
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message:
        'Invalid syntax for defining footnotes, expecting the following syntax "{{FootnoteSymbol[Sequence Number]}}". Refer to the Veeva website for more details, https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/AddingFootnotesCitations.htm',
    })
  }

  // Check for valid definition of footnotes.
  else if (!isValidFootnoteDefintion(token)) {
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message:
        'Only numeric value are allowed when using the "{{FootnoteSymbol[Sequence Number]}}" token. Refer to the Veeva website for more details, https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/AddingFootnotesCitations.htm',
    })
  } else if (isValidFootnoteSyntax(token) && isValidFootnoteDefintion(token)) {
    return new VerifiedTokenMessage()
  }
}

module.exports = {
  lint,
}
