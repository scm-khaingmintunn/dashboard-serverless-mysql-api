const abstract = require('../model/abstract')

const main = async () => {
  const connection = await abstract.connection()

  let tables = ['users', 'posts', 'tokens']
  const query_str1 = `
    INSERT INTO ${tables[0]} VALUES (
    'ef624bb6-a156-45bc-89a2-e38e94ab5979', 
    'Dashboard Admin', 
    'dashboard.admin@gmail.com', 
    '$2a$10$q/k5tr/UlYtDacrVlfhtF.rncl6aJzg2403h6hyMrgxQW8wJDkSka', 
    1,
    0,
    0,
    1587049605, 
    1587049605)
    `

  const query_str3 = `
    INSERT INTO ${tables[2]} VALUES (
    'fc73c920-87a0-4896-a039-10915ab4b164', 
    'LdPg!JRNIRrvhUx4NBiYmaD9M0@ZhY', 
    'ACCESS_TOKEN', 
    1587114804, 
    'ef624bb6-a156-45bc-89a2-e38e94ab5979', 
    1587049605,
    1587049605
    )
  `

  // queries
  // table users
  await connection
    .query(query_str1)
    .then((res) => {
      console.log('1 user is inserted into user table.')
    })
    .catch((err) => {
      console.log(err.message.split(':')[1])
    })

    await connection
    .query(query_str3)
    .then((res) => {
      console.log('1 token is inserted into token table.\naccess token: LdPg!JRNIRrvhUx4NBiYmaD9M0@ZhY')
    })
    .catch((err) => {
      console.log(err.message.split(':')[1])
    })

  // close all connections
  tables.map((table) => {
    connection.end()
  })
}

main()
