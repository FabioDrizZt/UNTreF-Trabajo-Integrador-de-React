const URL = '/data/trailerflix.json'
const movieDetailsContainer = document.querySelector('.movie-details')

// Obtener el ID de la URL
const params = new URLSearchParams(window.location.search)
const movieId = parseInt(params.get('id'))

const getMovieDetails = async () => {
  try {
    const response = await fetch(URL)
    const data = await response.json()
    const movie = data.find(item => item.id === movieId)

    if (movie) {
      movieDetailsContainer.innerHTML = `
        <div class="movie-poster">
          <img src="${movie.poster}" alt="${movie.titulo}" />
        </div>
        <div class="movie-info">
          <h2>${movie.titulo}</h2>
          <p><strong>Resumen:</strong> ${movie.resumen}</p>
          <iframe width="560" height="315" src="${movie.trailer}" frameborder="0" allowfullscreen></iframe>
          <p><strong>Reparto:</strong> ${movie.reparto}</p>
        </div>
      `
    } else {
      movieDetailsContainer.innerHTML = '<p class="error">Película no encontrada.</p>'
    }
  } catch (error) {
    movieDetailsContainer.innerHTML = '<p class="error">Error al cargar los detalles de la película.</p>'
  }
}

getMovieDetails()
