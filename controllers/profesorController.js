const User = require('../models/User');

// Mostrar el dashboard del profesor
exports.getDashboard = async (req, res) => {
    try {
        // Verificar si el usuario es un profesor
        if (req.session.user.rol !== 2) {
            return res.redirect('/login?error=unauthorized');
        }

        // Aquí puedes agregar la lógica para obtener los datos del profesor
        const profesorData = {
            nombre: req.session.user.nombre,
            correo: req.session.user.correo,
            cursos: [
                { id: 1, nombre: 'Matemáticas Avanzadas', estudiantes: 25, progreso: 75 },
                { id: 2, nombre: 'Física Moderna', estudiantes: 20, progreso: 45 }
            ],
            tareasPendientes: [
                { id: 1, titulo: 'Examen de Matemáticas', curso: 'Matemáticas Avanzadas', fecha: '15/11/2023', pendientes: 12 },
                { id: 2, titulo: 'Proyecto: Laboratorio de Física', curso: 'Física Moderna', fecha: '18/11/2023', pendientes: 8 }
            ]
        };

        // Renderizar la vista del dashboard del profesor con los datos
        res.render('Profesor/dashboard', {
            title: 'Panel del Profesor',
            user: req.session.user,
            profesor: profesorData,
            cursos: profesorData.cursos,
            tareasPendientes: profesorData.tareasPendientes
        });

    } catch (error) {
        console.error('Error en el dashboard del profesor:', error);
        res.status(500).render('Error/error', {
            title: 'Error',
            message: 'Ocurrió un error al cargar el panel del profesor',
            error: error.message
        });
    }
};

// Otras funciones específicas del profesor pueden ir aquí
// Por ejemplo:
// - Obtener lista de estudiantes por curso
// - Gestionar calificaciones
// - Crear tareas
// - Ver progreso de los estudiantes
// etc.
