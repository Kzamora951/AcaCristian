// Middleware para verificar si el usuario está autenticado
exports.isAuthenticated = (req, res, next) => {
    // Establecer encabezados para prevenir el caché
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    if (req.session && req.session.user) {
        return next();
    }
    
    // Si hay una sesión expirada, redirigir con un mensaje
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({ error: 'Sesión expirada' });
    }
    
    res.redirect('/login?session=expired');
};

// Middleware para verificar si el usuario tiene un rol específico
exports.hasRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (roles.length && !roles.includes(parseInt(req.session.user.rol))) {
            return res.status(403).render('Error/error', {
                title: 'Acceso denegado',
                message: 'No tienes permiso para acceder a esta página'
            });
        }
        
        next();
    };
};
