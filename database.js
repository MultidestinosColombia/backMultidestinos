
const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
        host: 'viaduct.proxy.rlwy.net', 
      user: 'root', 
      password: "EIIvJGKTHTrvgVUmtvbVxchbGFQlucPK", 
      database: 'railway', 
      port: '29205'
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

module.exports = connect;
