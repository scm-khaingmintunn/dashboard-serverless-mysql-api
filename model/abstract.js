const util = require('util')
const mysql = require('mysql')
const mysql_config = require('../mysql/config')
const CustomErrors = require('../utils/custom.errors')
const CustomError = CustomErrors.CustomError

class AbstractModel {
  static async connection() {
    const pool = mysql.createPool({
      host: mysql_config.dev.host,
      user: mysql_config.dev.user,
      password: mysql_config.dev.password,
      database: mysql_config.dev.database,
    })

    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.')
        }
      }

      if (connection) connection.release()
    })

    pool.query = await util.promisify(pool.query)

    return pool
  }

  static throwCustomError(error, message, statusCode, errors) {
    if (error instanceof CustomError) {
      throw error
    } else {
      console.log(error)
      throw new CustomError(message, statusCode, errors)
    }
  }
}

module.exports = AbstractModel
