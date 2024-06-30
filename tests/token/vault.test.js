/**
 * Test suite for validating Veeva content tokens.
 */
const { GRADE } = require('../../src/util/logging')
const { lint: validate } = require('../../src/token/vault')
const { TYPES } = require('../../src/util/token-types')

const lint = (token) => {
  return validate({
    type: TYPES.VAULT,
    value: token,
  })
}

test('Standard vault tokens', () => {
  expect(lint('{{engageLink}}')).toBe()
  expect(lint('{{ISILink}}')).toBe()
  expect(lint('{{PieceLink}}')).toBe()
  expect(lint('{{PILink}}')).toBe()
  expect(lint('{{surveyLink}}')).toBe()
})

test('Vault document tokens with IDs', () => {
  expect(lint('{{$20}}')).toBe()
  expect(lint('{{$sdf}}').grade).toBe(GRADE.CRITICAL)
  expect(lint('{{$s23df}}').grade).toBe(GRADE.CRITICAL)
  expect(lint('{{$ten}}').grade).toBe(GRADE.CRITICAL)
})
