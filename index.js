const fs = require('fs')
const { createLogger, format, transports } = require('winston')
const {
  getVeevaTokens,
} = require('veeva-approved-email-util/lib/tokens/retrieve')
const {
  determineTokenCategory,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('veeva-approved-email-util/lib/linting/grading')
const { FILE_TYPES } = require('./src/util/cli')
const { MESSAGE_LEVELS } = require('./src/util/logging')
const { lintVeevaTokens } = require('./src/token/lint')
const { lintFile } = require('./src/file/lint')

const logger = createLogger({
  levels: MESSAGE_LEVELS,
  format: format.cli(),
  transports: [new transports.Console()],
})

/**
 * Validates user input before executing the linter.
 *
 * @param {Array<String>} CLIAgruments array of command line arguments
 * @returns {void}
 */
const validateCLIArugments = (CLIAgruments) => {
  const parameters = CLIAgruments.slice(2)
  const fileType = parameters[0]
  const filePath = parameters[1]

  // Incorrect number of arugments provided.
  if (parameters.length < 2) {
    logger.error(
      `Invalid number of arguments provided. Expecting 2 arguments but received ${parameters.length}.`
    )
    return
  }

  // Validate RTE file type parameter.
  if (!FILE_TYPES[fileType]) {
    logger.error(
      `Invalid file type argument "${fileType}" provided, expecting either "et", "ef", or "tf".`
    )
    return
  }

  // Validate file parameter.
  if (filePath.indexOf('.html') < 0) {
    logger.error(
      'Invalid file path argument, expecting a path to point a HTML file.'
    )
    return
  }

  // Valid CLI arguments, begin linting.
  lintHTMLFile(fileType, filePath)
}

/**
 * Lints the HTML file provided in the CLI arguments.
 *
 * @param {FILE_TYPES} fileType - RTE HTML file type
 * @param {String} filePath - path to HTML file to lint
 * @returns {void}
 */
const lintHTMLFile = (fileType, filePath) => {
  try {
    fs.readFile(filePath, 'utf8', (err, sourceHTML) => {
      if (err) throw new Error(`Failed to read file "${filePath}"`)

      // Gather all tokens inside of the HTML source code.
      const veevaTokens = getVeevaTokens(sourceHTML)
      logger.info(
        `Retrieved ${veevaTokens.length} Veeva email tokens in "${filePath}"`
      )

      // Determine token type.
      logger.info(`Determining token categories found in "${filePath}"`)
      determineTokenCategory(veevaTokens)

      // Lint Veeva tokens.
      logger.info(`Linting all ${veevaTokens.length} Veeva tokens found`)
      const veevaTokenMsgs = lintVeevaTokens(veevaTokens)
      outputLog(veevaTokenMsgs)

      // Lint file type (template, fragment, template fragment).
      logger.info(`Linting file type`)
      const veevaFileMsgs = lintFile(FILE_TYPES[fileType], veevaTokens)
      outputLog(veevaFileMsgs)

      const messageCount = veevaTokenMsgs.length + veevaFileMsgs.length
      logger.info(
        `Done linting "${filePath}" with ${messageCount} issues/warnings found`
      )
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * Outputs feedback to the terminal window.
 *
 * @param {Array<object>} messages Array of messages to output
 * @returns {void}
 */
const outputLog = (messages) => {
  messages.forEach((msg) => {
    const { grade, line, token, message } = msg
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

validateCLIArugments(process.argv)
