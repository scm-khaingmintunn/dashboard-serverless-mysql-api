'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const Abstract = require('./abstract')
const CustomUtils = require('../utils/custom.utils')

class TokenModel extends Abstract {
  constructor(params = {}) {
    super()

    this.token_id = params.token_id
    this.token = params.token
    this.token_type = params.token_type
    this.expired = params.expired
    this.created_user_id = params.created_user_id
    this.created = params.created
    this.updated = params.updated
  }

  static async create(params) {
    const connection = await super.connection()
    const token = {
      token_id: uuidv4(),
      token: CustomUtils.randomString(30),
      token_type: params.token_type,
      expired: moment()
        .add(1, 'hours')
        .unix(),
      created_user_id: params.created_user_id,
      created: moment().unix(),
      updated: null,
    }

    const query_str = `
      INSERT INTO tokens
      (token_id, token, token_type, expired, created_user_id, created, updated) VALUES
      ('${token.token_id}', '${token.token}', '${token.token_type}', ${token.expired}, '${token.created_user_id}', ${token.created}, ${token.updated})
    `
    await connection.query(query_str)

    return this.toModel(token)
  }

  static async getByTokenStr(token_str) {
    const connection = await super.connection()
    const query_str = `SELECT * FROM tokens WHERE token='${token_str}'`

    const tokens = await connection.query(query_str)
    if (tokens.lenght < 1) return null
    else return this.toModel(tokens[0])
  }

  static toModel(item) {
    if (!item) return null
    const token = {
      token_id: item.token_id !== undefined ? item.token_id : null,
      token: item.token !== undefined ? item.token : null,
      token_type: item.token_type !== undefined ? item.token_type : null,
      expired: item.expired !== undefined ? item.expired : null,
      created_user_id:
        item.created_user_id !== undefined ? item.created_user_id : null,
      created: item.created !== undefined ? item.created : null,
      updated: item.updated !== undefined ? item.updated : null,
    }

    return new TokenModel(token)
  }
}

TokenModel.token_type = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
}

module.exports.TokenModel = TokenModel
