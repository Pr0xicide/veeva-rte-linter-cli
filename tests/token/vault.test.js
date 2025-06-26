const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('../../src/util/grading')
const { lint: validate } = require('../../src/token/vault')

const lint = (token) => {
  return validate({
    category: CATEGORY_TYPES.VAULT,
    line: 1,
    token: token,
  })
}

test('Standard vault tokens', () => {
  expect(lint('{{engageLink}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{ISILink}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{PieceLink}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{PILink}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{surveyLink}}').getGrade()).toBe(GRADE.PASS)
})

test('Vault document tokens with IDs', () => {
  expect(lint('{{$20}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{$sdf}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{$s23df}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{$ten}}').getGrade()).toBe(GRADE.ERROR)
})
