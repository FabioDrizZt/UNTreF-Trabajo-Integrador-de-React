const generos = ['Ciencia Ficción', 'Drama', 'Suceso Real', 'Suspenso', 'Fantasía', 'Familia', 'Acción', 'Terror', 'Aventura'].sort()

// Función helper global para obtener la base path (evita redeclaraciones)
if (typeof window.getBasePath !== 'function') {
  window.getBasePath = () => {
    if (window.BASE_PATH) {
      return window.BASE_PATH
    }
    const pathname = window.location.pathname
    const pathWithoutFile = pathname.replace(/\/[^/]+\.html$/, '').replace(/\/$/, '')
    const segments = pathWithoutFile.split('/').filter(s => s)
    if (segments.length > 0) {
      return '/' + segments[0] + '/'
    }
    return '/'
  }
}

const URL = `${window.getBasePath()}data/trailerflix.json`
let contenido
let armoHTML

const retornoCard = (contenido) => {
  const { id, poster, titulo, categoria } = contenido
  return `<div class="card">
              <a href="movie.html?id=${id}">
                <div class="card-picture">
                    <img src="${poster}" alt="${titulo}" title="${titulo}">
                </div>
                <div class="card-bottom">
                    <p class="card-bottom-title">${titulo}</p>
                    <p>${categoria}</p>
                </div>
              </a>
            </div>`
}

const retornoError = () => {
  return `<div class="error">
                  <h1 class="red-text">La función está demorada</h1>
                  <p>Estamos haciendo algunos ajustes 🍿</p>
                  <p>Intenta nuevamente en algunos instantes... 🎞</p>
              </div>`
}

const retornoGenero = (gen) => {
  return `<article class="genero">
              <h2>${gen}</h2>
          </article>`
}

const container = document.querySelector('.container')
const getContenido = async (URL) => {
  armoHTML = ''
  try {
    const response = await fetch(URL)
    const data = await response.json()
    contenido = await data
    if (contenido.length > 0) {
      // Esperar a que el módulo de búsqueda y filtros esté listo
      const waitForSearchFilters = () => {
        if (typeof window.setMovies === 'function') {
          window.setMovies(contenido)
        } else {
          // Reintentar después de un breve delay
          setTimeout(waitForSearchFilters, 50)
        }
      }
      waitForSearchFilters()
    }
  } catch (error) {
    armoHTML = retornoError()
    if (container) {
      container.innerHTML = armoHTML
    }
  }
}

// Esperar a que el DOM esté listo antes de cargar contenido
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    getContenido(URL)
  })
} else {
  getContenido(URL)
}
