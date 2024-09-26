const {
  getDropdownOptions,
} = require('veeva-approved-email-util/lib/tokens/dropdowns')

const { GRADE } = require('../util/grading')
const { InvalidTokenMessage, VerifiedTokenMessage } = require('../util/message')

const REGEX_DROPDOWN = /\{\{customText\[(.*?)\]\}\}/g
const REGEX_TEXT = /\{\{customText\(\d+(?:\|[^)]+)?\)\}\}/
const REGEX_HTML_TAGS = /<\/?[a-z][\s\S]*>/i
const REGEX_VEEVA_TOKENS = /[\{\}]/

const INPUT_TYPE = {
  DROPDOWN: 'dropdown',
  TEXT: 'text-input',
  UNKNOWN: 'unknown',
}
const standardTokens = [
  '{{customText}}',
  '{{customText:Required}}',
  '{{customRichText}}',
]

/**
 * Determines the user input token type based on the token definition.
 *
 * @param {String} token Veeva token defined
 * @returns {String} type of input token
 */
const determineUserInputType = (token) => {
  // If token is a dropdown of options for the sales rep to choose from.
  const isDropdown = token.match(REGEX_DROPDOWN)
  if (isDropdown !== null && isDropdown.length > 0) return INPUT_TYPE.DROPDOWN

  // If token is a text input field for the sales rep to type in something.
  // {{customText(max length number)}}
  // {{customText(max length number|default text)}}
  const isTextInput = token.match(REGEX_TEXT)
  if (isTextInput !== null && isTextInput.length > 0) return INPUT_TYPE.TEXT

  // Report unknown user input token.
  return INPUT_TYPE.UNKNOWN
}

/**
 * Determine if there are any links detected in an list of dropdown options.
 *
 * @param {Array<String>} options collected from getDropdownOptions function
 * @returns {boolean} boolean to determine if valid or not
 */
const dropdownContainLinks = (options) => {
  const links = options.filter((option) => {
    return (
      option.indexOf('https://') >= 0 ||
      option.indexOf('http://') >= 0 ||
      option.indexOf('www') >= 0
    )
  })

  return links.length > 0 ? true : false
}

/**
 * Determine if there are any HTML tags detected in an list of dropdown options.
 *
 * @param {Array<String>} options collected from getDropdownOptions function
 * @returns {boolean} boolean to determine if valid or not
 */
const dropdownContainHTMLTags = (options) => {
  for (const option of options) {
    if (REGEX_HTML_TAGS.test(option)) return true
  }

  return false
}

/**
 * Checking if content Veeva content tokens are correctly defined in dropdowns.
 *
 * @param {Array<String>} options collected from getDropdownOptions function
 * @returns {boolean} true if defined correctly, false for incorrect syntax
 */
const validDropdownContentTokens = (options) => {
  for (const option of options) {
    if (REGEX_VEEVA_TOKENS.test(option)) return false
  }

  return true
}

/**
 * Checking if the developer has correctly defined a blank option in the
 * dropdown list.
 *
 * @param {Array<String>} options collected from getDropdownOptions function
 * @returns {boolean} true if defined correctly, false for incorrect syntax
 */
const validDropdownEmptyOptionDefined = (options) => {
  for (const option of options) {
    if (option === '') return false
  }

  return true
}

/**
 * Detect if there is a dropdown defined within the parent dropdown token.
 *
 * @param {String} token in the source code
 * @returns {boolean} boolean to determine if valid or not
 */
const containsNestedDropdowns = (token) => {
  if (token.match(/{{customText/g).length > 1) return true
  return false
}

const lintTextInput = (veevaToken) => {
  const { token, line } = veevaToken

  // Retrieve user input token paramters.
  const options = token.substring(
    '{{customText('.length,
    token.length - ')}}'.length
  )
  const params = options.split('|')

  // To many parameters were defined.
  if (params.length > 2)
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message:
        'Incorrect definition of user input text token, expecting either {{customText(charLimit)}} or {{customText(charLimit|Placeholder text)}}',
    })
  // If one parameter is present, needs to be a number.
  else if (params.length === 1 && isNaN(params[0]))
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Parameter character limit needs to be a number',
    })
  // If one parameter is present, character limit needs to be greater than 0.
  else if (params.length === 1 && params[0] <= 0)
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Character limit value needs to be greater than 0',
    })
  // If two parameters are present, first param needs to be a number.
  else if (params.length === 2 && isNaN(params[0]))
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'First parameter character limit needs to be a number',
    })
  // If two parameters are present, character limit needs to be greater than 0.
  else if (params.length === 2 && params[0] <= 0)
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message:
        'First parameter character limit value needs to be greater than 0',
    })

  return new VerifiedTokenMessage()
}

const lintDropdown = (veevaToken) => {
  const { token, line } = veevaToken

  // Check syntax of dropdown token.
  if (
    token.indexOf('{{customText[') < 0 ||
    token.substring(token.length - 3) !== ']}}'
  ) {
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Dropdown token syntax is not defined correctly',
    })
  } else if (token.indexOf('[[') > 0 || token.indexOf(']]') > 0) {
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'Double square brackets detected in dropdown token',
    })
  } else if (token === '{{customText[]}}') {
    return new InvalidTokenMessage({
      grade: GRADE.WARNING,
      line,
      token,
      message:
        'Dropdown token contains no options, needs to contain at least 1 character',
    })
  }

  const dropdownOptions = getDropdownOptions(token)

  // If any options contains any HTML tags
  if (dropdownContainHTMLTags(dropdownOptions)) {
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message:
        'One or more dropdown options contains HTML tags which are not supported',
    })
  }

  // If any options contains any URLs to websites.
  else if (dropdownContainLinks(dropdownOptions))
    return new InvalidTokenMessage({
      grade: GRADE.WARNING,
      line,
      token,
      message: 'One or more dropdown option contains a URL',
    })
  // If any options contains content tokens.
  else if (!validDropdownContentTokens(dropdownOptions))
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'One or more dropdown option contains curly brackets "{}"',
    })
  // If any options are blank.
  else if (!validDropdownEmptyOptionDefined(dropdownOptions))
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message: 'A dropdown option needs to have a minimum of 1 character',
    })
  // If any options contain another dropdown
  else if (containsNestedDropdowns(token))
    return new InvalidTokenMessage({
      grade: GRADE.ERROR,
      line,
      token,
      message:
        'Cannot have dropdown tokens nested within another dropdown token',
    })

  return new VerifiedTokenMessage()
}

/**
 * Lints user input tokens.
 *
 * @param {Object} veevaToken
 * @returns {undefined|Object} if token is valid returns undefined, otherwise returns a log message object
 */
const lint = (veevaToken) => {
  const { token, line } = veevaToken

  // Check standard user input tokens with no additional parameters.
  if (standardTokens.indexOf(token) >= 0) return new VerifiedTokenMessage()

  // Determine the user input token type.
  const inputType = determineUserInputType(token)
  switch (inputType) {
    case INPUT_TYPE.UNKNOWN:
      return {
        grade: GRADE.ERROR,
        line,
        token,
        message: 'Incorrect syntax for user tokens',
      }
    case INPUT_TYPE.TEXT:
      return lintTextInput(veevaToken)
    case INPUT_TYPE.DROPDOWN:
      return lintDropdown(veevaToken)
  }

  // Passed
  return new VerifiedTokenMessage()
}

module.exports = {
  INPUT_TYPE,
  determineUserInputType,
  lintTextInput,
  lintDropdown,
  lint,
}
