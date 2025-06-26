const CATEGORY_TYPES = Object.freeze({
  CONTENT: 'content',
  CONSENT: 'consent',
  CITATION: 'citation',
  FOOTNOTE: 'footnote',
  FUNCTIONALITY: 'functionality',
  USER_INPUT: 'user input',
  EMAIL_FRAGMENT: 'email fragment',
  TEMPLATE_FRAGMENT: 'template fragment',
  SENT_EMAIL: 'sent email',
  SIGNATURE: 'signature',
  UNSUBSCRIBE: 'unsubscribe',
  VAULT: 'vault',
  UNKNOWN: 'unknown',
})

/**
 * Checks if a token belongs to the content category by matching known content-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the content category
 */
const isTokenContentCategory = (token) => {
  return (
    token.indexOf('{{acc') === 0 ||
    token.indexOf('{{user') === 0 ||
    token.indexOf('{{Account.') === 0 ||
    token.indexOf('{{timeZone}}') === 0 ||
    token.indexOf('{{Approved_Document_vod.') === 0 ||
    token.indexOf('{{Approved_Document_vod__c.') === 0 ||
    token.indexOf('{{Call2_vod.') === 0 ||
    token.indexOf('{{User.') === 0 ||
    token.indexOf('{{User_Detail_vod.') === 0 ||
    token.indexOf('{{parentCallDatetime') === 0 ||
    token.indexOf('{{customContent') === 0
  )
}

/**
 * Checks if a token belongs to the consent category by matching consent-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the consent category
 */
const isTokenConsentCategory = (token) => {
  return (
    token.indexOf('{{insertConsentLines}}') === 0 ||
    token.indexOf('{{insertMCConsentLines') === 0
  )
}

/**
 * Checks if a token belongs to the citation category by matching citation-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the citation category
 */
const isTokenCitationCategory = (token) => {
  return (
    token.indexOf('{{Citation') === 0 || token.indexOf('{{InsertCitation') === 0
  )
}

/**
 * Checks if a token belongs to the footnote category by matching footnote-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the footnote category
 */
const isTokenFootnoteCategory = (token) => {
  return (
    token.indexOf('{{InsertFootnotes}}') === 0 ||
    token.indexOf('{{FootnoteStart}}') === 0 ||
    token.indexOf('{{FootnoteEnd}}') === 0 ||
    token.indexOf('{{FootnoteSymbol') === 0
  )
}

/**
 * Checks if a token belongs to the functionality category by matching functionality-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the functionality category
 */
const isTokenFunctionallyCategory = (token) => {
  return (
    token.indexOf('{{addToCalendar}}') === 0 ||
    token.indexOf('{{approvedEmailAction') === 0 ||
    token.indexOf('{{EventSession}}') === 0 ||
    token.indexOf('{{EventSpeaker}}') === 0 ||
    token.indexOf('{{insertEngageAndZoomJoinURL') === 0 ||
    token.indexOf('{{insertZoomDialInNumbers') === 0 ||
    token.indexOf('{{requiresReview}}') === 0 ||
    token.indexOf('{{schedulerLink}}') === 0
  )
}

/**
 * Checks if a token belongs to the email fragment category by matching email fragment-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the email fragment category
 */
const isTokenEmailFragmentCategory = (token) => {
  return (
    token.indexOf('{{insertEmailFragments') === 0 ||
    token.indexOf('{{insertEmailBuilder}}') === 0
  )
}

/**
 * Checks if a token belongs to the template fragment category by matching template fragment-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the template fragment category
 */
const isTokenTemplateFragmentCategory = (token) => {
  return token.indexOf('{{emailTemplateFragment}}') === 0
}

/**
 * Checks if a token belongs to the sent email category by matching sent email-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the sent email category
 */
const isTokenSentEmailCategory = (token) => {
  return (
    token.indexOf('{{EmailAddressUnsub}}') === 0 ||
    token.indexOf('{{EmailId}}') === 0 ||
    token.indexOf('{{OrgId}}') === 0 ||
    token.indexOf('{{AppDocId') === 0
  )
}

/**
 * Checks if a token belongs to the signature category by matching signature-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the signature category
 */
const isTokenSignatureCategory = (token) => {
  return (
    token.indexOf('{{insertCallSample') === 0 ||
    token.indexOf('{{insertMedicalInquiry') === 0 ||
    token.indexOf('{{insertOrderLine}}') === 0 ||
    token.indexOf('{{insertSignature}}') === 0
  )
}

