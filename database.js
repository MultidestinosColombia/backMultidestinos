
const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
      //host: 'turntable.proxy.rlwy.net',
      host: 'yamanote.proxy.rlwy.net', 
      user: 'root', 
      password: "YYwdRzSKQwQreRPDQOBmqVAiGZjnkOUH", 
      database: 'MULTIDESTINOS_EXPRESS', 
      port: '36788'
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

module.exports = connect;
