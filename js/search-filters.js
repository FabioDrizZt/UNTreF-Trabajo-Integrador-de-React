// Estado global para búsqueda y filtros
let searchTerm = ''
let selectedGenres = []
let selectedCategories = []
let allMovies = []

// Inicializar filtros de género cuando se carga el contenido
const initializeGenreFilters = (movies) => {
  const genreFiltersContainer = document.getElementById('genreFilters')
  if (!genreFiltersContainer) return

  // Obtener todos los géneros únicos, filtrando valores null/undefined y limpiando espacios
  const uniqueGenres = [...new Set(
    movies
      .map(movie => movie.gen)
      .filter(gen => gen != null && gen.trim() !== '')
      .map(gen => gen.trim())
  )].sort()
  
  genreFiltersContainer.innerHTML = ''
  
  uniqueGenres.forEach(genre => {
    if (!genre) return // Saltar géneros vacíos
    
    const button = document.createElement('button')
    button.className = 'filter-btn'
    button.dataset.genre = genre
    button.textContent = genre
    button.addEventListener('click', () => toggleGenreFilter(genre))
    genreFiltersContainer.appendChild(button)
  })
}

// Toggle de filtro de género
const toggleGenreFilter = (genre) => {
  if (!genre) {
    console.error('Género no proporcionado')
    return
  }
  
  // Limpiar espacios en blanco
  const cleanGenre = genre.trim()
  
  const index = selectedGenres.indexOf(cleanGenre)
  if (index > -1) {
    selectedGenres.splice(index, 1)
  } else {
    selectedGenres.push(cleanGenre)
  }
  updateFilterButtons()
  applyFilters()
}

// Toggle de filtro de categoría
const toggleCategoryFilter = (category) => {
  if (!category) {
    console.error('Categoría no proporcionada')
    return
  }
  
  const index = selectedCategories.indexOf(category)
  if (index > -1) {
    selectedCategories.splice(index, 1)
  } else {
    selectedCategories.push(category)
  }
  
  updateFilterButtons()
  applyFilters()
}

// Actualizar estado visual de los botones de filtro
const updateFilterButtons = () => {
  // Actualizar botones de género
  document.querySelectorAll('[data-genre]').forEach(btn => {
    const genre = btn.dataset.genre ? btn.dataset.genre.trim() : ''
    if (genre && selectedGenres.some(selected => selected.trim() === genre)) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })
  
  // Actualizar botones de categoría
  document.querySelectorAll('[data-category]').forEach(btn => {
    if (selectedCategories.includes(btn.dataset.category)) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })
}

