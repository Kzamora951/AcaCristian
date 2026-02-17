const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middlewares/auth');
const profesorController = require('../controllers/profesorController');

// Aplicar el middleware de autenticación a todas las rutas
router.use(isAuthenticated);
router.use(hasRole([2])); // Solo profesores

// Ruta principal del dashboard del profesor
router.get('/dashboard', profesorController.getDashboard);

// Otras rutas del profesor pueden ir aquí
// Por ejemplo:
// router.get('/cursos', profesorController.getCursos);
// router.get('/estudiantes', profesorController.getEstudiantes);
// router.post('/tareas', profesorController.crearTarea);
// etc.

module.exports = router;
