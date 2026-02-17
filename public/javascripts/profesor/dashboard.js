/**
 * Script principal para el dashboard del profesor
 * Maneja la interacción del usuario y la lógica del frontend
 */

// Función para verificar si el usuario está autenticado
function checkAuth() {
    // Verificar si la página actual es una ruta protegida
    const protectedRoutes = ['/profesor/dashboard', '/admin/dashboard', '/alumno/dashboard'];
    const currentPath = window.location.pathname.toLowerCase();
    
    if (protectedRoutes.some(route => currentPath.includes(route.toLowerCase()))) {
        // Intentar acceder a una ruta protegida sin sesión
        if (!document.body.hasAttribute('data-authenticated')) {
            window.location.href = '/login?session=expired';
            return false;
        }
    }
    return true;
}

// Manejar el evento de carga de la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación al cargar la página
    checkAuth();
    
    // Configurar el evento de cierre de sesión
    const logoutLinks = document.querySelectorAll('a[href*="logout"], .logout-btn');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Realizar una petición al servidor para cerrar sesión
            fetch('/logout', {
                method: 'GET',
                credentials: 'same-origin'
            }).then(() => {
                // Limpiar el historial del navegador
                window.location.replace('/login');
                window.onpageshow = function(event) {
                    if (event.persisted) {
                        window.location.reload();
                    }
                };
            });
        });
    });
    
    // Prevenir que el formulario se envíe múltiples veces
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
            }
        });
    });
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Manejar el menú activo
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    // Función para establecer el ítem de menú activo
    function setActiveNavItem() {
        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && currentPath.includes(link.getAttribute('href'))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Manejar clic en los ítems del menú
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Si el clic fue en un enlace dentro del ítem
            const link = this.querySelector('a');
            if (link) {
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Si es un enlace externo o con target="_blank", no hacer nada más
                if (link.target === '_blank' || link.hostname !== window.location.hostname) {
                    return;
                }
                
                // Prevenir el comportamiento por defecto para manejar la navegación
                e.preventDefault();
                window.location.href = link.href;
            } else {
                // Si no hay enlace, solo manejar la clase activa
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Inicializar el menú activo
    setActiveNavItem();

    // Manejar el menú desplegable del usuario
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        // Agregar clase al hacer hover
        userDropdown.addEventListener('mouseenter', function() {
            const dropdown = new bootstrap.Dropdown(userDropdown);
            dropdown.show();
        });
    }

    // Cerrar menú desplegable al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
        }
    });

    // Inicializar contadores animados
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animar los contadores cuando son visibles
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                if (!counter.classList.contains('animated')) {
                    animateValue(counter, 0, target, 2000);
                    counter.classList.add('animated');
                }
            }
        });
    }, observerOptions);

    // Observar los contadores
    document.querySelectorAll('.counter').forEach(counter => {
        observer.observe(counter);
    });

    // Manejar la búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar la notificación después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Función para confirmar acciones importantes
function confirmAction(message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.tabIndex = '-1';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar acción</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="confirmBtn">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        modal.querySelector('#confirmBtn').addEventListener('click', () => {
            modalInstance.hide();
            document.body.removeChild(modal);
            resolve(true);
        });
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
            resolve(false);
        });
    });
}
