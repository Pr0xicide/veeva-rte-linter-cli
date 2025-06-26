const { GRADE } = require('../grading')

const standardTokens = [
  '{{insertSignature}}',
  '{{insertOrderLine}}',
  // "{{insertMedicalInquiry[Column1,Column2(FORMAT)]}}",
  // "{{insertCallSample[Column1,Column2]}}",
  // "{{insertCallSample[Column1,Column2(FORMAT)]}}",
  // "{{insertCallSample[filterProductType=TYPE,Column1,Column2]}}",
  // "{{insertMedicalInquiry[Column1,Column2]}}",
]

const lint = (veevaToken) => {}

module.exports = {
  lint,
}
