/**
 * Test suite for validating Veeva content tokens.
 */
const { GRADE } = require('../../src/util/logging')
const { lint: validate } = require('../../src/token/content')
const { TYPES } = require('../../src/util/token-types')

const lint = (token) => {
  return validate({
    type: TYPES.CONTENT,
    value: token,
  })
}

test('Short hand notation tokens', () => {
  expect(lint('{{accTitle}}')).toBe(undefined)
  expect(lint('{{accFname}}')).toBe(undefined)
  expect(lint('{{accLname}}')).toBe(undefined)
  expect(lint('{{accCredentials}}')).toBe(undefined)
  expect(lint('{{userEmailAddress}}')).toBe(undefined)
  expect(lint('{{userName}}')).toBe(undefined)
  expect(lint('{{userPhoto}}')).toBe(undefined)
  expect(lint('{{parentCallDatetime}}')).toBe(undefined)
})

test('Invalid content tokens', () => {
  expect(lint('{accTitle}}').grade).toBe(GRADE.ERROR)
  expect(lint('{{accFname}').grade).toBe(GRADE.ERROR)
  expect(lint('{{{accLname}}').grade).toBe(GRADE.ERROR)
  expect(lint('{{accCredentials}}}').grade).toBe(GRADE.ERROR)
  expect(lint('{[userEmailAddress]}').grade).toBe(GRADE.ERROR)
  expect(lint('{{USERNAME}}').grade).toBe(GRADE.ERROR)
  expect(lint('{{USERPhoto}}').grade).toBe(GRADE.ERROR)
  expect(lint('{{parentCallDateTime}}').grade).toBe(GRADE.ERROR)
})
