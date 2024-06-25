const fs = require('fs')
const { createLogger, format, transports } = require('winston')
const {
  main: { getVeevaTokens },
} = require('veeva-approved-email-util')
const { FILE_TYPES } = require('./src/util/cli')
const { MESSAGE_LEVELS } = require('./src/util/logging')
const { determineTokenType } = require('./src/token/type')

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

  // Validate RTE file type (template, email fragment, template fragment).
  if (FILE_TYPES.indexOf(fileType)) {
    logger.error(
      'Invalid file type argument provided. Expecting either "et", "ef", or "tf".'
    )
    return
  }

  // Validate file path is leading towards a HTML file.
  if (filePath.indexOf('.html') < 0) {
    logger.error(
      'Invalid file path argument. Expecting a path pointing a HTML file.'
    )
    return
  }

  // Valid CLI arguments, begin linting.
  lintHTMLFile(fileType, filePath)
}

/**
 *
 * Lints the HTML file provided in the CLI arguments.
 *
 * @param {String} fileType - RTE HTML file type
 * @param {String} filePath - path to HTML file to lint
 * @returns {void}
 */
const lintHTMLFile = (fileType, filePath) => {
  try {
    fs.readFile(filePath, 'utf8', (err, sourceHTML) => {
      if (err) throw new Error('')

      // Gather all tokens inside of the HTML source code.
      const veevaTokens = getVeevaTokens(sourceHTML)
      logger.info(
        `Retrieved ${veevaTokens.length} Veeva tokens in "${filePath}"`
      )

      // Determine token type.
      logger.info(`Determining token types found`)
      determineTokenType(veevaTokens)

      // Lint Veeva tokens.
      logger.info(`Linting Veeva tokens`)

      // Lint file type (template, fragment, template fragment).
      logger.info(`Linting Veeva tokens with the file type provided`)

      // Log final report to user.
    })
  } catch (error) {
    logger.error(`Failed to read file at "${fileType}"`)
  }
}

validateCLIArugments(process.argv)
