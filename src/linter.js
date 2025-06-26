const fs = require('fs')
const { createLogger, format, transports } = require('winston')
const { getVeevaTokens } = require('./util/retrieve')
const { determineTokenCategory } = require('./util/category')
const {
  TokenMessage,
} = require('veeva-approved-email-util/lib/linting/message')
const { GRADE } = require('veeva-approved-email-util/lib/linting/grading')

const { FILE_TYPES } = require('./util/cli')
const { MESSAGE_LEVELS } = require('./util/logging')
const { lintVeevaTokens } = require('./token/lint')
const { lintSourceFile } = require('./file/lint')

let debugMode = false
const MAX_FILE_LENGTH = 131072 // Source: https://support.veeva.com/hc/en-us/articles/11330539418523-What-is-the-Maximum-Length-on-Veeva-Approved-Emails-in-Vault
const logger = createLogger({
  levels: MESSAGE_LEVELS,
  format: format.cli(),
  transports: [new transports.Console()],
})

/**
 * Validates CLI user input before proceeding to lint.
 *
 * @param {{fileType: FILE_TYPES, filePath:String}} params CLI arguments
 * @returns {void}
 */
const validateInput = (params) => {
  const { fileType, filePath, debug } = params

  debugMode = debug

  // Proper file type option provided by the user.
  if (!FILE_TYPES[fileType]) {
    logger.error(
      `Invalid file type "${fileType}" provided, expecting either "et", "ef", or "tf".`
    )
    process.exit(9)
  }

  // Correct file extention (HTML).
  if (filePath.indexOf('.html') < 0) {
    logger.error(
      'Invalid file type, expecting a path to point a file with the .html file extention.'
    )
    process.exit(9)
  }

  // Begin linting the HTML file.
  lintHTMLFile(params)
}

/**
 * Lints the HTML file provided in the CLI arguments.
 *
 * @param {{fileType: FILE_TYPES, filePath:String}} params CLI arguments
 * @returns {void}
 */
const lintHTMLFile = (params) => {
  const { fileType, filePath } = params

  try {
    fs.readFile(filePath, 'utf8', (err, sourceHTML) => {
      if (err) throw new Error(`Failed to read file "${filePath}"`)

      let messageCount = 0

      // Detect file size of email template.
      debugMode && logger.info(`Linting HTML file size`)
      const fileSize = fs.statSync(filePath).size
      if (fileSize > MAX_FILE_LENGTH) {
        logger.error(
          `File "${filePath}" exceeds the maximum limit of ${MAX_FILE_LENGTH} characters, refer to https://support.veeva.com/hc/en-us/articles/11330539418523-What-is-the-Maximum-Length-on-Veeva-Approved-Emails-in-Vault`
        )
        messageCount++
      }

      // Gather all tokens inside of the HTML source code.
      const veevaTokens = getVeevaTokens(sourceHTML)
      debugMode &&
        logger.info(
          `Retrieved ${veevaTokens.length} Veeva email tokens in "${filePath}"`
        )

      // Determine token categories.
      debugMode &&
        logger.info(`Determining token categories found in "${filePath}"`)
      determineTokenCategory(veevaTokens)
      debugMode && console.log(veevaTokens)

      // Lint file type first
      debugMode &&
        logger.info(
          `Linting all ${veevaTokens.length} Veeva tokens to see if they are supported in "${FILE_TYPES[fileType]}s"`
        )
      const veevaFileMsgs = lintSourceFile(FILE_TYPES[fileType], veevaTokens)
      outputLog(veevaFileMsgs)

      // Then lint Veeva tokens
      debugMode &&
        logger.info(`Linting all ${veevaTokens.length} Veeva tokens found`)
      const veevaTokenMsgs = lintVeevaTokens(veevaTokens)
      debugMode && console.log(veevaTokenMsgs)
      outputLog(veevaTokenMsgs)

      messageCount += veevaTokenMsgs.length + veevaFileMsgs.length

      // Final report.
      logFinalReport({
        fileType,
        filePath,
        errors: messageCount,
      })
    })
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

/**
 * Outputs feedback (if any) to the terminal for the user to read.
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

/**
 * Logs the final report of the linting process.
 * @param {*} param
 */
const logFinalReport = (param) => {
  const { filePath, fileType, errors } = param

  if (errors > 0) {
    logger.info(
      `Done linting ${FILE_TYPES[fileType]} file "${filePath}", with ${errors} error(s)/warning(s) found/reported.`
    )
    process.exit(1)
  } else {
    logger.info(
      `Done linting ${FILE_TYPES[fileType]} file "${filePath}", with no issues found/reported.`
    )
    process.exit(0)
  }
}

module.exports = {
  validateInput,
}
