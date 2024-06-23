const fs = require('fs')
const { createLogger, format, transports } = require('winston')

const MESSAGES = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
}
const logger = createLogger({
  levels: MESSAGES,
  format: format.cli(),
  transports: [new transports.Console()],
})

/**
 *
 * Lints the HTML file provided in the filePath argument.
 *
 * @param {String} filePath - path to HTML file to lint
 * @returns {void}
 */
const lintHTMLFile = (filePath) => {
  try {
    fs.readFile(filePath, 'utf8', (err, sourceHTML) => {
      // If HTML file does not exists or is not valid.
      if (err) {
        logger.error(`No file found at '${filePath}'`)
        throw new Error('')
      }

      // Determine token types in HTML source code.
    })
  } catch (error) {
    console.error(error)
  }
}

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
    console.error(
      `ERROR: Invalid number of arguments provided. Expecting 2 arguments but received ${parameters.length}`
    )
    return
  }

  // Validate RTE file type (template, email fragment, template fragment).

  // Begin linting.
  // lintHTMLFile(filePath)
}

if (process.argv.length > 2) validateCLIArugments(process.argv)
else logger.error('Invalid input: expecting 2 parameters')
