const { GRADE, createLogMessage } = require('../util/logging')

const REGEX_DROPDOWN = /\{\{customText\[(.*?)\]\}\}/g
const REGEX_TEXT = /\{\{customText\(\d+(?:\|[^)]+)?\)\}\}/
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
 *
 * @param {String} token Veeva token
 * @returns {undefined|Object} if token is valid returns undefined, otherwise returns a log message object
 */
const validateTextInput = (token) => {
  // Retrieve user input token paramters.
  const options = token.substring(
    '{{customText('.length,
    token.length - ')}}'.length
  )
  const params = options.split('|')

  // To many parameters were defined.
  if (params.length > 2)
    return createLogMessage(
      GRADE.CRITICAL,
      'Syntax Error: Incorrect definition of user input text token, expecting either {{customText(charLimit)}} or {{customText(charLimit|Placeholder text)}}.'
    )
  // If one parameter is present, needs to be a number.
  else if (params.length === 1 && isNaN(params[0]))
    return createLogMessage(
      GRADE.ERROR,
      'Syntax Error: Incorrect definition of user input text token, expecting {{customText(charLimit)}}.'
    )
  // If one parameter is present, character limit needs to be greater than 0.
  else if (params.length === 1 && params[0] <= 0)
    return createLogMessage(
      GRADE.ERROR,
      'Syntax Error: Character limit needs to be greater than 0.'
    )
  // If two parameters are present, first param needs to be a number.
  else if (params.length === 2 && isNaN(params[0]))
    return createLogMessage(
      GRADE.ERROR,
      'Syntax Error: First parameter needs to be a number.'
    )
  // If two parameters are present, character limit needs to be greater than 0.
  else if (params.length === 2 && params[0] <= 0)
    return createLogMessage(
      GRADE.ERROR,
      'Syntax Error: Character limit needs to be greater than 0.'
    )

  return
}

const validateDropdown = (token) => {}

/**
 * Lints user input tokens.
 *
 * @param {Object} veevaToken
 * @returns {undefined|Object} if token is valid returns undefined, otherwise returns a log message object
 */
const validate = (veevaToken) => {
  const { value: token } = veevaToken

  // Check standard user input tokens with no additional parameters.
  if (standardTokens.indexOf(token) >= 0) return

  // Determine the user input token type.
  const inputType = determineUserInputType(token)
  switch (inputType) {
    case INPUT_TYPE.UNKNOWN:
      return createLogMessage(
        GRADE.CRITICAL,
        'Syntax Error: Incorrect syntax for user tokens'
      )
    case INPUT_TYPE.TEXT:
      return validateTextInput(token)
    case INPUT_TYPE.DROPDOWN:
      return validateDropdown(token)
  }

  // Check if user input token contain dropdown options.
  // if (token.match(REGEX_DROPDOWN) === null)
  //   return createLogMessage(GRADE.CRITICAL, "Syntax Error: Incorrect syntax for user input tokens")

  // Passed
  return
}

module.exports = {
  INPUT_TYPE,
  validateTextInput,
  validateDropdown,
  determineUserInputType,
  validate,
}
