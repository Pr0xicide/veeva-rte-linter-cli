const { validate } = require('../../src/token/email-fragment')
const { GRADE } = require('../../src/util/logging')
const { TYPES } = require('../../src/util/token-types')

test('Standard Veeva email fragment token syntax', () => {
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments}}',
    })
  ).toBe(undefined)
})

test('Veeva fragment limits', () => {
  // Basic limit syntax errors.
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[]}}',
    }).grade
  ).toBe(GRADE.CRITICAL)
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[}}',
    }).grade
  ).toBe(GRADE.CRITICAL)
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments]}}',
    }).grade
  ).toBe(GRADE.CRITICAL)
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[1}}',
    }).grade
  ).toBe(GRADE.CRITICAL)
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments1]}}',
    }).grade
  ).toBe(GRADE.CRITICAL)

  // Fragment limits.
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[10]}}',
    }).grade
  ).toBe(GRADE.CRITICAL)
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[-1,0]}}',
    }).grade
  ).toBe(GRADE.ERROR)
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[0,-1]}}',
    }).grade
  ).toBe(GRADE.ERROR)
  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[2,1]}}',
    }).grade
  ).toBe(GRADE.CRITICAL)

  expect(
    validate({
      type: TYPES.EMAIL_FRAGMENT,
      value: '{{insertEmailFragments[1,6]}}',
    })
  ).toBe(undefined)
})
