document.addEventListener('DOMContentLoaded', function() {
    // Toggle para contraseña de login
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function (e) {
            // Alternar el tipo de input entre password y text
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            
            // Cambiar el ícono
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle para contraseña de registro
    const toggleRegPassword = document.querySelector('#toggleRegPassword');
    const regPassword = document.querySelector('#regPassword');

    if (toggleRegPassword && regPassword) {
        toggleRegPassword.addEventListener('click', function (e) {
            const type = regPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            regPassword.setAttribute('type', type);
            
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle para confirmar contraseña de registro
    const toggleRegConfirmPassword = document.querySelector('#toggleRegConfirmPassword');
    const regConfirmPassword = document.querySelector('#regConfirmPassword');

    if (toggleRegConfirmPassword && regConfirmPassword) {
        toggleRegConfirmPassword.addEventListener('click', function (e) {
            const type = regConfirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            regConfirmPassword.setAttribute('type', type);
            
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Cerrar la alerta al hacer clic en el botón de cierre
    const closeButton = document.querySelector('.alert button');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            const alert = this.closest('.alert');
            if (alert) {
                alert.style.display = 'none';
            }
        });
    }
});
