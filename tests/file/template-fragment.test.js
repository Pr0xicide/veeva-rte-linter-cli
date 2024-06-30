const { GRADE } = require('../../src/util/logging')
const { TYPES } = require('../../src/util/token-types')
const { validate } = require('../../src/file/template-fragment')

test('Tokens that are supported in template fragments', () => {
  const tokens = [{ type: TYPES.CONTENT }]

  expect(validate(tokens).length).toBe(0)
})

test("Tokens that aren't supported in email fragments", () => {
  const tokens = [
    { type: TYPES.CONTENT, line: 1, name: '{{accLname}}' },
    { type: TYPES.EMAIL_FRAGMENT, line: 1, name: '{{insertEmailFragments}}' },
    {
      type: TYPES.TEMPLATE_FRAGMENT,
      line: 1,
      name: '{{emailTemplateFragment}}',
    },
  ]

  expect(validate(tokens).length).toBe(2)
  expect(validate(tokens)[0].grade).toBe(GRADE.ERROR)
  expect(validate(tokens)[1].grade).toBe(GRADE.ERROR)
})
