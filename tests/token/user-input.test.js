const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('../../src/util/grading')
const {
  INPUT_TYPE,
  lint: validate,
  determineUserInputType,
  lintDropdown,
  lintTextInput,
} = require('../../src/token/user-input')

const lint = (token) => {
  return validate({
    category: CATEGORY_TYPES.USER_INPUT,
    line: 1,
    token: token,
  })
}

const validateTextInput = (token) => {
  return lintTextInput({
    line: 1,
    category: CATEGORY_TYPES.USER_INPUT,
    token: token,
  })
}

const validateDropdown = (token) => {
  return lintDropdown({
    line: 1,
    category: CATEGORY_TYPES.USER_INPUT,
    token: token,
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
  expect(lint('{{customText}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{customText:Required}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{customRichText}}').getGrade()).toBe(GRADE.PASS)
})

// Input fields tests
test('Text user input tokens', () => {
  expect(validateTextInput('{{customText(10)}}').getGrade()).toBe(GRADE.PASS)
  expect(validateTextInput('{{customText(10|ddd)}}').getGrade()).toBe(
    GRADE.PASS
  )

  expect(validateTextInput('{{customText()}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateTextInput('{{customText(txt|2|3)}}').getGrade()).toBe(
    GRADE.ERROR
  )
  expect(validateTextInput('{{customText(hi)}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateTextInput('{{customText(-10)}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateTextInput('{{customText(dfdf|ddd)}}').getGrade()).toBe(
    GRADE.ERROR
  )
  expect(validateTextInput('{{customText(-10|ddd)}}').getGrade()).toBe(
    GRADE.ERROR
  )
})

// Dropdown Tests
test('Dropdown input token syntax', () => {
  expect(validateDropdown('{{customText[1|2]}}').getGrade()).toBe(GRADE.PASS)

  expect(validateDropdown('{{customText]}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{customText}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[[}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText]]}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[[]]}}').getGrade()).toBe(GRADE.ERROR)

  expect(validateDropdown('{{customText[]}}').grade).toBe(GRADE.WARNING)
})

test('Dropdown options containing website URLs messages', () => {
  expect(validateDropdown('{{customText[https://google.com]}}').grade).toBe(
    GRADE.WARNING
  )
  expect(validateDropdown('{{customText[www.google.com]}}').grade).toBe(
    GRADE.WARNING
  )
})

test('Dropdown options containing HTML tags', () => {
  expect(validateDropdown('{{customText[< 1 of...|> 2...]}}').grade).toBe(
    GRADE.PASS
  )

  expect(validateDropdown('{{customText[<sup>&reg;</sup>]}}').grade).toBe(
    GRADE.ERROR
  )
  expect(validateDropdown('{{customText[<em>text]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[text</em>]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[<em>1|2]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[1</em>|2]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[1<br/>|2]}}').grade).toBe(GRADE.ERROR)
})

test('Dropdown options containing curly "{}" brackets}', () => {
  expect(validateDropdown('{{customText[{}]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[}}]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[{{]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[{{accLname]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[}}]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[accLname}}]}}').grade).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[{{accLname}}]}}').grade).toBe(
    GRADE.ERROR
  )
})

test('Dropdown options containing blank options', () => {
  expect(validateDropdown('{{customText[|]}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[1|]}}').getGrade()).toBe(GRADE.ERROR)
  expect(validateDropdown('{{customText[|2]}}').getGrade()).toBe(GRADE.ERROR)
})

test('Dropdown options containing another dropdown', () => {
  expect(validateDropdown('{{customText[{{customText[1|2]}}').grade).toBe(
    GRADE.ERROR
  )
  expect(validateDropdown('{{customText[{{customText[1]}}|2]}}').grade).toBe(
    GRADE.ERROR
  )
  expect(validateDropdown('{{customText[1|{{customText[2]}}]}}').grade).toBe(
    GRADE.ERROR
  )
})
