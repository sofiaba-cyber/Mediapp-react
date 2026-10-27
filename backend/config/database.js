const mysql = require('mysql2')

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydb',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : undefined
})

// ====================================
// PROBAR CONEXIÓN
// ====================================

db.getConnection((error, connection) => {

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

  connection.release()

})

module.exports = db