const { GRADE } = require('../grading')

const standardTokens = [
  '{{unsubscribe_product_link}}',
  '{{EmailAddressUnsub}}',
  '{{emailProduct}}',
  '{{submitUnsub}}',
  '{{productModList}}',
  '{{submitPerfOptions}}',
  '{{cancel}}',
  '{{unsubscribeAll}}',
  // "{{unsubscribe_product_link[,Unsubscribe_vod.Unsubscribe_Identifier_vod]}}",
  // "{{unsubscribe_product_link[External URL,Unsubscribe_Identifier_vod]}}",
]

const lint = (veevaToken) => {}

module.exports = {
  lint,
}
