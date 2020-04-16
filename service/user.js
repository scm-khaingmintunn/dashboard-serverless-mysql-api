'use strict'

const Abstract = require('./abstract')
const Model = require('../model')
const CustomErrors = require('../utils/custom.errors')
const CustomError = CustomErrors.CustomError

class UserService extends Abstract {
  /**
   * user create
   */
  static async create(req) {
    try {
      let params = { ...req.body }
      const exist_users = await Model.User.getByEmail(params.email)
      if (exist_users.length > 0)
        throw new CustomError('Email is already taken.', 422)
      const user = await Model.User.create(params)

      return super.success(200, { user })
    } catch (error) {
      return super.failed(
        error,
        'An error occured during user creating process.'
      )
    }
  }
}

module.exports = UserService
