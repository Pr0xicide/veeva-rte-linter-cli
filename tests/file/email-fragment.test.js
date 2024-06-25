const { GRADE } = require('../../src/util/logging')
const { TYPES } = require('../../src/util/token-types')
const { validate } = require('../../src/file/email-fragment')

test('Tokens that are supported in email fragments', () => {
  const tokens = [{ type: TYPES.CONTENT }, { type: TYPES.VAULT }]

  expect(validate(tokens).length).toBe(0)
})

test("Tokens that aren't supported in email fragments", () => {
  const tokens = [
    { type: TYPES.CONTENT, name: '{{accLname}}' },
    { type: TYPES.EMAIL_FRAGMENT, name: '{{insertEmailFragments}}' },
    { type: TYPES.TEMPLATE_FRAGMENT, name: '{{emailTemplateFragment}}' },
  ]

  expect(validate(tokens).length).toBe(2)
  expect(validate(tokens)[0].grade).toBe(GRADE.CRITICAL)
  expect(validate(tokens)[1].grade).toBe(GRADE.CRITICAL)
})
