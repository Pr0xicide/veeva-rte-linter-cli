const { GRADE } = require('../../src/util/logging')
const {
  INPUT_TYPE,
  lint: validate,
  determineUserInputType,
  validateDropdown,
  validateTextInput,
} = require('../../src/token/user-input')
const { TYPES } = require('veeva-approved-email-util/src/token-types')

const lint = (token) => {
  return validate({
    type: TYPES.USER_INPUT,
    value: token,
  })
}

test('User input type detection', () => {
  expect(determineUserInputType('{{customText[1|2|3]}}')).toBe(
    INPUT_TYPE.DROPDOWN
  )
  expect(determineUserInputType('{{customText[1|2|3}}')).toBe(
    INPUT_TYPE.UNKNOWN
  )

  expect(determineUserInputType('{{customText()}}')).toBe(INPUT_TYPE.UNKNOWN)
  expect(determineUserInputType('{{customText(dfdf)}}')).toBe(
    INPUT_TYPE.UNKNOWN
  )
  expect(determineUserInputType('{{customText(1)}}')).toBe(INPUT_TYPE.TEXT)
  expect(determineUserInputType('{{customText(1|Placeholder)}}')).toBe(
    INPUT_TYPE.TEXT
  )
})

test('Standard user input tokens', () => {
  expect(lint('{{customText}}')).toBe()
  expect(lint('{{customText:Required}}')).toBe()
  expect(lint('{{customRichText}}')).toBe()
})

test('Text user input tokens', () => {
  expect(validateTextInput('{{customText()}}').grade).toBe(GRADE.ERROR)
  expect(validateTextInput('{{customText(txt|2|3)}}').grade).toBe(
    GRADE.CRITICAL
  )
  expect(validateTextInput('{{customText(hi)}}').grade).toBe(GRADE.ERROR)
  expect(validateTextInput('{{customText(-10)}}').grade).toBe(GRADE.ERROR)
  expect(validateTextInput('{{customText(dfdf|placeholder)}}').grade).toBe(
    GRADE.ERROR
  )
  expect(validateTextInput('{{customText(-10|placeholder)}}').grade).toBe(
    GRADE.ERROR
  )

  expect(validateTextInput('{{customText(10)}}')).toBe()
  expect(validateTextInput('{{customText(10|placeholder)}}')).toBe()
})

test('Dropdown input token syntax', () => {
  expect(validateDropdown('{{customText[1|2]}}')).toBe()

  expect(validateDropdown('{{customText]}}').grade).toBe(GRADE.CRITICAL)
  expect(validateDropdown('{{customText[}}').grade).toBe(GRADE.CRITICAL)
  expect(validateDropdown('{{customText}}').grade).toBe(GRADE.CRITICAL)
  expect(validateDropdown('{customText}}').grade).toBe(GRADE.CRITICAL)
  expect(validateDropdown('{{customText}').grade).toBe(GRADE.CRITICAL)
  expect(validateDropdown('{{customText[[}}').grade).toBe(GRADE.CRITICAL)
  expect(validateDropdown('{{customText]]}}').grade).toBe(GRADE.CRITICAL)
  expect(validateDropdown('{{customText[[]]}}').grade).toBe(GRADE.CRITICAL)

  expect(validateDropdown('{{customText[]}}').grade).toBe(GRADE.WARNING)
})

test('Dropdown options are valid', () => {
  expect(validateDropdown('{{customText[https://google.com]}}').grade).toBe(
    GRADE.WARNING
  )
  expect(validateDropdown('{{customText[<sup>&reg;</sup>]}}').grade).toBe(
    GRADE.ERROR
  )
  expect(validateDropdown('{{customText[{{accLname}}]}}').grade).toBe(
    GRADE.ERROR
  )
  expect(validateDropdown('{{customText[1|]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[{{customText[1]}}|2]}}').grade).toBe(
    GRADE.CRITICAL
  )
})
