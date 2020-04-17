'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const Abstract = require('./abstract')
const CustomValidator = require('../utils/custom.validator')
const CustomUtils = require('../utils/custom.utils')

class UserModel extends Abstract {
  constructor(params = {}) {
    super()

    this.user_id = params.user_id
    this.username = params.username
    this.email = params.email
    this.password = params.password
    this.auth_status = params.auth_status
    this.user_type = params.user_type
    this.suspend_status = params.suspend_status
    this.created = params.created
    this.updated = params.updated
  }

  /**
   * user create
   */
  static async create(params) {
    // validation
    const errors = this.createValidation(params)
    if (errors.length > 0) super.throwCustomError(errors, '', 400, errors)

    // get mysql connection
    const connection = await super.connection()
    const hash_password = await CustomUtils.hashPassword(params.password)
    const user = {
      user_id: uuidv4(),
      username: params.username,
      email: params.email,
      password: hash_password,
      auth_status: this.auth_status.AUTH,
      user_type: this.user_type.NORMALUSER,
      suspend_status: this.suspend_status.ACTIVE,
      created: moment().unix(),
      updated: null,
    }

    // query and db insert
    const query_str = `INSERT INTO users 
    (user_id, username, email, password, auth_status, user_type, suspend_status, created, updated) 
    VALUES ('${user.user_id}', '${user.username}', '${user.email}', '${user.password}', ${user.auth_status}, ${user.user_type}, ${user.suspend_status}, ${user.created}, ${user.updated})`
    await connection.query(query_str)

    return this.toModel(user)
  }

  static async getByEmail(email) {
    const connection = await super.connection()
    const query_str = `SELECT * FROM users WHERE email='${email}'`
    const user = await connection.query(query_str)

    return user
  }

  static async getByUserId(user_id) {
    const connection = await super.connection()
    const query_str = `SELECT * FROM users WHERE user_id='${user_id}'`
    const users = await connection.query(query_str)

    if (users.length < 0) return null
    else return this.toModel(users[0])
  }

  static async getAll() {
    const connection = await super.connection()
    const query_str = `SELECT * FROM users WHERE user_type!='${this.user_type.ADMIN}'`
    let users = await connection.query(query_str)

    const user_models = users.map(user => {
      return this.toModel(user)
    })

    return user_models
  }

  static async getByLogin(params) {
    const user = await this.getByEmail(params.email)
    // user not found
    if (user.length < 1) super.throwCustomError(user, 'User Not Found.', 404)
    // auth status is 0
    if (user[0].auth_status !== this.auth_status.AUTH)
      super.throwCustomError(
        this.auth_status.AUTH,
        'User is not authenticated.',
        401
      )
    // suspended by admin
    if (user[0].suspend_status === this.suspend_status.SUSPEND)
      super.throwCustomError(
        this.suspend_status.SUSPEND,
        'User is suspended by admin.',
        422
      )

    const isMatch = await CustomUtils.comparePassword(
      params.password,
      user[0].password
    )
    if (!isMatch) super.throwCustomError(isMatch, 'Incorrect password.', 422)

    return this.toModel(user[0])
  }

  /***************************************************************
   * validations
   ***************************************************************/
  static createValidation(params) {
    if (!params) {
      return [
        {
          message: 'There is no input.',
        },
      ]
    } else if (typeof params !== 'object') {
      return [
        {
          message: 'The parameter input format is incorrect',
        },
      ]
    }

    let messages = [
      CustomValidator.isRequired(params.username, 'username'),
      CustomValidator.isRequired(params.email, 'email'),
      CustomValidator.isRequired(params.password, 'password'),
      CustomValidator.isLength(params.username, 'username', 4, 20),
      CustomValidator.isLength(params.password, 'password', 8, 20),
      CustomValidator.isEmail(params.email, 'email'),
    ]

    const errors = messages.filter(message => {
      return message !== null
    })

    return errors
  }

  /**************************************************
   * format to model
   **************************************************/
  static toModel(item) {
    if (!item) return null
    const user = {
      user_id: item.user_id !== undefined ? item.user_id : null,
      username: item.username !== undefined ? item.username : null,
      email: item.email !== undefined ? item.email : null,
      auth_status: item.auth_status !== undefined ? item.auth_status : null,
      user_type: item.user_type !== undefined ? item.user_type : null,
      suspend_status:
        item.suspend_status !== undefined ? item.suspend_status : null,
      created: item.created !== undefined ? item.created : null,
      updated: item.updated !== undefined ? item.updated : null,
    }

    return new UserModel(user)
  }
}

UserModel.auth_status = {
  NOAUTH: 0,
  AUTH: 1,
}

UserModel.user_type = {
  ADMIN: 0,
  NORMALUSER: 1,
}

UserModel.suspend_status = {
  ACTIVE: 0,
  SUSPEND: 1,
}

module.exports.UserModel = UserModel
