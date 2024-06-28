/**
 * Test suite for validating Veeva content tokens.
 */
const { GRADE } = require('../../src/util/logging')
const { validate: lint } = require('../../src/token/content')
const { TYPES } = require('../../src/util/token-types')

const validate = (token) => {
  return lint({
    type: TYPES.CONTENT,
    value: token,
  })
}

test('Short hand notation tokens', () => {
  expect(validate('{{accTitle}}')).toBe(undefined)
  expect(validate('{{accFname}}')).toBe(undefined)
  expect(validate('{{accLname}}')).toBe(undefined)
  expect(validate('{{accCredentials}}')).toBe(undefined)
  expect(validate('{{userEmailAddress}}')).toBe(undefined)
  expect(validate('{{userName}}')).toBe(undefined)
  expect(validate('{{userPhoto}}')).toBe(undefined)
  expect(validate('{{parentCallDatetime}}')).toBe(undefined)
})

test('Invalid content tokens', () => {
  expect(validate('{accTitle}}').grade).toBe(GRADE.ERROR)
  expect(validate('{{accFname}').grade).toBe(GRADE.ERROR)
  expect(validate('{{{accLname}}').grade).toBe(GRADE.ERROR)
  expect(validate('{{accCredentials}}}').grade).toBe(GRADE.ERROR)
  expect(validate('{[userEmailAddress]}').grade).toBe(GRADE.ERROR)
  expect(validate('{{USERNAME}}').grade).toBe(GRADE.ERROR)
  expect(validate('{{USERPhoto}}').grade).toBe(GRADE.ERROR)
  expect(validate('{{parentCallDateTime}}').grade).toBe(GRADE.ERROR)
})