// Función principal de filtrado
const filterMovies = (movies, searchTerm, selectedGenres, selectedCategories) => {
  if (!movies || !Array.isArray(movies)) {
    return []
  }
  
  return movies.filter(movie => {
    // Búsqueda por término (case-insensitive)
    const matchesSearch = !searchTerm || 
      (movie.busqueda && movie.busqueda.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Filtro por género - comparación exacta con limpieza de espacios
    let matchesGenre = true
    if (selectedGenres.length > 0) {
      if (!movie.gen) {
        matchesGenre = false
      } else {
        const movieGenre = movie.gen.trim()
        matchesGenre = selectedGenres.some(selectedGenre => selectedGenre.trim() === movieGenre)
      }
    }
    
    // Filtro por categoría - comparación exacta
    const matchesCategory = selectedCategories.length === 0 || 
      (movie.categoria && selectedCategories.includes(movie.categoria))
    
    // Todos los filtros deben cumplirse (AND)
    return matchesSearch && matchesGenre && matchesCategory
  })
}

// Aplicar filtros y actualizar la vista
const applyFilters = () => {
  if (!allMovies || allMovies.length === 0) return
  
  const filteredMovies = filterMovies(allMovies, searchTerm, selectedGenres, selectedCategories)
  
  // Actualizar contador de resultados
  updateResultsCount(filteredMovies.length)
  
  // Renderizar películas filtradas
  renderFilteredMovies(filteredMovies)
}

// Renderizar películas filtradas
const renderFilteredMovies = (filteredMovies) => {
  const container = document.querySelector('.container')
  if (!container) return
  
  if (filteredMovies.length === 0) {
    container.innerHTML = `
      <div class="error">
        <h2 class="red-text">No se encontraron resultados</h2>
        <p>Intenta con otros términos de búsqueda o filtros diferentes 🍿</p>
      </div>
    `
    return
  }
  
  // Obtener géneros únicos de las películas filtradas (no usar array hardcodeado)
  const generosUnicos = [...new Set(
    filteredMovies
      .map(movie => movie.gen)
      .filter(gen => gen != null && gen.trim() !== '')
      .map(gen => gen.trim())
  )].sort()
  
  let armoHTML = ''
  
  generosUnicos.forEach(gen => {
    // Filtrar películas de este género específico
    const resultado = filteredMovies.filter(cont => {
      const contGen = cont.gen ? cont.gen.trim() : ''
      return contGen === gen
    })
    
    if (resultado.length > 0) {
      armoHTML += `<article class="genero"><h2>${gen}</h2></article>`
      resultado.forEach(contenidoFiltrado => {
        const { id, poster, titulo, categoria } = contenidoFiltrado
        armoHTML += `
          <div class="card">
            <a href="movie.html?id=${id}">
              <div class="card-picture">
                <img src="${poster}" alt="${titulo}" title="${titulo}">
              </div>
              <div class="card-bottom">
                <p class="card-bottom-title">${titulo}</p>
                <p>${categoria}</p>
              </div>
            </a>
          </div>
        `
      })
    }
  })
  
  container.innerHTML = armoHTML
}

// Actualizar contador de resultados
const updateResultsCount = (count) => {
  const resultsCount = document.getElementById('resultsCount')
  if (!resultsCount) return
  
  if (searchTerm || selectedGenres.length > 0 || selectedCategories.length > 0) {
    resultsCount.textContent = `Se encontraron ${count} resultado${count !== 1 ? 's' : ''}`
    resultsCount.style.display = 'block'
  } else {
    resultsCount.style.display = 'none'
  }
}

// Limpiar todos los filtros
const clearAllFilters = () => {
  searchTerm = ''
  selectedGenres = []
  selectedCategories = []
  
  const searchInput = document.getElementById('searchInput')
  if (searchInput) {
    searchInput.value = ''
  }
  
  updateFilterButtons()
  applyFilters()
}

// Variable para rastrear si los eventos ya fueron inicializados
let filtersInitialized = false

// Inicializar eventos
const initializeSearchFilters = () => {
  // Evitar inicialización múltiple
  if (filtersInitialized) return
  
  // Evento de búsqueda en tiempo real
  const searchInput = document.getElementById('searchInput')
  if (searchInput) {
    // Remover listener anterior si existe
    searchInput.removeEventListener('input', handleSearchInput)
    searchInput.addEventListener('input', handleSearchInput)
  }
  
  // Eventos de filtros de categoría - usar event delegation para evitar múltiples listeners
  const categoryFiltersContainer = document.getElementById('categoryFilters')
  if (categoryFiltersContainer) {
    // Remover listener anterior si existe
    categoryFiltersContainer.removeEventListener('click', handleCategoryFilterClick)
    categoryFiltersContainer.addEventListener('click', handleCategoryFilterClick)
  }
  
  // Botón limpiar filtros
  const clearBtn = document.getElementById('clearFilters')
  if (clearBtn) {
    clearBtn.removeEventListener('click', clearAllFilters)
    clearBtn.addEventListener('click', clearAllFilters)
  }
  
  filtersInitialized = true
}

// Handler para el input de búsqueda
const handleSearchInput = (e) => {
  searchTerm = e.target.value.trim()
  applyFilters()
}

// Handler para los clicks en filtros de categoría (event delegation)
const handleCategoryFilterClick = (e) => {
  // Verificar si el click fue directamente en el botón o en su contenido
  const button = e.target.closest('[data-category]')
  if (button && button.dataset.category) {
    e.preventDefault()
    e.stopPropagation()
    toggleCategoryFilter(button.dataset.category)
  }
}

// Función para establecer las películas (llamada desde app.js)
const setMovies = (movies) => {
  allMovies = movies
  initializeGenreFilters(movies)
  
  // Asegurar que los eventos estén inicializados
  if (!filtersInitialized) {
    initializeSearchFilters()
  }
  
  applyFilters()
}

// Exponer setMovies globalmente para que app.js pueda usarla
window.setMovies = setMovies

// Inicializar cuando el DOM esté listo
const initOnReady = () => {
  // Esperar a que los elementos estén disponibles
  const checkElements = () => {
    const searchInput = document.getElementById('searchInput')
    const categoryFilters = document.getElementById('categoryFilters')
    const clearBtn = document.getElementById('clearFilters')
    
    if (searchInput && categoryFilters && clearBtn) {
      initializeSearchFilters()
    } else {
      // Reintentar después de un breve delay
      setTimeout(checkElements, 50)
    }
  }
  
  checkElements()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOnReady)
} else {
  initOnReady()
}

