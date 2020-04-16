'use strict'

const validator = require('validator')

class CustomValidator {
  static isRequired(value, field) {
    let error = null
    if (!value)
      error = {
        field,
        message: `${field} is required.`,
      }

    return error
  }

  static isLength(value, field, min, max) {
    if (!value) return null
    let error = null
    if (value.length < min || value.length > max)
      error = {
        field,
        message: `${field} lenght must be between ${min} and ${max}.`,
      }

    return error
  }

  static isEmail(value, field) {
    if (!value) return null
    let error = null
    if (!validator.isEmail(value))
      error = {
        field,
        message: `${field} must be email format.`,
      }

    return error
  }
}

module.exports = CustomValidator
