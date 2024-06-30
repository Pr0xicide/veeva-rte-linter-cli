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
  expect(lint('{{accTitle}}').grade).toBe(GRADE.PASS)
  expect(lint('{{accFname}}').grade).toBe(GRADE.PASS)
  expect(lint('{{accLname}}').grade).toBe(GRADE.PASS)
  expect(lint('{{accCredentials}}').grade).toBe(GRADE.PASS)
  expect(lint('{{userEmailAddress}}').grade).toBe(GRADE.PASS)
  expect(lint('{{userName}}').grade).toBe(GRADE.PASS)
  expect(lint('{{userPhoto}}').grade).toBe(GRADE.PASS)
  expect(lint('{{parentCallDatetime}}').grade).toBe(GRADE.PASS)
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
