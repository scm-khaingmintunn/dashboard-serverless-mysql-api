const abstract = require('../model/abstract')

const main = async () => {
  const connection = await abstract.connection()

  let tables = ['users', 'posts']
  const query_str1 = `CREATE TABLE ${tables[0]} (user_id VARCHAR(255) PRIMARY KEY, username VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, created INT(20) NOT NULL, updated INT(20))`
  const query_str2 = `CREATE TABLE ${tables[1]} (post_id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), post VARCHAR(255), created_user_id VARCHAR(255), created INT(20), updated INT(20))`

  // queries

  // table users
  await connection
    .query(query_str1)
    .then(res => {
      console.log(`created user table.`)
    })
    .catch(err => {
      console.log(err.message.split(':')[1])
    })

  // table posts
  await connection
    .query(query_str2)
    .then(res => {
      console.log(`created post table.`)
    })
    .catch(err => {
      console.log(err.message.split(':')[1])
    })

  // close all connections
  tables.map(table => {
    connection.end()
  })
}

main()
