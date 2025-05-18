document.addEventListener('DOMContentLoaded', () => {
    // Cargar noticias
    cargarNoticias();
    
    // Configurar eventos para abrir el modal
    document.querySelectorAll('.noticia').forEach(noticia => {
        const boton = noticia.querySelector('.boton-leer');
        if (boton) {
            boton.addEventListener('click', () => {
                const idNoticia = noticia.getAttribute('data-noticia');
                mostrarNoticiaCompleta(idNoticia);
            });
        }
    });
    
    // Configurar eventos para las noticias mini (terciarias)
    document.querySelectorAll('.noticia-mini').forEach(noticia => {
        noticia.addEventListener('click', () => {
            const idNoticia = noticia.getAttribute('data-noticia');
            mostrarNoticiaCompleta(idNoticia);
        });
    });
    
    // Configurar evento para cerrar el modal
    document.querySelector('.cerrar-modal').addEventListener('click', cerrarModal);
});

// Función para cargar las noticias en la página
function cargarNoticias() {
    // Cargar noticia principal
    fetch('../noticias/principal.txt')
        .then(response => response.text())
        .then(texto => {
            const partes = texto.split('---').map(p => p.trim());
            document.getElementById('titulo-principal').textContent = partes[0] || 'Sin título';
            document.getElementById('extracto-principal').textContent = partes[1] || 'Extracto no disponible';
        })
        .catch(error => console.error('Error al cargar noticia principal:', error));
    
    // Cargar noticias secundarias
    [1, 2].forEach(id => {
        fetch(`../noticias/secundaria${id}.txt`)
            .then(response => response.text())
            .then(texto => {
                const partes = texto.split('---').map(p => p.trim());
                document.getElementById(`titulo-secundaria-${id}`).textContent = partes[0] || 'Sin título';
                document.getElementById(`extracto-secundaria-${id}`).textContent = partes[1] || 'Extracto no disponible';
            })
            .catch(error => console.error(`Error al cargar secundaria${id}:`, error));
    });
    
    // Cargar noticias terciarias (sólo título)
    [1, 2, 3, 4, 5].forEach(id => {
        fetch(`../noticias/terciaria${id}.txt`)
            .then(response => response.text())
            .then(texto => {
                const partes = texto.split('---').map(p => p.trim());
                document.getElementById(`titulo-terciaria-${id}`).textContent = partes[0] || 'Sin título';
            })
            .catch(error => console.error(`Error al cargar terciaria${id}:`, error));
    });
}

// Función para mostrar noticia completa en el modal
function mostrarNoticiaCompleta(idNoticia) {
    fetch(`../noticias/${idNoticia}.txt`)
        .then(response => response.text())
        .then(texto => {
            const partes = texto.split('---').map(p => p.trim());
            
            // Asignar título
            document.getElementById('modal-titulo').textContent = partes[0] || 'Sin título';
            
            // Asignar subtítulo
            const modalSubtitulo = document.getElementById('modal-subtitulo');
            if (modalSubtitulo && partes.length > 1) {
                modalSubtitulo.textContent = partes[1] || '';
                modalSubtitulo.style.display = partes[1] ? 'block' : 'none';
            }
            
            // Procesar contenido
            if (partes.length > 2) {
                let contenido = partes[2];
                let cuerpoHTML = '';
                
                // Procesar el contenido para convertir párrafos y listas
                cuerpoHTML = contenido
                    .split('\n\n')
                    .filter(p => p.trim() !== '')
                    .map(parrafo => {
                        // Detectar listas
                        if (parrafo.startsWith('- ')) {
                            const items = parrafo.split('\n')
                                .map(item => `<li>${item.replace('- ', '').trim()}</li>`)
                                .join('');
                            return `<ul>${items}</ul>`;
                        }
                        // Párrafos normales
                        return `<p>${parrafo.replace(/\n/g, '<br>')}</p>`;
                    })
                    .join('');
                
                document.getElementById('modal-cuerpo').innerHTML = cuerpoHTML || 'Contenido no disponible';
            } else {
                document.getElementById('modal-cuerpo').innerHTML = '<p>No hay contenido disponible para esta noticia.</p>';
            }
            
            // Mostrar el modal
            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        })
        .catch(error => {
            console.error('Error al cargar la noticia:', error);
            document.getElementById('modal-titulo').textContent = 'Error';
            document.getElementById('modal-cuerpo').innerHTML = '<p>No se pudo cargar la noticia.</p>';
            document.getElementById('modal').style.display = 'block';
        });
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}