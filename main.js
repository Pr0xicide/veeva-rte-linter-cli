const fs = require('fs')
const { createLogger, format, transports } = require('winston')

const {
  GRADE,
  MESSAGE,
  FILE_TYPES,
  createLogMessage,
} = require('./src/util-logging')
const emailUtil = require('./src/util-email')
const tokenType = require('./src/token/token-type')
const tokenContent = require('./src/token/token-content')
const tokenInput = require('./src/token/token-input')
const tokenEmailFragment = require('./src/token/token-email-fragment')
const emailFragment = require('./src/file/email-fragment')
const templateFragment = require('./src/file/template-fragment')

const logger = createLogger({
  levels: MESSAGE,
  format: format.cli(),
  transports: [new transports.Console()],
})

/**
 * Iterates through all Veeva tokens and determines the token type based on the
 * source code.
 *
 * @param {Array} tokens - array of objects for all Veeva tokens from the getVeevaTokens function
 * @return {void}
 */
const determineTokenType = (tokens) => {
  tokens.forEach((token) => {
    const { name, line } = token

    if (tokenType.isTokenContentType(name)) {
      token.type = tokenType.TYPES.CONTENT
      token.validate = tokenContent.isValid // TODO: adjust later
    } else if (tokenType.isTokenInputType(name)) {
      token.type = tokenType.TYPES.USER_INPUT
      token.validate = tokenInput.isValid
    } else if (tokenType.isTokenEmailFragmentType(name)) {
      token.type = tokenType.TYPES.EMAIL_FRAGMENT
      token.validate = tokenEmailFragment.isValid
    } else if (tokenType.isTokenTemplateFragmentType(name)) {
      token.type = tokenType.TYPES.TEMPLATE_FRAGMENT
    } else if (tokenType.isTokenUnsubscribeType(name)) {
      token.type = tokenType.TYPES.UNSUBSCRIBE
    } else if (tokenType.isTokenVaultType(name)) {
      token.type = tokenType.TYPES.VAULT
    } else {
      token.type = tokenType.TYPES.UNKNOWN
    }

    logger.info(
      `Classifying token '${name}' as type of '${token.type}' on line ${line}.`
    )
  })
}

/**
 * Validates each reported Veeva token found within the source code.
 *
 * @param {Array} tokens - array of objects for all Veeva tokens from the getVeevaTokens function
 * @return {Array<{}>} returns tokens array passed in the parameter with a report
 */
const validateTokens = (tokens) => {
  for (let i = 0; i < tokens.length; i++) {
    const { name, type } = tokens[i]

    if (type === tokenType.TYPES.UNKNOWN) {
      tokens[i].report = [
        createLogMessage(
          GRADE.WARNING,
          'Warning: Unknown Veeva token detected.'
        ),
      ]
    }

    logger.info(`Validating token '${name}' as type '${type}'`)

    if (tokens[i].validate) {
      tokens[i].report = tokens[i].validate(name)
    }

    /**
     * Tokens types that have no additional validation.
     *
     * Since they were detected in the source code that's all the validation
     * required for these tokens.
     */
    switch (type) {
      case tokenType.TYPES.TEMPLATE_FRAGMENT:
        tokens[i].report = GRADE.PASS

      case tokenType.TYPES.UNSUBSCRIBE:
        tokens[i].report = GRADE.PASS
    }
  }

  return tokens
}

/**
 * Validates tokens if they are supported in various approved email file types.
 *
 * @param {Array} tokens - array of objects for all Veeva tokens from the getVeevaTokens function
 * @return {}
 */
const validateDuplicateTokens = (tokens) => {
  const feedback = []

  // Email fragments
  const emailFragmentCounter = tokens.filter((token) => {
    return token.type === tokenType.TYPES.EMAIL_FRAGMENT
  })
  if (emailFragmentCounter.length > 1) {
    feedback.push(
      createLogMessage(
        GRADE.CRITICAL,
        'Cannot have more than 1 email fragment area inside 1 email template'
      )
    )
  }

  // Template fragments
  const templatefragmentCounter = tokens.filter((token) => {
    return token.type === tokenType.TYPES.EMAIL_FRAGMENT
  })

  if (templatefragmentCounter.length > 1) {
    feedback.push(
      createLogMessage(
        GRADE.CRITICAL,
        'Cannot have more than 1 template fragments inside 1 email template'
      )
    )
  }

  return feedback.length === 0 ? GRADE.PASS : feedback
}

/**
 * Test tokens if they should belong in either email fragments or template fragments.
 *
 * @param {Array} tokens - array of objects for all Veeva tokens from the getVeevaTokens function
 * @param {Enumerator<FILE_TYPES>} fileType
 * @returns {}
 */
const validateFragmentFiles = (tokens, fileType) => {
  let feedback = []

  if (fileType === FILE_TYPES.EMAIL_FRAGMENT)
    feedback = emailFragment.validate(tokens)
  else if (fileType === FILE_TYPES.TEMPLATE_FRAGMENT)
    feedback = templateFragment.validate(tokens)

  return feedback.length === 0 ? GRADE.PASS : feedback
}

/**
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
      const sourceCodeTokens = emailUtil.getVeevaTokens(sourceHTML)
      determineTokenType(sourceCodeTokens)

      lintReport(validateTokens(sourceCodeTokens), [
        validateDuplicateTokens(sourceCodeTokens),
        validateFragmentFiles(sourceCodeTokens),
      ])
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * Prints out warnings/errors to the user.
 *
 * @param {Array<object>} tokens array of Veeva tokens from getVeevaTokens function.
 * @param {Array<GRADE.PASS|object>} reports array of results from individual reports
 * @returns {void}
 */
const lintReport = (tokens, reports) => {
  const tokenFeedback = tokens.filter((token) => {
    return token.report !== GRADE.PASS
  })
  tokenFeedback.forEach((feedback) => {
    const message = `token '${feedback.name}' on line ${feedback.line} | ${feedback.report.message}`

    if (feedback.report.grade === GRADE.CRITICAL) logger.crit(message)
    else if (feedback.report.grade === GRADE.ERROR) logger.error(message)
    else if (feedback.report.grade === GRADE.WARNING) logger.warn(message)
  })

  reports.forEach((report) => {
    if (report !== GRADE.PASS) {
    }
  })
}

/**
 * Validates user input before executing the linter.
 *
 * @param {Array<String>} CLIAgruments array of command line arguments
 * @returns {void}
 */
const validateCLIArugments = (CLIAgruments) => {
  const parameters = CLIAgruments.slice(2)

  // If user doesn't have the correct number of arguments.
  if (parameters.length < 2) {
    console.error(
      `ERROR: Invalid number of arguments provided. Expecting 2 arguments but received ${parameters.length}`
    )
    return
  }

  // Validate RTE file type (template, email fragment, template fragment).
  if (!FILE_TYPES[parameters[0]]) {
    console.error(`ERROR: Invalid file type provided.`)
    return
  }

  // Begin linting.
  const filePath = parameters[1]
  lintHTMLFile(filePath)
}

if (process.argv.length > 2) validateCLIArugments(process.argv)
else logger.error('Invalid input: expecting 2 parameters')

module.exports = {
  determineTokenType: determineTokenType,
  validateTokens: validateTokens,
  validateDuplicateTokens: validateDuplicateTokens,
  validateFragmentFiles: validateFragmentFiles,
  validateCLIArugments: validateCLIArugments,
}
