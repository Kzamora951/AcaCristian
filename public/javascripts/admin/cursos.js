/**
 * Funcionalidad para la gestión de cursos
 * Este archivo maneja las interacciones del usuario en la página de cursos
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Manejador para el botón de guardar curso
    const btnGuardarCurso = document.getElementById('btnGuardarCurso');
    if (btnGuardarCurso) {
        btnGuardarCurso.addEventListener('click', function() {
            const nombre = document.getElementById('nombreCurso').value.trim();
            const capacidad = document.getElementById('capacidadCurso').value;
            
            if (!nombre || !capacidad) {
                mostrarAlerta('Por favor complete todos los campos', 'warning');
                return;
            }
            
            // Aquí iría la lógica para guardar el curso
            console.log('Guardando curso:', { nombre, capacidad });
            
            // Simular guardado exitoso
            setTimeout(() => {
                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('agregarCursoModal'));
                modal.hide();
                
                // Mostrar mensaje de éxito
                mostrarAlerta('Curso guardado correctamente', 'success');
                
                // Limpiar el formulario
                document.getElementById('formAgregarCurso').reset();
                
                // Aquí iría la recarga de la tabla de cursos
                // recargarTablaCursos();
                
            }, 1000);
        });
    }
    
    // Cuando se cierra el modal, limpiar el formulario
    const agregarCursoModal = document.getElementById('agregarCursoModal');
    if (agregarCursoModal) {
        agregarCursoModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('formAgregarCurso').reset();
        });
    }
});

/**
 * Muestra una alerta en la interfaz de usuario
 * @param {string} mensaje - El mensaje a mostrar
 * @param {string} tipo - El tipo de alerta (success, danger, warning, info)
 */
function mostrarAlerta(mensaje, tipo = 'info') {
    // Crear el elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = 'alert';
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    
    // Agregar la alerta al inicio del contenido principal
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alerta, mainContent.firstChild);
        
        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            alerta.classList.remove('show');
            setTimeout(() => {
                alerta.remove();
            }, 150);
        }, 5000);
    }
}

/**
 * Función para cargar los cursos en la tabla
 * Esta función se llamaría después de cargar los datos del servidor
 */
function cargarCursosEnTabla(cursos) {
    const tbody = document.querySelector('#cursosTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = ''; // Limpiar la tabla
    
    cursos.forEach(curso => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nombre}</td>
            <td>${curso.capacidad}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-editar" data-id="${curso.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${curso.id}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Agregar manejadores de eventos para los botones de editar y eliminar
    agregarManejadoresEventos();
}

/**
 * Agrega los manejadores de eventos para los botones de la tabla
 */
function agregarManejadoresEventos() {
    // Manejador para el botón de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const idCurso = this.getAttribute('data-id');
            // Aquí iría la lógica para editar el curso
            console.log('Editando curso con ID:', idCurso);
            mostrarAlerta('Función de edición en desarrollo', 'info');
        });
    });
    
    // Manejador para el botón de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const idCurso = this.getAttribute('data-id');
            
            if (confirm('¿Está seguro de que desea eliminar este curso?')) {
                // Aquí iría la lógica para eliminar el curso
                console.log('Eliminando curso con ID:', idCurso);
                mostrarAlerta('Curso eliminado correctamente', 'success');
                // Recargar la tabla después de eliminar
                // cargarCursosEnTabla(obtenerCursosDelServidor());
            }
        });
    });
}

// Ejemplo de cómo se cargarían los cursos (esto sería reemplazado por una llamada al servidor)
function cargarDatosEjemplo() {
    const cursosEjemplo = [
        { id: 1, nombre: 'Matemáticas Avanzadas', capacidad: 30 },
        { id: 2, nombre: 'Física Cuántica', capacidad: 25 },
        { id: 3, nombre: 'Programación Web', capacidad: 35 },
        { id: 4, nombre: 'Bases de Datos', capacidad: 30 },
        { id: 5, nombre: 'Inteligencia Artificial', capacidad: 20 }
    ];
    
    cargarCursosEnTabla(cursosEjemplo);
}

// Cargar datos de ejemplo al iniciar (esto sería reemplazado por una llamada al servidor)
// Descomenta la siguiente línea para ver datos de ejemplo
// window.addEventListener('load', cargarDatosEjemplo);
