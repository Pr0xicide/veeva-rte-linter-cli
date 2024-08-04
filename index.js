#!/usr/bin/env node
'use strict'

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
const { lintSourceFile } = require('./src/file/lint')
const {
  TokenMessage,
} = require('veeva-approved-email-util/lib/linting/message')

const MAX_FILE_SIZE = 131072
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

  // Validate CLI arguments.
  if (parameters.length < 2) {
    logger.error(
      `Invalid number of arguments provided. Expecting 2 arguments but received ${parameters.length}.`
    )
    process.exit(1)
  } else if (!FILE_TYPES[fileType]) {
    logger.error(
      `Invalid file type argument "${fileType}" provided, expecting either "et", "ef", or "tf".`
    )
    process.exit(1)
  } else if (filePath.indexOf('.html') < 0) {
    logger.error(
      'Invalid file path argument, expecting a path to point a HTML file.'
    )
    process.exit(1)
  }

  // Begin linting HTML file.
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

      // Determine token category.
      logger.info(`Determining token categories found in "${filePath}"`)
      determineTokenCategory(veevaTokens)

      // Lint Veeva tokens.
      logger.info(`Linting all ${veevaTokens.length} Veeva tokens found`)
      const veevaTokenMsgs = lintVeevaTokens(veevaTokens)
      outputLog(veevaTokenMsgs)

      // Lint file type (template, email fragment, template fragment).
      logger.info(`Linting file type`)
      const veevaFileMsgs = lintSourceFile(FILE_TYPES[fileType], veevaTokens)
      outputLog(veevaFileMsgs)

      let messageCount = veevaTokenMsgs.length + veevaFileMsgs.length

      // Detect file size of email template.
      const fileSize = fs.statSync(filePath).size
      if (fileType === 'et' && fileSize > MAX_FILE_SIZE) {
        logger.error(
          `Email template HTML file "${filePath}" exceeds the maximum limit of ${MAX_FILE_SIZE} characters https://support.veeva.com/hc/en-us/articles/11330539418523-What-is-the-Maximum-Length-on-Veeva-Approved-Emails-in-Vault`
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
    console.error(error)
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

validateCLIArugments(process.argv)
