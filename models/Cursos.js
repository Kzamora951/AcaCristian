axios = require('axios');
const { APEX_BASE_URL } = process.env


class Curso {

  static async findAll() {
    try {
      console.log('[MODELO]Buscando todos los Cursos...');
      const url = `${APEX_BASE_URL}cursos`;
      console.log('URL de búsqueda:', url);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js/axios'
        }
      });

    
      

      // Si no hay usuarios, devolver null
      if (!response.data.items || response.data.items.length === 0) {
        console.log('No se encontraron Cursos');
        return null;
      }

      // Devolver todos los usuarios
      const cursos = response.data.items;

      // console.log(usuarios);

      return cursos;

    } catch (err) {
      console.error('Error al buscar los Cursos:', err.message);
      throw err;
    }
  }

}

module.exports = Curso;
