const abstract = require('../model/abstract')

const main = async () => {
  const connection = await abstract.connection()

  let tables = ['users']
  const query_str1 = `INSERT INTO ${tables[0]} VALUES ('ef624bb6-a156-45bc-89a2-e38e94ab5979', 'user1', 'user1@gmail.com', '$2a$10$q/k5tr/UlYtDacrVlfhtF.rncl6aJzg2403h6hyMrgxQW8wJDkSka', 1587049605, 1587049605)`

  // queries
  // table users
  await connection
    .query(query_str1)
    .then(res => {
      console.log(`1 user is inserted into user table.`)
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
