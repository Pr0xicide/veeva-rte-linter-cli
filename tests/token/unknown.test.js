const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('../../src/util/grading')
const { UnknownTokenMessage } = require('../../src/util/message')

test('Unknown Veeva token message', () => {
  const unknownToken = {
    line: 1,
    category: CATEGORY_TYPES.UNKNOWN,
    token: '{{fakeToken}}',
  }
  const msg = new UnknownTokenMessage(unknownToken)
  expect(msg.getGrade()).toBe(GRADE.ERROR)
  expect(msg.getMessage()).toBeDefined()
})
