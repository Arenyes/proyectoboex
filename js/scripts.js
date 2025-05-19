document.addEventListener('DOMContentLoaded', () => {
    // Cargar noticias en portada
    cargarNoticias();
    
    // Eventos para abrir/cerrar modal
    document.querySelectorAll('[data-noticia]').forEach(noticia => {
        noticia.addEventListener('click', () => {
            const idNoticia = noticia.getAttribute('data-noticia');
            mostrarNoticiaCompleta(idNoticia);
        });
    });
    document.querySelector('.cerrar-modal').addEventListener('click', cerrarModal);

    // Reemplazo de eventos para todas las noticias terciarias
    document.querySelectorAll('[id^="titulo-terciaria-"]').forEach(titulo => {
        const numero = titulo.id.split('-')[2]; // Extrae el número
        titulo.addEventListener('click', () => {
            cargarModal(`terciaria${numero}.txt`);
        });
    });
});

// Función para cargar noticias en portada
function cargarNoticias() {
    // Noticia principal
    fetch('./noticias/principal.txt')
        .then(response => response.text())
        .then(texto => {
            const [titulo, extracto] = texto.split('---').map(p => p.trim());
            document.getElementById('titulo-principal').textContent = titulo || 'Sin título';
            document.getElementById('extracto-principal').textContent = extracto || 'Extracto no disponible';
        });

    // Noticias secundarias
    [1, 2].forEach(id => {
        fetch(`./noticias/secundaria${id}.txt`)
            .then(response => response.text())
            .then(texto => {
                const [titulo, extracto] = texto.split('---').map(p => p.trim());
                document.getElementById(`titulo-secundaria-${id}`).textContent = titulo || 'Sin título';
                document.getElementById(`extracto-secundaria-${id}`).textContent = extracto || 'Extracto no disponible';
            });
    });

    // Noticias terciarias (solo título)
    [1, 2, 3, 4, 5].forEach(id => {
        fetch(`./noticias/terciaria${id}.txt`)
            .then(response => response.text())
            .then(texto => {
                const [titulo] = texto.split('---').map(p => p.trim());
                document.getElementById(`titulo-terciaria-${id}`).textContent = titulo || 'Sin título';
            })
            .catch(error => console.error(`Error al cargar terciaria${id}.txt:`, error));
    });
}

// Función para mostrar noticia completa
function mostrarNoticiaCompleta(idNoticia) {
    fetch(`./noticias/${idNoticia}.txt`)
        .then(response => response.text())
        .then(texto => {
            const [titulo, subtitulo, contenido] = texto.split('---').map(p => p.trim());
            
            // Asignar título
            document.getElementById('modal-titulo').textContent = titulo || 'Sin título';
            
            // Asignar subtítulo
            const modalSubtitulo = document.getElementById('modal-subtitulo');
            if (modalSubtitulo) {
                modalSubtitulo.textContent = subtitulo || '';
                modalSubtitulo.style.display = subtitulo ? 'block' : 'none'; // Ocultar si no hay subtítulo
            }

            // Procesar contenido (párrafos y listas)
            let cuerpoHTML = '';
            if (contenido) {
                cuerpoHTML = contenido
                    .split('\n\n') // Separar párrafos
                    .filter(p => p.trim() !== '') // Filtrar vacíos
                    .map(parrafo => {
                        // Detectar listas
                        if (parrafo.startsWith('- ')) {
                            const items = parrafo.split('\n')
                                .map(item => `<li>${item.replace('- ', '').trim()}</li>`)
                                .join('');
                            return `<ul>${items}</ul>`;
                        }
                        // Párrafos normales (conservar saltos de línea internos)
                        return `<p>${parrafo.replace(/\n/g, '<br>')}</p>`;
                    })
                    .join('');
            }
            
            // Insertar en el modal (con estilos limpios)
            document.getElementById('modal-cuerpo').innerHTML = cuerpoHTML || 'Contenido no disponible';
            document.getElementById('modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('modal-titulo').textContent = 'Error';
            document.getElementById('modal-cuerpo').textContent = 'No se pudo cargar la noticia.';
            document.getElementById('modal').style.display = 'block';
        });
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// INICIO: CÓDIGO PARA EL ANUNCIO TEMPORAL DE LA ASOCIACIÓN
// Para desactivar el anuncio, cambia esta variable a false
const mostrarAnuncioAsociacion = true;

document.addEventListener('DOMContentLoaded', function() {
    // Control para mostrar/ocultar el anuncio
    const anuncio = document.getElementById('anuncio-asociacion');
    
    if (mostrarAnuncioAsociacion && anuncio) {
        // Mostrar el anuncio si está activado
        anuncio.style.display = 'flex';
        
        // Configurar el botón para cerrar el anuncio
        const cerrarBtn = document.getElementById('cerrar-anuncio');
        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', function() {
                anuncio.style.display = 'none';
            });
        }
        
        // Configurar los enlaces a noticias específicas
        document.querySelectorAll('.enlace-noticia').forEach(function(enlace) {
            enlace.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener el ID de la noticia
                const idNoticia = this.getAttribute('data-noticia');
                
                // Cerrar el anuncio
                anuncio.style.display = 'none';
                
                // Mostrar la noticia correspondiente
                mostrarNoticiaCompleta(idNoticia);
            });
        });
    }
});
// FIN: CÓDIGO PARA EL ANUNCIO TEMPORAL DE LA ASOCIACIÓN