/**
 * Checks if a token belongs to the unsubscribe category by matching unsubscribe-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the unsubscribe category
 */
const isTokenUnsubscribeCategory = (token) => {
  return token.indexOf('{{unsubscribe_product_link') === 0
}

/**
 * Checks if a token belongs to the vault category by matching vault-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the vault category
 */
const isTokenVaultCategory = (token) => {
  return (
    token.indexOf('{{$') === 0 ||
    token.indexOf('{{DynamicContentLink}}') === 0 ||
    token.indexOf('{{ISILink}}') === 0 ||
    token.indexOf('{{PieceLink}}') === 0 ||
    token.indexOf('{{PILink}}') === 0 ||
    token.indexOf('{{surveyLink}}') === 0
  )
}

/**
 * Checks if a token belongs to the user input category by matching user input-related prefixes.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token belongs to the user input category
 */
const isTokenUserInputCategory = (token) => {
  return (
    token.indexOf('{{customText') === 0 ||
    token.indexOf('{{customRichText}}') === 0
  )
}

/**
 * Loops through the tokens returned from "getVeevaTokens" and determines the category for each token.
 *
 * @param {Array<{line:number, token:String}>} veevaTokens Array of Veeva token objects from getVeevaTokens function
 * @returns {void} false if incorrect parameter type was provided
 */
const determineTokenCategory = (veevaTokens) => {
  // Parameter validation.
  if (!(veevaTokens instanceof Array) || veevaTokens.length === 0) return false

  const categoryChecks = {
    [CATEGORY_TYPES.CONTENT]: isTokenContentCategory,
    [CATEGORY_TYPES.CONSENT]: isTokenConsentCategory,
    [CATEGORY_TYPES.FUNCTIONALITY]: isTokenFunctionallyCategory,
    [CATEGORY_TYPES.CITATION]: isTokenCitationCategory,
    [CATEGORY_TYPES.FOOTNOTE]: isTokenFootnoteCategory,
    [CATEGORY_TYPES.EMAIL_FRAGMENT]: isTokenEmailFragmentCategory,
    [CATEGORY_TYPES.TEMPLATE_FRAGMENT]: isTokenTemplateFragmentCategory,
    [CATEGORY_TYPES.SENT_EMAIL]: isTokenSentEmailCategory,
    [CATEGORY_TYPES.SIGNATURE]: isTokenSignatureCategory,
    [CATEGORY_TYPES.UNSUBSCRIBE]: isTokenUnsubscribeCategory,
    [CATEGORY_TYPES.VAULT]: isTokenVaultCategory,
    [CATEGORY_TYPES.USER_INPUT]: isTokenUserInputCategory,
  }

  // Determine the category for each Veeva token.
  veevaTokens.forEach((veevaToken) => {
    const { token } = veevaToken
    veevaToken.category =
      Object.entries(categoryChecks).find(([, checkFn]) =>
        checkFn(token)
      )?.[0] || CATEGORY_TYPES.UNKNOWN
  })
}

/**
 * Provides a summary on the number of tokens per each category from the "determineTokenCategory" function.
 *
 * @param {Array<{line:number, token:String}>} veevaTokens Array of Veeva tokens with categories defined from "determineTokenCategory"
 * @returns {{categoryName:Number}} object with all categories and count number for each category
 */
const getTokenCategorySummary = (veevaTokens) => {
  // Parameter validation.
  if (veevaTokens instanceof Array === false) return false
  else if (veevaTokens.length === 0) return false

  const summary = {}
  const veevaCategories = Object.keys(CATEGORY_TYPES)

  veevaCategories.forEach((categoryName) => {
    const count = veevaTokens.filter(
      (veevaToken) => veevaToken.category === CATEGORY_TYPES[categoryName]
    ).length
    summary[CATEGORY_TYPES[categoryName]] = count
  })

  return summary
}

module.exports = {
  CATEGORY_TYPES,
  determineTokenCategory,
  getTokenCategorySummary,
  isTokenContentCategory,
  isTokenConsentCategory,
  isTokenCitationCategory,
  isTokenFootnoteCategory,
  isTokenFunctionallyCategory,
  isTokenEmailFragmentCategory,
  isTokenTemplateFragmentCategory,
  isTokenSentEmailCategory,
  isTokenSignatureCategory,
  isTokenUnsubscribeCategory,
  isTokenVaultCategory,
  isTokenUserInputCategory,
}
