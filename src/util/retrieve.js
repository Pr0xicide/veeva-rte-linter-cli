const REGEX_VEEVA_TOKEN = /\{\{([^}]+)\}\}/g

/**
 * Retrieves an array of Veeva tokens located in the HTML source code enclosed in {{}} brackets.
 *
 * @param {String} sourceCode - HTML source code to read from fs.readFile
 * @returns {Array<{line:number, token:String}>} Array of objects containing details about each Veeva token found
 */
const getVeevaTokens = (sourceCode) => {
  // Invalid parameter provided.
  if (typeof sourceCode !== 'string') return false

  const tokenList = []
  const sourceCodeLines = sourceCode.split('\n')

  // Loop through each line of code and detect any tokens.
  sourceCodeLines.forEach((line, index) => {
    const veevaTokens = line.match(REGEX_VEEVA_TOKEN)
    if (veevaTokens && veevaTokens.length > 0) {
      veevaTokens.forEach((token) => {
        tokenList.push({
          line: index + 1,
          token,
        })
      })
    }
  })

  return tokenList
}

module.exports = {
  getVeevaTokens,
}
