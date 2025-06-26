const {
  getVeevaTokens,
} = require('veeva-approved-email-util/lib/tokens/retrieve')
const {
  determineTokenCategory,
} = require('veeva-approved-email-util/lib/tokens/category')

const { lint } = require('../../src/file/email-template')
const { GRADE } = require('../../src/util/grading')

test('supported tokens', () => {
  const tokens = [
    '{{accLname}}',
    '{{insertEmailFragments}}',
    '{{emailTemplateFragment}}',
    '{{InsertFootnotes}}',
    '{{InsertCitations}}',
    '{{InsertCitationSummaries}}',
  ]

  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  expect(logs.length).toBe(0)
})

test('duplicate token categories', () => {
  const tokens = [
    '{{insertEmailFragments}}',
    '{{insertEmailFragments[1,2]}}', //
    '{{insertEmailFragments[2,2]}}', // duplicate category
    '{{emailTemplateFragment}}',
    '{{emailTemplateFragment}}', // duplicate category
    '{{unsubscribe_product_link}}',
  ]
  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)
  const logs = lint(veevaTokens)

  expect(logs.length).toBe(2)
  logs.forEach((log) => {
    expect(log.getGrade()).toBe(GRADE.ERROR)
  })
})

test('duplicate tokens', () => {
  const tokens = [
    '{{InsertFootnotes}}',
    '{{InsertFootnotes}}', // duplicate token
    '{{InsertCitations}}',
    '{{InsertCitations}}', // duplicate token
    '{{InsertCitationSummaries}}',
    '{{InsertCitationSummaries}}', // duplicate token
  ]

  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)
  const logs = lint(veevaTokens)

  logs.forEach((log) => {
    expect(log.getGrade()).toBe(GRADE.ERROR)
  })
})
