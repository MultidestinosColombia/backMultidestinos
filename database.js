
const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
      //host: 'turntable.proxy.rlwy.net',
      host: 'trolley.proxy.rlwy.net', 
      user: 'root', 
      password: "FXBfTaWLTaUqrlyztrflJqjhxvqTueuf", 
      database: 'MultidestinosExpress', 
      port: '45646'
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

module.exports = connect;
