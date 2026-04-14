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

// Configuración base de sesión
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'secreto_para_desarrollo_cambiar_en_produccion',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000 // Limpiar entradas expiradas cada 24h
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        httpOnly: true,
        secure: false, 
        sameSite: 'lax' 
    }
};


// Configuración para producción
if (process.env.NODE_ENV === 'production') {
    // Forzar HTTPS en producción
    app.set('trust proxy', 1);
    
    // Configuración segura de cookies en producción
    sessionConfig.cookie = {
        secure: true, // Forzar HTTPS
        httpOnly: true,
        sameSite: 'lax', // Más compatible con Vercel
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        // domain: process.env.DOMAIN || '.vercel.app' // Comentado para permitir dominio automático
    };
    
    console.log('✅ Cookies configuradas:', {
        secure: sessionConfig.cookie.secure,
        sameSite: sessionConfig.cookie.sameSite,
        domain: sessionConfig.cookie.domain || 'automático'
    });
    
    // Usar Redis en producción si está configurado
    if (process.env.UPSTASH_REDIS_REST_URL) {
        try {
            const RedisStore = require('connect-redis')(session);
            const { createClient } = require('redis');
            
            const redisClient = createClient({
                url: process.env.UPSTASH_REDIS_REST_URL,
                password: process.env.UPSTASH_REDIS_REST_TOKEN,
                legacyMode: true
            });
            
            // Manejar errores de conexión
            redisClient.on('error', (err) => {
                console.error('Error de Redis:', err);
            });
            
            // Conectar y configurar
            redisClient.connect()
                .then(() => {
                    sessionConfig.store = new RedisStore({ client: redisClient });
                    console.log('✅ Redis configurado para sesiones en producción');
                })
                .catch((err) => {
                    console.error('❌ Error conectando a Redis:', err);
                    console.warn('⚠️  Usando MemoryStore como fallback');
                });
        } catch (error) {
            console.error('❌ Error al configurar Redis:', error.message);
            console.warn('⚠️  Usando MemoryStore como fallback');
        }
    } else {
        console.warn('⚠️  UPSTASH_REDIS_REST_URL no configurado. Las sesiones no persistirán entre reinicios en Vercel');
    }
} else {
    console.log('🏠 Modo desarrollo detectado');
    console.log('🔧 Usando MemoryStore para sesiones');
}

console.log('📋 Variables de entorno:', {
    NODE_ENV: process.env.NODE_ENV,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? '✅ Configurada' : '❌ No configurada',
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ Configurada' : '❌ No configurada',
    SESSION_SECRET: process.env.SESSION_SECRET ? '✅ Configurada' : '❌ No configurada',
    DOMAIN: process.env.DOMAIN || 'No configurado'
});

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

app.get('/Admin/dashboard', usuariosController.getUsuarios);

//Ruta del dashboard de cursos (acceso libre)
app.get('/Admin/cursos', cursosController.getCursos);



// Importar rutas
const profesorRoutes = require('./routes/profesor');

// Usar rutas de profesor
app.use('/Profesor', profesorRoutes);

// Ruta del dashboard de alumno (acceso libre)
app.get('/Estudiante/HomeEstudiante', (req, res) => {
  res.render('Estudiante/HomeEstudiante');
});

app.get('/Estudiante/primersemestre', (req, res) => {
  res.render('Estudiante/primersemestre');
});

app.get('/Estudiante/segundosemestre', (req, res) => {
  res.render('Estudiante/segundosemestre');
});

app.get('/Estudiante/tercersemestre', (req, res) => {
  res.render('Estudiante/tercersemestre');
});

app.get('/Estudiante/test', (req, res) => {
  res.render('test/test');
});

//Subtemas de cada semestre 

// Rutas para subtemas del Semestre 1
app.get('/Estudiante/gramatica_visual', (req, res) => {
  res.render('Estudiante/subtemas/gramatica_visual');
});

app.get('/Estudiante/diseno_bidimensional', (req, res) => {
  res.render('Estudiante/subtemas/diseno_bidimensional');
});

app.get('/Estudiante/principios_diseño', (req, res) => {
  res.render('Estudiante/subtemas/principios_diseño');
});

app.get('/Estudiante/naturaleza_objetos', (req, res) => {
  res.render('Estudiante/subtemas/naturaleza_objetos');
});

// Rutas para subtemas del Semestre 2
app.get('/Estudiante/epistemologia_diseño', (req, res) => {
  res.render('Estudiante/subtemas/epistemologia_diseño');
});

app.get('/Estudiante/design_thinking', (req, res) => {
  res.render('Estudiante/subtemas/design_thinking');
});

app.get('/Estudiante/historia_impacto', (req, res) => {
  res.render('Estudiante/subtemas/historia_impacto');
});

// Rutas para subtemas del Semestre 3
app.get('/Estudiante/fisica_vida', (req, res) => {
  res.render('Estudiante/subtemas/fisica_vida');
});

app.get('/Estudiante/biomecanica', (req, res) => {
  res.render('Estudiante/subtemas/biomecanica');
});

app.get('/Estudiante/objeto_contexto', (req, res) => {
  res.render('Estudiante/subtemas/objeto_contexto');
}); 


// Ruta del dashboard de nuevo admin
app.get('/Admin/nuevoAdmin', (req, res) => {
  res.render('Admin/nuevoAdmin');
})

 

// Ruta para crear un nuevo usuario (acceso libre)
app.post('/nuevousuario', usuariosController.createUsuario);

// Rutas para actualizar usuario (acceso libre)
app.get('/editar/:correo', usuariosController.getUsuariobyCorreo);

// Ruta para manejar la actualización (acceso libre)
app.post('/Actualizacion/:correo', usuariosController.updateUsuario);


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
