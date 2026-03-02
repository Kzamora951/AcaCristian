const { toString } = require('express-validator/lib/utils');
const User = require('../models/User');

// Mostrar formulario de login
exports.showLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/admin/dashboard');
    }
    res.render('login', { 
        title: 'Iniciar Sesión',
        error: null
    });
};

// Procesar login
exports.login = async (req, res) => {
    
    try {
        const { correo, password } = req.body;
        
        //Llama a la funcion buscarPorCorreo en el modelo User
        const user = await User.buscarPorCorreo(correo);
        console.log('Objeto user completo:', JSON.stringify(user, null, 2));
        
        if (!user) {
            console.log("usuario no encontrado");
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña
        console.log('Contraseña recibida:', password);
        console.log('Contraseña en BD:', user.contrasena);
        console.log('Estado del usuario:', user.estado);
        
        // Verificar si el usuario está activo
        if (user.estado !== 1) {
            console.log("Intento de inicio de sesión de usuario inactivo");
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: 'Acceso denegado',
                showAlert: true,
                alertMessage: 'Su cuenta está inactiva. Por favor, contacte al administrador.'
            });
        }

        // Verificar contraseña
        if (user.contrasena !== password) {
            console.log("Las contraseñas no coinciden");
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: 'Credenciales incorrectas',
                showAlert: true,
                alertMessage: 'Credenciales incorrectas. Por favor, intente nuevamente.'
            });
        }

        // Guardar en sesión
        req.session.user = {
            id: user.id_usuario,
            correo: user.correo,
            nombre: user.nombre,
            rol: user.idrolfk  // Guardar el rol del usuario en la sesión
        };

        // Redirigir según el rol
        if (user.idrolfk == 1) {
            return res.redirect('/admin/dashboard');
        } else if (user.idrolfk == 2) {
            return res.redirect('/Profesor/dashboard');
        } else {
             return res.redirect('/Estudiante/HomeEstudiante');
        }

    } catch (error) {
        console.error('Error en el login:', error);
        
        // Verificar si es un error de conexión o servicio no disponible
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ETIMEDOUT' || 
            error.code === 'ENOTFOUND' ||
            error.message.includes('connect') ||
            error.message.includes('timeout') ||
            error.message.includes('network')) {
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: 'Servicio no disponible',
                showAlert: true,
                alertMessage: 'El servidor se encuentra en mantenimiento. Por favor, intente más tarde.'
            });
        }
        
        res.status(500).render('Error/error', {
            title: 'Error',
            message: 'Ocurrió un error al procesar la solicitud'
        });
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        
        // Destruir la cookie de sesión
        res.clearCookie('connect.sid');
        
        // Establecer encabezados para prevenir el caché
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        
        // Redirigir al login con un parámetro para prevenir caché
        console.log("Sesion cerrada");
        
        res.redirect('/login?logout=' + Date.now());
    });
};