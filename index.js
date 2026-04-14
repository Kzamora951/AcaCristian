const express = require('express')

const app = express()

const port = 3000

const path = require("path"); // Path

const flash = require('connect-flash');





// Configuración del motor de vistas EJS

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));



// Middleware para servir archivos estáticos

app.use(express.static(path.join(__dirname, 'public')));



// Middleware para parsear el cuerpo de las peticiones

app.use(express.urlencoded({ extended: true }));

app.use(express.json());



// Configuración de sesión básica

const session = require('express-session');

app.use(session({

    secret: 'secreto_temporal',

    resave: false,

    saveUninitialized: false,

    cookie: { maxAge: 60000 }

}));



// Configuración de sesión básica



// Configuración de flash messages

app.use(flash());



// Middleware para hacer flash disponible en todas las vistas

app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');

    res.locals.error_msg = req.flash('error_msg');

    next();

});







app.get('/', (req, res) => {

  res.render('home');

})



// Ruta del login

app.get('/login', (req, res) => {

    res.render('login');

});



app.post('/login', (req, res) => {

    const { correo, password } = req.body;

    

    // Validación simple: kevin@gmail.com con contraseña 123

    if (correo === 'kevin@gmail.com' && password === '123') {

        req.flash('success_msg', '¡Inicio de sesión correcto! Redirigiendo...');

        res.redirect('/Estudiante/HomeEstudiante');

    } else {

        req.flash('error_msg', 'Credenciales incorrectas. Por favor, intenta nuevamente.');

        res.redirect('/login');

    }

});



// Ruta de logout

app.get('/logout', (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            return res.redirect('/login');

        }

        req.flash('success_msg', 'Has cerrado sesión correctamente.');

        res.redirect('/login');

    });

});



// Ruta del dashboard de alumno (acceso directo)

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



// Rutas para subtemas del Semestre 1

app.get('/Estudiante/gramatica_visual', (req, res) => {

  res.render('Estudiante/primer semestre/gramatica_visual');

});



app.get('/Estudiante/diseno_bidimensional', (req, res) => {

  res.render('Estudiante/primer semestre/diseno_bidimensional');

});



app.get('/Estudiante/principios_diseno', (req, res) => {

  res.render('Estudiante/primer semestre/principios_diseno');

});



app.get('/Estudiante/naturaleza_objetos', (req, res) => {

  res.render('Estudiante/primer semestre/naturaleza_objetos');

});





// Manejador de errores 404

app.use((req, res) => {

    res.status(404).render('Error/error', {

        title: 'Página no encontrada',

        message: 'La página que buscas no existe o ha sido movida.',

        errorCode: '404'

    });

});



// Manejador de errores global

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).render('Error/error', {

        title: 'Error del servidor',

        message: 'Ha ocurrido un error interno. Por favor, intenta nuevamente más tarde.',

        errorCode: '500'

    });

});



app.listen(port, () => {

  console.log(`Example app listening on port http://localhost:${port}`)

})

