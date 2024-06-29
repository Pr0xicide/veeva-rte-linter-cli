const { GRADE } = require('../../src/util/logging')
const {
  INPUT_TYPE,
  validate: lint,
  determineUserInputType,
  validateDropdown,
  validateTextInput,
} = require('../../src/token/user-input')
const { TYPES } = require('veeva-approved-email-util/src/token-types')

const validate = (token) => {
  return lint({
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
  expect(validate('{{customText}}')).toBe()
  expect(validate('{{customText:Required}}')).toBe()
  expect(validate('{{customRichText}}')).toBe()
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
