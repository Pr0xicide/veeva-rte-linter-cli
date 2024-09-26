const {
  getVeevaTokens,
} = require('veeva-approved-email-util/lib/tokens/retrieve')
const {
  determineTokenCategory,
} = require('veeva-approved-email-util/lib/tokens/category')

const { lint } = require('../../src/file/email-fragment')
const { GRADE } = require('../../src/util/grading')

test('supported tokens categories', () => {
  const tokens = [
    '{{accLname}}',
    '{{addToCalendar}}',
    '{{$20}}',
    '{{unsubscribe_product_link}}',
    '{{FootnoteStart}}',
    '{{FootnoteEnd}}',
    '{{CitationStart}}',
    '{{CitationEnd}}',
  ]
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
  ]

  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  logs.forEach((veevaToken) => {
    expect(veevaToken.getGrade()).toBe(GRADE.ERROR)
  })
})

test('supported tokens', () => {
  const tokens = [
    '{{addToCalendar}}',
    '{{approvedEmailAction}}',
    '{{schedulerLink}}',
  ]
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
    '{{customText[1|2]}}',
  ]

  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  logs.forEach((veevaToken) => {
    expect(veevaToken.getGrade()).toBe(GRADE.ERROR)
  })
})

test('duplicate tokens', () => {
  const tokens = [
    '{{FootnoteStart}}',
    '{{FootnoteStart}}', // duplicate token
    '{{FootnoteEnd}}',
    '{{FootnoteEnd}}', // duplicate token
    '{{CitationStart}}',
    '{{CitationStart}}', // duplicate token
  ]

  const veevaTokens = getVeevaTokens(tokens.join(' '))
  determineTokenCategory(veevaTokens)

  const logs = lint(veevaTokens)
  logs.forEach((veevaToken) => {
    expect(veevaToken.getGrade()).toBe(GRADE.ERROR)
  })
})
