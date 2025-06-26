const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('../../src/util/grading')
const { lint: validate } = require('../../src/token/citation')

const lint = (token) => {
  return validate({
    category: CATEGORY_TYPES.CITATION,
    token: token,
  })
}

test('Standard citation tokens syntax', () => {
  expect(lint('{{CitationStart}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{CitationEnd}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{CitationSummaryStart}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{CitationSummaryEnd}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{InsertCitationSummaries}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{InsertCitations}}').getGrade()).toBe(GRADE.PASS)
})

test('Citation number tokens syntax', () => {
  // Valid - integer numbers
  expect(lint('{{CitationNumber[1]}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{CitationNumber[11]}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{CitationNumber[999999]}}').getGrade()).toBe(GRADE.PASS)

  // Invalid - decimal numbers
  expect(lint('{{CitationNumber[1.0]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[2.5]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[10.99]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[1.00]}}').getGrade()).toBe(GRADE.ERROR)

  // Invalid - zero or negative numbers
  expect(lint('{{CitationNumber[01]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[0]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[-1]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[1.5]}}').getGrade()).toBe(GRADE.ERROR)

  // Invalid - whitespace
  expect(lint('{{CitationNumber[ 1]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[1 ]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[ 1 ]}}').getGrade()).toBe(GRADE.ERROR)

  // Invalid - non-numeric values
  expect(lint('{{CitationNumber[}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[abc]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[abc1]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[1abc1]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[!]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[<>]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{CitationNumber[number two]}}').getGrade()).toBe(GRADE.ERROR)
})
