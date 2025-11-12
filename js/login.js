const URL_USUARIOS = '/data/usuarios.json'

// Función para validar el login
const validarUsuario = async (username, password) => {
  try {
    const response = await fetch(URL_USUARIOS)
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }
    const datos = await response.json()
    
    // Verificar que datos.users existe y es un array
    if (!datos.users || !Array.isArray(datos.users)) {
      console.error('Formato de datos inválido:', datos)
      return null
    }
    
    const usuarioEncontrado = datos.users.find(user => 
      user.username === username && user.password === password
    )
    
    return usuarioEncontrado || null
  } catch (error) {
    console.error('Error al cargar el archivo de usuarios:', error)
    return null
  }
}

// Mostrar el nombre de usuario y el botón de cerrar sesión
function mostrarUsuario(username) {
  const loginForm = document.getElementById('loginForm')
  const userInfo = document.getElementById('userInfo')
  const userNameDisplay = document.getElementById('userNameDisplay')
  
  if (loginForm) loginForm.style.display = 'none'
  if (userInfo) {
    userInfo.style.display = 'flex'
  }
  if (userNameDisplay) {
    userNameDisplay.textContent = `Bienvenido, ${username}`
  }
}

// Inicializar el sistema de login
const initializeLogin = () => {
  const loginForm = document.getElementById('loginForm')
  const userInfo = document.getElementById('userInfo')
  const userNameDisplay = document.getElementById('userNameDisplay')
  const logoutBtn = document.getElementById('logoutBtn')
  
  // Verificar que los elementos existen
  if (!loginForm || !userInfo || !userNameDisplay || !logoutBtn) {
    console.error('Elementos del formulario de login no encontrados')
    return
  }
  
  // Mostrar el nombre de usuario almacenado al cargar la página
  const currentUser = window.localStorage.getItem('usuario')
  if (currentUser) {
    mostrarUsuario(currentUser)
  } else {
    loginForm.style.display = 'block'
    userInfo.style.display = 'none'
  }
  
  // Manejar el envío del formulario
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const usernameInput = document.getElementById('username')
    const passwordInput = document.getElementById('password')
    
    if (!usernameInput || !passwordInput) {
      console.error('Campos de entrada no encontrados')
      return
    }
    
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()
    
    if (!username || !password) {
      window.alert('Por favor, completa todos los campos')
      return
    }
    
    const usuarioValido = await validarUsuario(username, password)
    if (usuarioValido) {
      window.localStorage.setItem('usuario', username)
      mostrarUsuario(username)
      // Limpiar los campos del formulario
      usernameInput.value = ''
      passwordInput.value = ''
    } else {
      window.alert('Usuario o contraseña incorrectos')
    }
  })
  
  // Manejar el cierre de sesión
  logoutBtn.addEventListener('click', () => {
    window.localStorage.removeItem('usuario')
    userInfo.style.display = 'none'
    loginForm.style.display = 'block'
    // Limpiar los campos del formulario
    const usernameInput = document.getElementById('username')
    const passwordInput = document.getElementById('password')
    if (usernameInput) usernameInput.value = ''
    if (passwordInput) passwordInput.value = ''
  })
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLogin)
} else {
  // DOM ya está listo
  initializeLogin()
}
