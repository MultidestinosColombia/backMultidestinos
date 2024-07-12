
const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
        host: 'monorail.proxy.rlwy.net', 
      user: 'root', 
      password: "mioylrtkppAcaTeSwBFvpCxVByzDawtj", 
      database: 'railway', 
      port: '30968'
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

module.exports = connect;
