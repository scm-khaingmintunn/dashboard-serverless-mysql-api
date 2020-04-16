'use strict'

const CustomErrors = require('../utils/custom.errors')
const CustomError = CustomErrors.CustomError

class AbstractService {
  static success(statusCode, result, headers) {
    if (!statusCode)
      statusCode =
        result === '' || result === null || result === undefined ? 204 : 200

    const response = {
      body: {
        statusCode: statusCode,
        errors: [],
      },
      headers: headers,
    }

    if (typeof result === 'object')
      response.body = { ...response.body, ...result }

    return response
  }

  static failed(error, message, statusCode, errors, headers) {
    if (!statusCode) statusCode = 500

    let customError
    if (error instanceof CustomError) customError = error
    else {
      console.log(error)
      customError = new CustomError(message, statusCode, errors)
    }

    const response = {
      body: {
        statusCode: customError.statusCode,
        errors: customError.errors,
      },
      headers: headers,
    }

    return response
  }

  static throwCustomError(error, message, statusCode, errors) {
    if (!statusCode) statusCode = 500

    if (error instanceof CustomError) throw error
    else {
      console.log(error)
      throw new CustomError(message, statusCode, errors)
    }
  }
}

module.exports = AbstractService
