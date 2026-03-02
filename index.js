const express = require('express')
const app = express()
const port = 3000
const session = require('express-session');
require('dotenv').config();
const path = require("path"); // Path
const authController = require('./controllers/authController');
const usuariosController = require('./controllers/usuariosController');
const cursosController = require('./controllers/cursosController');
const flash = require('connect-flash');
const { isAuthenticated, hasRole } = require('./middlewares/auth');


// Configuración de sesión
const MemoryStore = require('memorystore')(session);

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'secreto_para_desarrollo_cambiar_en_produccion',
    resave: false,
    saveUninitialized: true, // Permitir guardar sesiones nuevas
    store: new MemoryStore({
        checkPeriod: 86400000 // Limpiar entradas expiradas cada 24h
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        httpOnly: true,
        // En producción, asegúrate de configurar estos valores:
        // secure: true,
        // sameSite: 'none',
        // domain: 'tudominio.com'
    }
};

// Configuración para producción
if (process.env.NODE_ENV === 'production') {
    // Forzar HTTPS en producción
    app.set('trust proxy', 1);
    
    // Configuración segura de cookies en producción
    sessionConfig.cookie.secure = true;
    sessionConfig.cookie.sameSite = 'none';
    sessionConfig.cookie.domain = 'tudominio.com';
    
    // Usar Redis en producción si está configurado
    if (process.env.REDIS_URL) {
        const RedisStore = require('connect-redis')(session);
        const { createClient } = require('redis');
        
        const redisClient = createClient({
            url: process.env.REDIS_URL,
            legacyMode: true
        });
        
        redisClient.connect().catch(console.error);
        
        redisClient.on('error', (err) => {
            console.error('Error de Redis:', err);
        });
        
        sessionConfig.store = new RedisStore({ client: redisClient });
    }
}

// Si estás en producción, usa secure: true
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Confía en el primer proxy
    sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));



// Configuración de flash messages
app.use(flash());

// Middleware para hacer que el usuario esté disponible en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/', (req, res) => {
  res.render('home');
})



//LOGIN
//SESION DE 1 DIA
app.get('/login', authController.showLogin);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Ruta del dashboard de administración (solo para administradores)

app.get('/Admin/dashboard', isAuthenticated, hasRole([1]), usuariosController.getUsuarios);

//Ruta del dashboard de cursos (solo para administradores)
app.get('/Admin/cursos', isAuthenticated, hasRole([1]), cursosController.getCursos);



// Importar rutas
const profesorRoutes = require('./routes/profesor');

// Usar rutas de profesor
app.use('/Profesor', profesorRoutes);

// Ruta del dashboard de alumno (solo para alumnos)
app.get('/Estudiante/HomeEstudiante', isAuthenticated, hasRole([3]), (req, res) => {
  res.render('Estudiante/HomeEstudiante');
});

app.get('/Estudiante/primersemestre', isAuthenticated, hasRole([3]), (req, res) => {
  res.render('Estudiante/primersemestre');
});

app.get('/Estudiante/segundosemestre', isAuthenticated, hasRole([3]), (req, res) => {
  res.render('Estudiante/segundosemestre');
});

app.get('/Estudiante/tercersemestre', isAuthenticated, hasRole([3]), (req, res) => {
  res.render('Estudiante/tercersemestre');
});

// Ruta del dashboard de nuevo admin
app.get('/Admin/nuevoAdmin', (req, res) => {
  res.render('Admin/nuevoAdmin');
})

 

// Ruta para crear un nuevo usuario (solo administradores)
app.post('/nuevousuario', isAuthenticated, hasRole([1]), usuariosController.createUsuario);

// Rutas para actualizar usuario (solo administradores)
app.get('/editar/:correo', isAuthenticated, hasRole([1]), usuariosController.getUsuariobyCorreo);

// Ruta para manejar la actualización (solo administradores)
app.post('/Actualizacion/:correo', isAuthenticated, hasRole([1]), usuariosController.updateUsuario);


// Manejador de errores 404
app.use((req, res) => {
    res.status(404).render('Error/error', {
        title: 'Página no encontrada',
        message: 'La página que buscas no existe'
    });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('Error/error', {
        title: 'Error del servidor',
        message: 'Algo salió mal en el servidor'
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
