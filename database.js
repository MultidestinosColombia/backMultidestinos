
const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: 'autorack.proxy.rlwy.net', 
      user: 'root', 
      password: "JvaumVzNHTmTVNrTbkvOJQLBeYoQlIjS", 
      database: 'railway', 
      port: '52412'
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

module.exports = connect;
