const { getVeevaTokens } = require('../../src/util/retrieve')

test('detecting a token', () => {
  const tokens = getVeevaTokens('{{test}}')
  expect(tokens.length).toEqual(1)
  expect(tokens[0].token).toEqual('{{test}}')
})

test('detecting multiple tokens in a line', () => {
  const tokens = getVeevaTokens('{{test}} {{test2}} {{test3}}')
  expect(tokens.length).toEqual(3)
  expect(tokens[0].token).toEqual('{{test}}')
  expect(tokens[1].token).toEqual('{{test2}}')
  expect(tokens[2].token).toEqual('{{test3}}')
})

test('detecting multiple tokens on multiple lines', () => {
  const tokens = getVeevaTokens('{{test}} \n {{test2}} \n {{test3}}')
  expect(tokens.length).toEqual(3)
  expect(tokens[0].token).toEqual('{{test}}')
  expect(tokens[1].token).toEqual('{{test2}}')
  expect(tokens[2].token).toEqual('{{test3}}')
})
