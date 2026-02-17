// Configuración de la conexión a Oracle
const oracledb = require('oracledb');

// Configuración de la base de datos
const dbConfig = {
  user: 'TU_USUARIO',
  password: '',
  connectString: '//host:puerto/SERVICIO_OR_SID',
  // Configuración adicional para el pool de conexiones
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0
};

// Función para obtener una conexión
async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error('Error al conectar a Oracle:', err);
    throw err;
  }
}

// Función para ejecutar consultas
async function executeQuery(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    });
    return result;
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
}

module.exports = {
  getConnection,
  executeQuery
};
