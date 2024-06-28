const { validate: lint } = require('../../src/token/email-fragment')
const { GRADE } = require('../../src/util/logging')
const { TYPES } = require('../../src/util/token-types')

const validate = (token) => {
  return lint({
    type: TYPES.EMAIL_FRAGMENT,
    value: token,
  })
}

test('Standard Veeva email fragment token syntax', () => {
  expect(validate('{{insertEmailFragments}}')).toBe(undefined)
})

test('Veeva fragment limits', () => {
  // Basic limit syntax errors.
  expect(validate('{{insertEmailFragments[]}}').grade).toBe(GRADE.CRITICAL)
  expect(validate('{{insertEmailFragments[}}').grade).toBe(GRADE.CRITICAL)
  expect(validate('{{insertEmailFragments]}}').grade).toBe(GRADE.CRITICAL)
  expect(validate('{{insertEmailFragments[1}}').grade).toBe(GRADE.CRITICAL)
  expect(validate('{{insertEmailFragments1]}}').grade).toBe(GRADE.CRITICAL)

  // Fragment limits.
  expect(validate('{{insertEmailFragments[10]}}').grade).toBe(GRADE.CRITICAL)
  expect(validate('{{insertEmailFragments[-1,0]}}').grade).toBe(GRADE.ERROR)
  expect(validate('{{insertEmailFragments[0,-1]}}').grade).toBe(GRADE.ERROR)
  expect(validate('{{insertEmailFragments[2,1]}}').grade).toBe(GRADE.CRITICAL)

  expect(validate('{{insertEmailFragments[1,6]}}')).toBe(undefined)
})
