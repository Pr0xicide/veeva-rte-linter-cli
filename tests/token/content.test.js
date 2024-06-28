/**
 * Test suite for validating Veeva content tokens.
 */
const { GRADE } = require('../../src/util/logging')
const { validate } = require('../../src/token/content')
const { TYPES } = require('../../src/util/token-types')

test('Short hand notation tokens', () => {
  expect(
    validate({
      type: TYPES.CONTENT,
      value: '{{accTitle}}',
    })
  ).toBe(undefined)
})
