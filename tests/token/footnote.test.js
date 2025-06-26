const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('../../src/util/grading')
const { lint: validate } = require('../../src/token/footnote')

const lint = (token) => {
  return validate({
    category: CATEGORY_TYPES.FOOTNOTE,
    token: token,
  })
}

test('Standard footnote tokens syntax', () => {
  expect(lint('{{FootnoteStart}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{FootnoteEnd}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{InsertFootnotes}}').getGrade()).toBe(GRADE.PASS)
})

test('Invalid syntax for defining footnotes ', () => {
  expect(lint('{{FootnoteSymbol}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol]}}').getGrade()).toBe(GRADE.ERROR)
})

test('Defining footnotes symbols', () => {
  // Valid footnote numbers
  expect(lint('{{FootnoteSymbol[1]}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{FootnoteSymbol[122]}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{FootnoteSymbol[999]}}').getGrade()).toBe(GRADE.PASS)

  // Invalid - zero or negative numbers
  expect(lint('{{FootnoteSymbol[0]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[-1]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[-42]}}').getGrade()).toBe(GRADE.ERROR)

  // Invalid - non-numeric values
  expect(lint('{{FootnoteSymbol[a]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[*]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[#]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[abc]}}').getGrade()).toBe(GRADE.ERROR)

  // Invalid - multiple parameters
  expect(lint('{{FootnoteSymbol[1,2]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[1][2]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[1,2,3]}}').getGrade()).toBe(GRADE.ERROR)

  // Invalid - decimal numbers
  expect(lint('{{FootnoteSymbol[1.5]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{FootnoteSymbol[2.0]}}').getGrade()).toBe(GRADE.ERROR)
})
