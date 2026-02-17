const Curso = require('../models/Cursos');


exports.getCursos = async (req, res) => {
    try {
        console.log('Obteniendo lista de cursos...');
        const cursos = await Curso.findAll();

         console.log('Cursos recibidos en el controlador:', cursos);

        // Renderizar la vista del dashboard con los cursos
        res.render('Admin/cursos', {
            title: 'Administración de Cursos',
            cursos: Array.isArray(cursos) ? cursos : []
        });

    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).render('Error/error', {
            title: 'Error',
            error: 'Error al cargar la lista de cursos',
            message: error.message
        });
    }
};