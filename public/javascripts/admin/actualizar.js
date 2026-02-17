document.addEventListener('DOMContentLoaded', function() {
    const mostrarContrasena = document.getElementById('mostrarContrasena');
    
    if (mostrarContrasena) {
        const contrasenaInput = document.getElementById('contrasena');
        const iconoOjo = mostrarContrasena.querySelector('i');
        
        mostrarContrasena.addEventListener('click', function(e) {
            e.preventDefault();
            const tipo = contrasenaInput.type === 'password' ? 'text' : 'password';
            contrasenaInput.type = tipo;
            
            // Cambiar el ícono según el estado
            if (tipo === 'password') {
                iconoOjo.classList.remove('fa-eye-slash');
                iconoOjo.classList.add('fa-eye');
                mostrarContrasena.setAttribute('title', 'Mostrar contraseña');
            } else {
                iconoOjo.classList.remove('fa-eye');
                iconoOjo.classList.add('fa-eye-slash');
                mostrarContrasena.setAttribute('title', 'Ocultar contraseña');
            }
        });
    }
});
