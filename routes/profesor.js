const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesorController');

// Rutas de acceso libre
// Ruta principal del dashboard del profesor
router.get('/dashboard', profesorController.getDashboard);

// Otras rutas del profesor pueden ir aquí
// Por ejemplo:
// router.get('/cursos', profesorController.getCursos);
// router.get('/estudiantes', profesorController.getEstudiantes);
// router.post('/tareas', profesorController.crearTarea);
// etc.

module.exports = router;
