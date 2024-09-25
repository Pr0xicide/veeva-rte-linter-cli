const fs = require('fs')
const { createLogger, format, transports } = require('winston')
const {
  getVeevaTokens,
} = require('veeva-approved-email-util/lib/tokens/retrieve')
const {
  determineTokenCategory,
} = require('veeva-approved-email-util/lib/tokens/category')
const {
  TokenMessage,
} = require('veeva-approved-email-util/lib/linting/message')
const { GRADE } = require('veeva-approved-email-util/lib/linting/grading')

const { FILE_TYPES } = require('./util/cli')
const { MESSAGE_LEVELS } = require('./util/logging')
const { lintVeevaTokens } = require('./token/lint')
const { lintSourceFile } = require('./file/lint')

const MAX_FILE_SIZE = 131072 // Source: https://support.veeva.com/hc/en-us/articles/11330539418523-What-is-the-Maximum-Length-on-Veeva-Approved-Emails-in-Vault
const logger = createLogger({
  levels: MESSAGE_LEVELS,
  format: format.cli(),
  transports: [new transports.Console()],
})

/**
 * Validates CLI user input before proceeding to lint.
 *
 * @param {string} filePath array of command line arguments
 * @param {FILE_TYPES} fileType array of command line arguments
 * @returns {void}
 */
const validateInput = (filePath, options) => {
  const fileType = options.type

  // Correct file extention (HTML).
  if (filePath.indexOf('.html') < 0) {
    logger.error(
      'Invalid file type, expecting a path to point a file with the .html file extention.'
    )
    process.exit(1)
  }

  // Proper file type option provided by the user.
  if (!FILE_TYPES[fileType]) {
    logger.error(
      `Invalid file type "${fileType}", expecting either "et", "ef", or "tf".`
    )
    process.exit(1)
  }

  // Begin linting the HTML file.
  lintHTMLFile(filePath, fileType)
}

/**
 * Lints the HTML file provided in the CLI arguments.
 *
 * @param {String} filePath - path to HTML file to lint
 * @param {FILE_TYPES} fileType - RTE HTML file type
 * @returns {void}
 */
const lintHTMLFile = (filePath, fileType) => {
  try {
    fs.readFile(filePath, 'utf8', (err, sourceHTML) => {
      if (err) throw new Error(`Failed to read file "${filePath}"`)

      // Gather all tokens inside of the HTML source code.
      const veevaTokens = getVeevaTokens(sourceHTML)
      logger.info(
        `Retrieved ${veevaTokens.length} Veeva email tokens in "${filePath}"`
      )

      // Determine token category.
      logger.info(`Determining token categories found in "${filePath}"`)
      determineTokenCategory(veevaTokens)

      // Lint Veeva tokens.
      logger.info(`Linting all ${veevaTokens.length} Veeva tokens found`)
      const veevaTokenMsgs = lintVeevaTokens(veevaTokens)
      outputLog(veevaTokenMsgs)

      // Lint file type (email template, email fragment, template fragment).
      logger.info(`Linting file type`)
      const veevaFileMsgs = lintSourceFile(FILE_TYPES[fileType], veevaTokens)
      outputLog(veevaFileMsgs)

      let messageCount = veevaTokenMsgs.length + veevaFileMsgs.length

      // Detect file size of email template.
      const fileSize = fs.statSync(filePath).size
      if (fileSize > MAX_FILE_SIZE) {
        logger.error(
          `HTML file "${filePath}" exceeds the maximum limit of ${MAX_FILE_SIZE} characters https://support.veeva.com/hc/en-us/articles/11330539418523-What-is-the-Maximum-Length-on-Veeva-Approved-Emails-in-Vault`
        )
        messageCount++
      }

      if (messageCount > 0) {
        logger.info(
          `Done linting "${filePath}" with ${messageCount} error(s)/warning(s) found`
        )
        process.exit(1)
      }
    })
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

/**
 * Outputs feedback to the terminal window.
 *
 * @param {Array<TokenMessage>} messages Array of messages to output
 * @returns {void}
 */
const outputLog = (messages) => {
  messages.forEach((msg) => {
    const { grade } = msg
    const output = msg.getMessage()

    switch (grade) {
      case GRADE.WARNING:
        logger.warn(output)
        break
      case GRADE.ERROR:
        logger.error(output)
        break
    }
  })
}

module.exports = {
  validateInput,
}
