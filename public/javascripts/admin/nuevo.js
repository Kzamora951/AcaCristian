
    document.addEventListener('DOMContentLoaded', function() {
        const botonMostrar = document.querySelector('#mostrarContrasena');
        const campoContrasena = document.querySelector('#contrasena');
        const icono = botonMostrar.querySelector('i');

        botonMostrar.addEventListener('click', function() {
            const tipo = campoContrasena.getAttribute('type') === 'password' ? 'text' : 'password';
            campoContrasena.setAttribute('type', tipo);
            
            // Cambiar el ícono
            icono.classList.toggle('fa-eye');
            icono.classList.toggle('fa-eye-slash');
            
            // Cambiar el tooltip
            const titulo = tipo === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
            this.setAttribute('title', titulo);
        });
    });
