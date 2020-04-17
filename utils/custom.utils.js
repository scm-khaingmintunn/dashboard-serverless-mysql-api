'use strict'

const bcrypt = require('bcrypt-nodejs')

class CustomUtils {
  static randomString(len) {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-'
    const cl = chars.length

    let str = ''
    for (let i = 0; i < len; i++) str += chars[Math.floor(Math.random() * cl)]

    return str
  }

  static async hashPassword(password) {
    const saltRounds = bcrypt.genSaltSync(10)
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, null, (error, hash) => {
        if (error) reject(error)
        resolve(hash)
      })
    })

    return hashedPassword
  }

  static async comparePassword(password, existPassword) {
    const isMatch = await new Promise((resolve, reject) => {
      bcrypt.compare(password, existPassword, (error, isMatch) => {
        if (error) reject(error)
        resolve(isMatch)
      })
    })

    return isMatch
  }

  static getHeader(properName, headers) {
    const value = headers[properName]
      ? headers[properName]
      : headers[properName.toLowerCase()]

    return value !== undefined ? value : null
  }

  static getAccessToken(params) {
    const authorization = this.getHeader('Authorization', params.headers)

    return authorization ? authorization.replace(/^token /, '') : null
  }
}

module.exports = CustomUtils
