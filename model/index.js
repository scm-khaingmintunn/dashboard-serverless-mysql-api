const UserModel = require('./user').UserModel
const TokenModel = require('./token').TokenModel

module.exports = {
  User: UserModel,
  Token: TokenModel,
}
