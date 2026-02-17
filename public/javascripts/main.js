// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  console.log(e);
});

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el elemento header
    const header = document.querySelector('header');
    
    // Función para manejar el scroll
    function handleScroll() {
        // Si el scroll vertical es mayor a 50px, añadir la clase 'scrolled'
        // De lo contrario, quitarla
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Añadir la clase 'scrolled' si ya hay scroll al cargar la página
    handleScroll();
    
    // Escuchar el evento de scroll
    window.addEventListener('scroll', handleScroll);
});


