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

const validateTextInput = (token) => {}

const validateDropdown = (token) => {}

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
