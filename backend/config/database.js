const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
})

db.connect((error) => {

  if (error) {

    console.error(
      '❌ Error al conectar con MySQL:',
      error
    )

    return
  }

  console.log(
    '✅ Conectado correctamente a MySQL'
  )

})

module.exports = db