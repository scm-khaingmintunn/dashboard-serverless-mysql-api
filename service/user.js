'use strict'

const Abstract = require('./abstract')
const Model = require('../model')
const CustomUtils = require('../utils/custom.utils')
const CustomErrors = require('../utils/custom.errors')
const CustomError = CustomErrors.CustomError

class UserService extends Abstract {
  static async authenticate(params) {
    try {
      const access_token = CustomUtils.getAccessToken(params)
      if (!access_token) throw new CustomError('Please login first.', 401)

      const token = await Model.Token.getByTokenStr(access_token)
      if (!token)
        throw new CustomError('Retry login, token does not exist.', 403)
      if (token && token.token_type !== Model.Token.token_type.ACCESS_TOKEN)
        throw new CustomError('Invalid token.', 403)

      const user = await Model.User.getByUserId(token.created_user_id)
      if (!user) throw new CustomError('User not found.', 404)
      if (user && user.auth_status !== Model.User.auth_status.AUTH)
        throw new CustomError('User have no authenticated access.', 401)
      if (user && user.suspend_status === Model.User.suspend_status.SUSPEND)
        throw new CustomError('User is suspended by admin', 422)

      console.log(user, 'user')
      return user
    } catch (error) {
      return super.failed(
        error,
        'An error occured during get user authentication process.'
      )
    }
  }

  static async adminAuthecticate(params) {
    try {
      const user = await this.authenticate(params)
      if (user.user_type !== Model.User.user_type.ADMIN)
        throw new CustomError('Permission denied', 422)

      return user
    } catch (error) {
      return super.failed(
        error,
        'An error occured during get admin authentication process.'
      )
    }
  }

  static async userAuthecticate(params) {
    try {
      const user = await this.authenticate(params)
      if (user.user_type === Model.User.user_type.ADMIN)
        throw new CustomError('Permission denied', 422)

      return user
    } catch (error) {
      return super.failed(
        error,
        'An error occured during get user authentication process.'
      )
    }
  }

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

  static async getAll() {
    try {
      const users = await Model.User.getAll()

      return super.success(200, { users })
    } catch (error) {
      return super.failed(
        error,
        "An error occured during get all user's data process."
      )
    }
  }

  static async login(req) {
    try {
      let params = { ...req.body }
      const user = await Model.User.getByLogin(params)

      const token_params = {
        token_type: Model.Token.token_type.ACCESS_TOKEN,
        created_user_id: user.user_id,
      }
      const token = await Model.Token.create(token_params)

      return super.success(200, { user, token })
    } catch (error) {
      return super.failed(error, 'An error occured during login process.')
    }
  }
}

module.exports = UserService
