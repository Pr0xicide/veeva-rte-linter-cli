const {
  getVeevaTokens,
} = require('veeva-approved-email-util/lib/tokens/retrieve')
const {
  determineTokenCategory,
} = require('veeva-approved-email-util/lib/tokens/category')

const { lint } = require('../../src/file/template-fragment')
const { GRADE } = require('../../src/util/grading')

test('supported tokens categories', () => {
  const tokens = ['{{accLname}}', '{{approvedEmailAction}}']
  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  expect(logs.length).toBe(0)
})

test('unsupported tokens categories', () => {
  const tokens = [
    '{{customText(1)}}',
    '{{insertConsentLines}}',
    '{{insertSignature}}',
    '{{$20}}',
    '{{insertEmailFragments}}',
    '{{emailTemplateFragment}}',
    '{{CitationStart}}',
    '{{FootnoteStart}}',
  ]

  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  logs.forEach((veevaToken) => {
    expect(veevaToken.getGrade()).toBe(GRADE.ERROR)
  })
})

test('supported tokens', () => {
  const tokens = ['{{approvedEmailAction}}', '{{schedulerLink}}']

  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  expect(logs.length).toBe(0)
})

test('unsupported tokens', () => {
  const tokens = [
    '{{EventSession}}',
    '{{EventSpeaker}}',
    '{{requiresReview}}',
    '{{insertEngageAndZoomJoinURL[]}}',
    '{{insertZoomDialInNumbers[]}}',
  ]
  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  logs.forEach((veevaToken) => {
    expect(veevaToken.getGrade()).toBe(GRADE.ERROR)
  })
})
