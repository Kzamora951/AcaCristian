axios = require('axios');
const { APEX_BASE_URL } = process.env

class User {

  static async findAll() {
    try {
      console.log('Buscando todos los usuarios...');
      const url = `${APEX_BASE_URL}usuarios`;

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js/axios'
        }
      });

      // Si no hay usuarios, devolver null
      if (!response.data.items || response.data.items.length === 0) {
        console.log('No se encontraron usuarios');
        return null;
      }

      // Devolver todos los usuarios
      const usuarios = response.data.items;

      // console.log(usuarios);

      return usuarios;

    } catch (err) {
      console.error('Error al buscar los usuarios:', err.message);
      throw err;
    }
  }


  /**
   * Busca un usuario por su correo electrónico
   * @param {string} correo - Correo electrónico del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async buscarPorCorreo(correo) {
    try {
      console.log(`Buscando usuario con correo: ${correo}...`);
      // Asegurarse de que el correo esté en minúsculas y sin espacios
      const correoNormalizado = correo.toLowerCase().trim();
      const url = `${APEX_BASE_URL}usuarios?q={"correousuario":"${correoNormalizado}"}`;
      console.log('URL de búsqueda:', url);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js/axios'
        }
      });

      // Si no hay usuarios, devolver null
      if (!response.data.items || response.data.items.length === 0) {
        console.log('No se encontró ningún usuario con ese correo');
        return null;
      }

      // Devolver solo el primer usuario encontrado
      const usuario = response.data.items[0];
      console.log('Usuario encontrado:');
      ;

      return usuario;

    } catch (err) {
      console.error('Error al buscar el usuario:', err.message);
      throw err;
    }
  }

  static async create(data) {
    try {
      console.log('Enviando datos a la API:', JSON.stringify(data, null, 2));
      const url = `${APEX_BASE_URL}/usuarios`;

      // Mapear los datos del formulario al formato que espera la API
      const requestData = {
        NOMBREUSUARIO: data.nombres || 'Sin nombre',
        APELLIDOUSUARIO: data.apellidos || 'Sin apellido',
        CORREOUSUARIO: data.correo || data.email || '',
        CONTRASENA: data.contrasena || data.password || '',
        IDROL_FK: data.rol || 2, // Por defecto rol 2 (usuario normal)
        IDENTIFICACION: data.numeroDocumento || '',
        TIPO_IDENTIFICACION: data.tipoDocumento || 'C.C',
        ESTADO: data.estado || 1 // 1 para activo, 0 para inactivo
      };

      console.log('Datos a enviar a la API:', JSON.stringify(requestData, null, 2));

      const response = await axios({
        method: 'post',
        url: url,
        data: requestData, // En Axios, el body de la petición va en 'data'
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js/axios',
          'Accept': 'application/json'
        }
      });

      console.log('Respuesta de la API - Estado:', response.status);
      console.log('Respuesta de la API - Datos:', JSON.stringify(response.data, null, 2));

      // Si la respuesta es exitosa pero no tiene datos, devolver un objeto vacío
      if (!response.data) {
        console.log('La API no devolvió datos');
        return {};
      }

      // Si la respuesta tiene la propiedad 'items', usarla, de lo contrario usar la respuesta completa
      const responseData = response.data.items || response.data;

      // Si es un array, devolver el primer elemento, de lo contrario devolver la respuesta completa
      const usuario = Array.isArray(responseData) ? responseData[0] : responseData;

      console.log('Usuario creado exitosamente:', JSON.stringify(usuario, null, 2));
      return usuario;

    } catch (error) {
      console.error('Error al crear el usuario en la API:', error.response?.data || error.message);

      // Si hay una respuesta de error de la API, incluir esos detalles
      const errorMessage = error.response?.data?.message || error.message;
      const apiError = new Error(`Error en la API: ${errorMessage}`);
      apiError.status = error.response?.status || 500;
      apiError.details = error.response?.data || {};

      throw apiError;
    }
  }

  static async update(data, correo) {
    try {
      console.log('Actualizando usuario con correo:', correo);
      console.log('Datos recibidos para actualizar:', JSON.stringify(data, null, 2));
      
      const url = `${APEX_BASE_URL}usuarios/${correo}`;

      // Mapear los datos del formulario al formato que espera la API
      const requestData = {
        NOMBREUSUARIO: data.nombres || 'Sin nombre',
        APELLIDOUSUARIO: data.apellidos || 'Sin apellido',
        CORREOUSUARIO: data.correo || data.email || '',
        IDENTIFICACION: data.numeroDocumento || '',
        TIPO_IDENTIFICACION: data.tipoDocumento || 'C.C',
        IDROL_FK: data.rol || 2, // Por defecto rol 2 (usuario normal)
        ESTADO: data.estado || 1, // 1 para activo, 0 para inactivo
        // Incluir contraseña solo si se proporcionó
        ...(data.contrasena && data.contrasena.trim() !== '' && { CONTRASENA: data.contrasena })
      };

      console.log('Datos a enviar a la API para actualización:', JSON.stringify(requestData, null, 2));

      const response = await axios({
        method: 'post',
        url: url,
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js/axios',
          'Accept': 'application/json'
        }
      });

      console.log('Respuesta de la API - Estado:', response.status);
      console.log('Respuesta de la API - Datos:', JSON.stringify(response.data, null, 2));

      // Si la respuesta es exitosa pero no tiene datos, devolver un objeto vacío
      if (!response.data) {
        console.log('La API no devolvió datos en la actualización');
        return {};
      }

      // Si la respuesta tiene la propiedad 'items', usarla, de lo contrario usar la respuesta completa
      const responseData = response.data.items || response.data;

      // Si es un array, devolver el primer elemento, de lo contrario devolver la respuesta completa
      const usuario = Array.isArray(responseData) ? responseData[0] : responseData;
      
      return usuario;
      
    } catch (error) {
      console.error('Error en User.update:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el usuario en la API';
      console.error('Mensaje de error detallado:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}  
module.exports = User;