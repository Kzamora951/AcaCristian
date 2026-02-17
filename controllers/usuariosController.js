const User = require('../models/User');

exports.getUsuarios = async (req, res) => {
    try {
        console.log('Obteniendo lista de usuarios...');
        const usuarios = await User.findAll();

        // console.log('Usuarios recibidos en el controlador:', usuarios);

        // Renderizar la vista del dashboard con los usuarios
        res.render('Admin/dashboard', {
            title: 'Administración de Usuarios',
            usuarios: Array.isArray(usuarios) ? usuarios : []
        });

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).render('Error/error', {
            error: 'Error al cargar la lista de usuarios',
            message: error.message
        });
    }
};

exports.getUsuariobyCorreo = async (req, res) => {
    try {
        const { correo } = req.params; // Cambiado de req.body a req.params
        console.log('Buscando usuario con correo:', correo);

        if (!correo) {
            throw new Error('No se proporcionó un correo para la búsqueda');
        }

        const usuario = await User.buscarPorCorreo(correo);
        console.log('Usuario encontrado:', usuario);

        if (!usuario) {
            return res.status(404).render('Error/error', {
                title: 'Usuario no encontrado',
                error: 'Usuario no encontrado',
                message: `No se encontró ningún usuario con el correo: ${correo}`
            });
        }

        // Renderizar la vista de actualización con los datos del usuario
        res.render('Admin/actualizar', {
            title: 'Actualizar Usuario',
            usuarios: usuario // Enviar el objeto usuario directamente
        });

    } catch (error) {
        console.error('Error al buscar usuario por correo:', error);
        res.status(500).render('Error/error', {
            title: 'Error',
            error: 'Error al buscar el usuario',
            message: error.message
        });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        console.log('Datos recibidos del formulario:', req.body);

        // Verificar si el correo ya está registrado
        const correoExistente = await User.buscarPorCorreo(req.body.correo);
        if (correoExistente) {
            console.log('El correo ya está registrado:', req.body.correo);

            if (req.xhr || req.get('Content-Type') === 'application/json') {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está en uso',
                    field: 'correo'
                });
            }

            // Si es una petición normal (no AJAX)
            return res.render('Admin/nuevoAdmin', {
                title: 'Nuevo Usuario',
                error: 'El correo electrónico ya está registrado',
                formData: req.body // Mantener los datos del formulario
            });
        }

        // Mapear los campos del formulario a los que espera la API
        const userData = {
            usuario: req.body.numeroDocumento,
            email: req.body.correo,
            password: req.body.contrasena,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            tipoDocumento: req.body.tipoDocumento,
            numeroDocumento: req.body.numeroDocumento,
            rol: req.body.rol,
            estado: req.body.estado
        };

        console.log('Datos a enviar a la API:', userData);

        const usuario = await User.create(userData);

        console.log('Usuario creado exitosamente:', usuario);

        // Si es una petición AJAX o API, devolver JSON
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            return res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                data: usuario
            });
        }

        // Si es una petición normal, redirigir al dashboard
        const usuarios = await User.findAll();
        res.render('Admin/dashboard', {
            title: 'Administración de Usuarios',
            usuarios: Array.isArray(usuarios) ? usuarios : []
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);

        // Si es una petición AJAX o API
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            return res.status(500).json({
                success: false,
                message: 'Error al crear el usuario',
                error: error.message
            });
        }

        // Si es una petición normal
        res.status(500).render('Error/error', {
            error: 'Error al crear el usuario',
            message: error.message
        });
    }
};

exports.updateUsuario = async (req, res) => {
    console.log("Iniciando actualización de usuario");
    try {
        console.log('Datos recibidos del formulario:', req.body);

        // Mapear los campos del formulario a los que espera el modelo
        const userData = {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            tipoDocumento: req.body.tipoDocumento,
            numeroDocumento: req.body.numeroDocumento,
            rol: req.body.rol,  // Se mapeará a IDROL_FK en el modelo
            estado: req.body.estado,
            contrasena: req.body.contrasena
        };

        console.log('Datos a enviar al modelo:', userData);

        // Llamar al modelo para actualizar
        const usuario = await User.update(userData, req.params.correo);

        console.log('Usuario actualizado exitosamente:', usuario);

        // Si es una petición AJAX o API, devolver JSON
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            return res.status(200).json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: usuario
            });
        }

        // Si es una petición normal, redirigir al dashboard
        const usuarios = await User.findAll();
        res.render('Admin/dashboard', {
            title: 'Administración de Usuarios',
            usuarios: Array.isArray(usuarios) ? usuarios : []
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);

        // Si es una petición AJAX o API
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            return res.status(500).json({
                success: false,
                message: 'Error al crear el usuario',
                error: error.message
            });
        }

        // Si es una petición normal
        res.status(500).render('Error/error', {
            error: 'Error al crear el usuario',
            message: error.message
        });
    }
};