const { GRADE } = require('../util/grading')

/**
 * Parent class for all token messages for logging purposes.
 */
class TokenMessage {
  constructor(messageObj) {
    const { grade, message } = messageObj
    this.grade = grade
    this.message = message ? message : ''
  }

  /**
   * Returns the grade of the token.
   * @returns {GRADE}
   */
  getGrade = () => {
    return this.grade
  }

  /**
   * Returns the warning/error message to display to the user.
   * @returns {String}
   */
  getMessage = () => {
    return this.message
  }
}

class VerifiedTokenMessage extends TokenMessage {
  constructor() {
    super({
      grade: GRADE.PASS,
    })
  }
}

class UnknownTokenMessage extends TokenMessage {
  constructor(messageObj) {
    const { line, token } = messageObj
    super({
      grade: GRADE.ERROR,
      token,
      token,
    })

    this.line = line
    this.token = token
  }

  /**
   * Returns the warning/error message to display to the user.
   * @returns {String}
   */
  getMessage = () => {
    return `Unknown token "${this.token}" found on line ${this.line}, refer to https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/ConfigTokens.htm for a full list of Veeva supported tokens\n`
  }
}

class InvalidTokenMessage extends TokenMessage {
  constructor(messageObj) {
    super(messageObj)

    const { line, token } = messageObj
    this.line = line
    this.token = token
  }

  /**
   * Returns the warning/error message to display to the user.
   * @returns {String}
   */
  getMessage = () => {
    return `line: ${this.line}\t${this.token}\n\t ${this.message}\n`
  }
}

class DuplicateTokenCategoryMessage extends TokenMessage {
  constructor(messageObj) {
    const { fileType, category, duplicateCategories, message } = messageObj
    super({
      grade: GRADE.ERROR,
      message,
    })

    this.fileType = fileType
    this.category = category
    this.duplicateCategories = duplicateCategories
  }

  /**
   * Returns a message with all duplicate tokens found.
   * @returns {String}
   */
  getMessage = () => {
    let msg = `Can only have only 1 ${this.category} token in ${this.fileType}, but found ${this.duplicateCategories.length}:\n`

    // Print out the line for each duplicate category found.
    this.duplicateCategories.forEach((token) => {
      msg += `\t line ${token.line}: ${token.token} \n`
    })

    return msg
  }
}

class DuplicateTokenMessage extends TokenMessage {
  constructor(messageObj) {
    const { fileType, duplicateTokens, message, token } = messageObj
    super({
      grade: GRADE.ERROR,
      message,
    })

    this.fileType = fileType
    this.token = token
    this.duplicateTokens = duplicateTokens
  }

  /**
   * Returns a message with all duplicate tokens found.
   * @returns {String}
   */
  getMessage = () => {
    let msg = `Can only have only 1 instance of the "${this.token}" token in ${this.fileType}, but found ${this.duplicateTokens.length}:\n`

    // Print out the location for each duplicate token found.
    this.duplicateTokens.forEach((token) => {
      msg += `\t line ${token.line}: ${token.token} \n`
    })

    return msg
  }
}

module.exports = {
  TokenMessage,
  VerifiedTokenMessage,
  UnknownTokenMessage,
  InvalidTokenMessage,
  DuplicateTokenCategoryMessage,
  DuplicateTokenMessage,
}
