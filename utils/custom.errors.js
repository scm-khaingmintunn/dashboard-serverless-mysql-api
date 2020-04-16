'use strict'

class CustomError extends Error {
  constructor(message, statusCode, errors) {
    super(message)

    errors = errors ? errors : [{ message: message }]
    this.name = 'CustomError'
    this.statusCode = statusCode ? statusCode : 500
    this.errors = errors
  }
}

module.exports.CustomError = CustomError
