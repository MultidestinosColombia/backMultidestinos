
const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: 'junction.proxy.rlwy.net', 
      user: 'root', 
      password: "fetMVUVTNxuoHyJBZAtVUMoeaTYuPwgF", 
      database: 'railway', 
      port: '25553'
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

module.exports = connect;
