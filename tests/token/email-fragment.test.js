const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('../../src/util/grading')
const { lint: validate } = require('../../src/token/email-fragment')

const lint = (token) => {
  return validate({
    category: CATEGORY_TYPES.EMAIL_FRAGMENT,
    token: token,
  })
}

test('Standard Veeva email fragment token syntax', () => {
  expect(lint('{{insertEmailFragments}}').getGrade()).toBe(GRADE.PASS)
})

test('Veeva fragment limits', () => {
  // Basic limit syntax errors.
  expect(lint('{{insertEmailFragments[]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{insertEmailFragments[}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{insertEmailFragments]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{insertEmailFragments[1}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{insertEmailFragments1]}}').getGrade()).toBe(GRADE.ERROR)

  // Fragment limits.
  expect(lint('{{insertEmailFragments[10]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{insertEmailFragments[-1,0]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{insertEmailFragments[0,-1]}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{insertEmailFragments[2,1]}}').getGrade()).toBe(GRADE.ERROR)

  expect(lint('{{insertEmailFragments[1,6]}}').getGrade()).toBe(GRADE.PASS)
})
