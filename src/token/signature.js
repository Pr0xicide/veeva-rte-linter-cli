const { GRADE, createLogMessage } = require('../util/logging')

const standardTokens = [
  '{{insertSignature}}',
  '{{insertOrderLine}}',
  // "{{insertMedicalInquiry[Column1,Column2(FORMAT)]}}",
  // "{{insertCallSample[Column1,Column2]}}",
  // "{{insertCallSample[Column1,Column2(FORMAT)]}}",
  // "{{insertCallSample[filterProductType=TYPE,Column1,Column2]}}",
  // "{{insertMedicalInquiry[Column1,Column2]}}",
]

const validate = (veevaToken) => {}

module.exports = {
  validate,
}
