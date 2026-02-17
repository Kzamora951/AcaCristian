const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/login', authController.showLogin);

// Procesar login
router.post('/login', authController.login);

// Cerrar sesión
router.get('/logout', authController.logout);


module.exports = router;
