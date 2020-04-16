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
      created: moment().unix(),
      updated: null,
    }

    // query and db insert
    const query_str = `INSERT INTO users 
    (user_id, username, email, password, created, updated) 
    VALUES ('${user.user_id}', '${user.username}', '${user.email}', '${user.password}', '${user.created}', '${user.updated}')`
    await connection.query(query_str)

    return this.toModel(user)
  }

  static async getByEmail(email) {
    const connection = await super.connection()
    const query_str = `SELECT * FROM users WHERE email='${email}'`
    const user = await connection.query(query_str)

    return user
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
      user_id: item.user_id ? item.user_id : null,
      username: item.username ? item.username : null,
      email: item.email ? item.email : null,
      created: item.created ? item.created : null,
      updated: item.updated ? item.updated : null,
    }

    return new UserModel(user)
  }
}

module.exports.UserModel = UserModel
