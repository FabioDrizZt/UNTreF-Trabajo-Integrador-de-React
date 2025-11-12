# Trabajo Integrador: Aplicación de Streaming con React

## Introducción

El objetivo de este **Trabajo Integrador** es desarrollar una aplicación completa de visualización de trailers, llamada **Trailerflix**, utilizando **React** y **Vite**. Este proyecto integra los conceptos fundamentales de React aprendidos durante el curso, incluyendo el manejo de estado, efectos, routing, contexto global y hooks personalizados. Además, deberán implementar funcionalidades avanzadas de **búsqueda y filtrado** para mejorar la experiencia del usuario.

## Fechas Importantes

- **Fecha de entrega**: Domingo 16 de noviembre de 2024 hasta las 23:59
- **Formato de entrega**: Repositorio de GitHub con instrucciones claras de instalación y ejecución

## Archivos de Datos

Los archivos JSON con la información de películas y usuarios se encuentran en la carpeta **`data/`**:
- `data/trailerflix.json` - Contiene el catálogo completo de películas y series
- `data/usuarios.json` - Contiene los usuarios registrados para autenticación

**IMPORTANTE**: Al convertir a React con Vite, estos archivos deben moverse a la carpeta **`public/data/`** para que sean accesibles mediante fetch.

**NOTA**: La versión vanilla (HTML/CSS/JS) ya incluye implementación de búsqueda y filtros como referencia. Los estudiantes deben implementar estas funcionalidades en React siguiendo los mismos principios pero utilizando hooks y componentes de React.

## Requerimientos Técnicos

La aplicación debe implementar lo siguiente:

### Hooks y Funcionalidades Básicas

- **useState**: Para manejar el estado de las películas, usuarios, búsqueda, filtros y otros datos relevantes.
- **useEffect**: Para manejar la carga inicial de datos (como las películas desde el archivo JSON) y la actualización del historial.
- **react-router**: Para manejar la navegación entre la página principal y la de detalles de la película.
- **useNavigate**: Para redirigir a los usuarios entre las diferentes páginas (por ejemplo, después de seleccionar una película).
- **useContext**: Para manejar el estado global de autenticación del usuario. Este estado debe mostrarse en todas las páginas, donde el componente de login muestra el nombre de usuario cuando está logueado y el botón de cierre de sesión. No se requiere redirigir después de iniciar sesión.
- **Custom Hooks**: Para encapsular la lógica de autenticación de usuarios y la lógica de filtrado/búsqueda (obligatorio).

### Funcionalidades Avanzadas (Nuevas)

- **Sistema de Búsqueda**: Implementar un campo de búsqueda que permita buscar películas y series por título, género, reparto o cualquier palabra clave. La búsqueda debe ser en tiempo real (mientras el usuario escribe) y utilizar el campo `busqueda` del JSON.
- **Sistema de Filtros**: Implementar filtros múltiples que permitan:
  - Filtrar por **género** (Ciencia Ficción, Drama, Suspenso, etc.)
  - Filtrar por **categoría** (Película o Serie)
  - Los filtros deben poder combinarse entre sí
  - Los filtros deben poder combinarse con la búsqueda
  - Debe mostrar un contador de resultados encontrados
  - Debe mostrar un mensaje cuando no hay resultados
- **Persistencia de Sesión**: Implementar persistencia de sesión usando `localStorage` para que el usuario permanezca logueado al recargar la página.

## Pasos para la Conversión

### 1. Inicializar el Proyecto con Vite
- Crea un nuevo proyecto utilizando **Vite**.
- Organiza la estructura del proyecto en carpetas adecuadas (`components`, `hooks`, `context`, etc.).
- **Crea la carpeta `public/data/`** y copia los archivos `trailerflix.json` y `usuarios.json` dentro de ella.

#### Ejemplo de Fetch en React:
En React con Vite, los archivos en la carpeta `public/` son accesibles directamente. Para cargar los datos:

```javascript
// Ejemplo de carga de películas
useEffect(() => {
  const fetchMovies = async () => {
    try {
      const response = await fetch('/data/trailerflix.json');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error al cargar películas:', error);
    }
  };
  
  fetchMovies();
}, []);

// Ejemplo de validación de usuarios
const fetchUsers = async () => {
  try {
    const response = await fetch('/data/usuarios.json');
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    return [];
  }
};
```

**Nota**: La ruta comienza con `/data/` (no `./data/` ni `../data/`) porque Vite sirve automáticamente el contenido de `public/` desde la raíz.

#### Ejemplo de Implementación de Búsqueda y Filtros:

```javascript
// Ejemplo de lógica de filtrado combinado
const filterMovies = (movies, searchTerm, selectedGenres, selectedCategories) => {
  return movies.filter(movie => {
    // Búsqueda por término
    const matchesSearch = !searchTerm || 
      movie.busqueda.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por género
    const matchesGenre = selectedGenres.length === 0 || 
      selectedGenres.includes(movie.gen);
    
    // Filtro por categoría
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(movie.categoria);
    
    // Todos los filtros deben cumplirse (AND)
    return matchesSearch && matchesGenre && matchesCategory;
  });
};

// Uso en componente
const [searchTerm, setSearchTerm] = useState('');
const [selectedGenres, setSelectedGenres] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);

const filteredMovies = useMemo(() => {
  return filterMovies(movies, searchTerm, selectedGenres, selectedCategories);
}, [movies, searchTerm, selectedGenres, selectedCategories]);
```

### 2. Crear las Rutas con `react-router`
- Implementa el enrutamiento con **react-router**:
  - Ruta principal (`/`): Donde se mostrarán las películas disponibles.
  - Ruta de detalles de la película (`/movie/:id`): Donde se mostrará la información de la película seleccionada.
  - **Ruta 404 (`*`)**: Para manejar páginas no encontradas. Debe mostrar un mensaje de error y un botón para volver al inicio.

### 3. Página Principal (Componente `Home`)
- **useState**: Para manejar la lista de películas, el término de búsqueda, los filtros seleccionados y los resultados filtrados.
- **useEffect**: Para cargar las películas desde el archivo `trailerflix.json` y aplicar filtros/búsqueda cuando cambien.
- **useNavigate**: Al hacer clic en una película, navega a la página de detalles usando `useNavigate()`.
- **Componente de Búsqueda**: Implementar un input de búsqueda que filtre en tiempo real mientras el usuario escribe.
- **Componente de Filtros**: Implementar filtros por género y categoría con botones o selectores múltiples.
- **Lógica de Filtrado**: Crear una función que combine búsqueda y filtros para mostrar los resultados correctos.
- **Mensajes de Estado**: Mostrar mensajes cuando no hay resultados o cuando se están cargando los datos.

### 4. Página de Detalles de la Película (Componente `MovieDetail`)
- **useEffect**: Para leer el ID de la película desde la URL y cargar los datos correspondientes.
- **useState**: Para manejar los detalles de la película.
- Muestra la información de la película (poster, título, resumen, reparto, y tráiler).
- Incluye un botón para **volver al catálogo**.

### 5. Página 404 (Componente `NotFound`)
- Crea un componente para manejar rutas no encontradas.
- Debe mostrar:
  - El logo de **TRAILERFLIX**.
  - Un mensaje de error **404 - Página no encontrada**.
  - Una descripción amigable del error.
  - Un botón para **volver al inicio** usando `useNavigate()`.
- Mantén la estética consistente con el resto de la aplicación (fondo negro, textos en rojo y blanco).

### 6. Sistema de Autenticación
- **useContext**: Crea un contexto para manejar el estado de autenticación del usuario.
  - El formulario de inicio de sesión debe mostrarse si el usuario no ha iniciado sesión.
  - Una vez autenticado, debe actualizarse el componente de login para mostrar el nombre y el botón de cerrar sesión.

### 7. Implementación de Custom Hooks
- **useAuth**: Un custom hook para manejar la lógica de autenticación de usuarios.
- **useFilterMovies**: Un custom hook para encapsular la lógica de filtrado y búsqueda de películas (obligatorio).

### 8. Sistema de Búsqueda y Filtros
- **Componente SearchBar**: Crear un componente reutilizable para el campo de búsqueda.
- **Componente Filters**: Crear un componente para los filtros de género y categoría.
- **Lógica de Búsqueda**: Implementar búsqueda que compare el término ingresado con el campo `busqueda` del JSON (búsqueda case-insensitive).
- **Lógica de Filtros**: Implementar filtros que permitan seleccionar múltiples géneros y categorías.
- **Combinación de Filtros**: Los filtros y la búsqueda deben funcionar de forma combinada (AND lógico).
- **Feedback Visual**: Mostrar el número de resultados encontrados y mensajes apropiados cuando no hay coincidencias.

## Requerimientos Funcionales

### Funcionalidades Básicas

1. **Visualización de películas**: La lista de películas debe cargarse dinámicamente desde el archivo `trailerflix.json` ubicado en `public/data/`.
2. **Autenticación de usuarios**: El sistema debe permitir iniciar sesión usando los datos de `usuarios.json` ubicado en `public/data/`. Debe mostrar el formulario de login o la información del usuario según corresponda. Al iniciar sesión, solo debe actualizarse el componente de login, sin redirecciones.
3. **Persistencia de sesión**: El usuario debe permanecer logueado al recargar la página usando `localStorage`.
4. **Navegación**: Implementar navegación entre la página principal, detalles de película y página 404.
5. **Página 404**: Debe mostrar un mensaje de error amigable cuando se acceda a una ruta inexistente, con opción de volver al inicio.
6. **Hooks personalizados**: Se deben implementar hooks personalizados para la lógica de autenticación y para filtrado/búsqueda (ambos obligatorios).
7. **Responsive**: La aplicación debe verse correctamente en dispositivos móviles y desktop.

### Funcionalidades Avanzadas (Nuevas)

8. **Búsqueda en tiempo real**: 
   - Implementar un campo de búsqueda que filtre las películas mientras el usuario escribe.
   - La búsqueda debe buscar en el campo `busqueda` del JSON (que incluye título, género, reparto, etc.).
   - La búsqueda debe ser case-insensitive (no distinguir mayúsculas/minúsculas).
   - Debe mostrar resultados inmediatamente al escribir.

9. **Filtros múltiples**:
   - Implementar filtro por **género** con opciones para todos los géneros disponibles en el JSON.
   - Implementar filtro por **categoría** (Película/Serie).
   - Los filtros deben poder seleccionarse múltiples opciones simultáneamente.
   - Los filtros deben poder combinarse con la búsqueda.

10. **Feedback al usuario**:
    - Mostrar el número de resultados encontrados (ej: "Se encontraron 15 resultados").
    - Mostrar un mensaje cuando no hay resultados que coincidan con la búsqueda/filtros.
    - Indicar visualmente cuando se están aplicando filtros activos.

11. **Limpieza de filtros**:
    - Implementar un botón para limpiar todos los filtros y la búsqueda.
    - Al limpiar, debe mostrar todas las películas nuevamente.

## Estructura Sugerida del Proyecto React

```
proyecto-react/
├── public/
│   └── data/
│       ├── trailerflix.json
│       └── usuarios.json
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   ├── MovieCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Filters.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MovieDetail.jsx
│   │   └── NotFound.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFilterMovies.js
│   ├── utils/
│   │   └── filterMovies.js (opcional - funciones de filtrado)
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Evaluación

1. **Funcionalidad**: La aplicación debe funcionar correctamente en React.
2. **Uso de Hooks**: Se evaluará el uso adecuado de `useState`, `useEffect`, `useNavigate`, `useContext`, y custom hooks.
3. **Modularidad**: El código debe estar bien organizado y estructurado en componentes reutilizables.
4. **Estado Global**: El estado de autenticación debe manejarse correctamente con `useContext` y reflejarse en todas las páginas.
5. **Manejo de errores**: Implementación correcta de la página 404 y manejo de errores en las peticiones fetch.
6. **Carga de datos**: Correcta implementación del fetch a los archivos JSON desde la carpeta `public/data/`.
7. **Búsqueda y Filtros**: Implementación correcta y funcional del sistema de búsqueda y filtros múltiples.
8. **Persistencia**: Implementación de persistencia de sesión con localStorage.
9. **UX/UI**: Interfaz intuitiva y feedback claro al usuario sobre los resultados de búsqueda y filtros.

## Entrega

Los alumnos deberán subir el proyecto a un repositorio de **GitHub**, con instrucciones claras para ejecutarlo, y enviar el enlace antes de la fecha límite.

### Instrucciones de Entrega

1. **Repositorio de GitHub**: 
   - Crear un repositorio público en GitHub
   - Incluir un archivo `README.md` con:
     - Descripción del proyecto
     - Instrucciones de instalación (`npm install` o `yarn install`)
     - Instrucciones de ejecución (`npm run dev` o `yarn dev`)
     - Capturas de pantalla de la aplicación funcionando
   
2. **Estructura del Proyecto**:
   - El proyecto debe estar completo y funcional
   - Todos los archivos deben estar incluidos (excepto `node_modules`)
   - Incluir archivo `.gitignore` apropiado

3. **Envío**:
   - Enviar el enlace del repositorio antes del **domingo 16 de noviembre de 2024 a las 23:59**
   - El enlace debe ser accesible y el repositorio debe estar público

### Notas Importantes

- Este es un **Trabajo Integrador** que evalúa todos los conceptos aprendidos durante el curso
- Se espera código limpio, bien organizado y comentado cuando sea necesario
- La aplicación debe ser completamente funcional sin errores en consola
- Se valorará especialmente la implementación correcta de búsqueda y filtros, así como la persistencia de sesión
- En caso de dudas, consultar con el profesor antes de la fecha de entrega

---

## Rúbrica de Evaluación

**Puntaje Total: 120 puntos** (100 puntos base + 20 puntos por funcionalidades avanzadas)

### 1. React Router - Navegación (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|------------------|---------------|---------------|-------------------|
| **Implementación de rutas** | Todas las rutas funcionan correctamente: `/` (Home), `/movie/:id` (Detalles), `*` (404). Navegación fluida con `useNavigate` | Rutas principales funcionan, puede faltar 404 o tener errores menores en navegación | Rutas implementadas pero con errores significativos en la navegación | No implementa react-router o rutas no funcionales |

**Puntos clave a evaluar:**
- ✅ Instalación de `react-router-dom`
- ✅ Configuración de `BrowserRouter`
- ✅ Ruta principal `/` funcional
- ✅ Ruta dinámica `/movie/:id` funcional
- ✅ Ruta 404 `*` implementada
- ✅ Uso correcto de `useNavigate()` para navegación programática

---

### 2. useState - Manejo de Estado Local (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|-----------------|-------------|---------------|-------------------|
| **Uso de useState** | `useState` usado correctamente en múltiples componentes: lista de películas, detalles de película, estados de carga, etc. | `useState` implementado en componentes principales con algunos errores menores | `useState` usado pero de forma incorrecta o incompleta | No usa `useState` o su uso es completamente erróneo |

**Puntos clave a evaluar:**
- ✅ Estado para lista de películas en Home
- ✅ Estado para detalles de película en MovieDetail
- ✅ Estados de carga (loading) implementados
- ✅ Manejo correcto de la actualización del estado

---

### 3. useEffect - Efectos y Carga de Datos (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|------------------|---------------|---------------|-------------------|
| **Implementación de useEffect** | `useEffect` usado correctamente para cargar datos de películas y usuarios. Manejo adecuado de dependencias y cleanup cuando necesario | `useEffect` implementado para carga de datos con errores menores en dependencias | `useEffect` usado pero con problemas significativos (bucles infinitos, dependencias incorrectas) | No usa `useEffect` o su uso genera errores críticos |

**Puntos clave a evaluar:**
- ✅ Carga de películas desde `/data/trailerflix.json`
- ✅ Carga de película individual en MovieDetail
- ✅ Array de dependencias correcto `[]` para carga inicial
- ✅ Manejo de errores en peticiones fetch
- ✅ Estados de carga mientras se obtienen datos

---

### 4. useContext - Estado Global de Autenticación (15 puntos)

| Criterio | Excelente (13-15) | Bueno (10-12) | Regular (6-9) | Insuficiente (0-5) |
|----------|------------------|---------------|---------------|-------------------|
| **Context API implementado** | `AuthContext` creado y usado correctamente. Estado de autenticación disponible en toda la app. Login y logout funcionan perfectamente. Se muestra nombre de usuario o formulario según corresponda. Persistencia con localStorage implementada | Context implementado, funciona pero con errores menores en la sincronización del estado o persistencia | Context creado pero con problemas significativos en su implementación o uso | No implementa `useContext` o no funciona |

**Puntos clave a evaluar:**
- ✅ Archivo `AuthContext.jsx` creado
- ✅ Provider envolviendo la aplicación
- ✅ Estado de usuario compartido globalmente
- ✅ Funciones `login` y `logout` disponibles en el contexto
- ✅ Componente Login actualizado según estado (formulario vs info usuario)
- ✅ Estado persiste durante la navegación
- ✅ Persistencia con localStorage (carga estado al iniciar app)

---

### 5. Custom Hook - useAuth (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|-----------------|-------------|---------------|-------------------|
| **Custom Hook implementado** | `useAuth` hook personalizado implementado correctamente. Encapsula lógica de autenticación, validación de usuarios contra `usuarios.json`, retorna funciones y estados necesarios | Hook creado y funcional con errores menores | Hook creado pero no encapsula correctamente la lógica o tiene errores | No implementa custom hook |

**Puntos clave a evaluar:**
- ✅ Archivo `useAuth.js` en carpeta `hooks/`
- ✅ Lógica de login encapsulada
- ✅ Validación contra `usuarios.json`
- ✅ Retorna funciones y estados necesarios
- ✅ Reutilizable y siguiendo convenciones de hooks

---

### 6. Página Principal - Home (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|-----------------|-------------|---------------|-------------------|
| **Componente Home funcional** | Muestra todas las películas correctamente, cards interactivas, navegación a detalles funciona perfectamente, diseño atractivo | Muestra películas, navegación funciona con errores menores de UI | Muestra películas pero con problemas en navegación o diseño | No muestra películas o no funciona |

**Puntos clave a evaluar:**
- ✅ Renderiza lista completa de películas
- ✅ Componentes `MovieCard` reutilizables
- ✅ Click en película navega a detalles
- ✅ Diseño responsive
- ✅ Manejo de estado de carga

---

### 7. Página de Detalles - MovieDetail (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|-----------------|-------------|---------------|-------------------|
| **Componente MovieDetail funcional** | Muestra todos los detalles de la película (poster, título, resumen, reparto, tráiler), obtiene ID de URL correctamente, botón volver funciona | Muestra información principal con detalles menores faltantes | Muestra información pero con problemas significativos | No muestra detalles o no funciona |

**Puntos clave a evaluar:**
- ✅ Uso de `useParams()` para obtener ID
- ✅ Carga de datos de película específica
- ✅ Muestra poster, título, resumen, reparto
- ✅ Integración de tráiler de YouTube
- ✅ Botón "Volver al catálogo" funcional
- ✅ Manejo de película no encontrada

---

### 8. Página 404 - NotFound (5 puntos)

| Criterio | Excelente (5) | Bueno (4) | Regular (2-3) | Insuficiente (0-1) |
|----------|--------------|-----------|---------------|-------------------|
| **Componente NotFound** | Página 404 completa con logo, mensaje de error, descripción amigable, botón de retorno funcional, estética consistente | Página 404 funcional con elementos menores faltantes | Página 404 básica sin estética o funcionalidad completa | No implementa página 404 |

**Puntos clave a evaluar:**
- ✅ Logo de TRAILERFLIX visible
- ✅ Mensaje "404 - Página no encontrada"
- ✅ Descripción amigable del error
- ✅ Botón "Volver al inicio" con `useNavigate()`
- ✅ Estética consistente (fondo negro, colores corporativos)

---

### 9. Sistema de Autenticación (15 puntos)

| Criterio | Excelente (13-15) | Bueno (10-12) | Regular (6-9) | Insuficiente (0-5) |
|----------|------------------|---------------|---------------|-------------------|
| **Login funcional** | Sistema de login completo: formulario funcional, valida contra `usuarios.json`, muestra errores, actualiza UI mostrando nombre de usuario, botón de logout funciona, persistencia con localStorage implementada, no hay redirecciones innecesarias | Login funciona, validación correcta con errores menores en UI o persistencia | Login implementado pero con problemas de validación, UI o persistencia | Login no funciona o no implementado |

**Puntos clave a evaluar:**
- ✅ Formulario de login (usuario y contraseña)
- ✅ Validación contra `usuarios.json`
- ✅ Mensajes de error informativos
- ✅ UI actualizada al iniciar sesión (muestra nombre de usuario)
- ✅ Botón de "Cerrar sesión" funcional
- ✅ No redirige después de login (solo actualiza componente)
- ✅ Estado persistente durante navegación
- ✅ Persistencia con localStorage (usuario permanece logueado al recargar)

---

### 10. Modularidad y Organización del Código (5 puntos)

| Criterio | Excelente (5) | Bueno (4) | Regular (2-3) | Insuficiente (0-1) |
|----------|--------------|-----------|---------------|-------------------|
| **Código limpio y organizado** | Componentes bien separados, código reutilizable, nombres descriptivos, comentarios cuando necesario, sin código repetido | Código organizado con mejoras menores posibles | Código funcional pero desorganizado o repetitivo | Código desorganizado y difícil de mantener |

**Puntos clave a evaluar:**
- ✅ Componentes en archivos separados
- ✅ Nombres descriptivos de variables y funciones
- ✅ No hay código duplicado
- ✅ Imports organizados
- ✅ Código legible y mantenible

---

## Criterios de Desaprobación Automática

El proyecto será desaprobado automáticamente si:
- ❌ La aplicación no ejecuta o tiene errores críticos que impiden su funcionamiento

---

### 11. Sistema de Búsqueda (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|------------------|---------------|---------------|-------------------|
| **Búsqueda implementada** | Búsqueda en tiempo real funcional, busca correctamente en campo `busqueda`, case-insensitive, muestra resultados inmediatamente, sin errores | Búsqueda funcional con errores menores en la implementación o rendimiento | Búsqueda implementada pero con problemas significativos (no busca correctamente, errores de lógica) | Búsqueda no implementada o no funcional |

**Puntos clave a evaluar:**
- ✅ Campo de búsqueda visible y accesible
- ✅ Búsqueda en tiempo real (mientras el usuario escribe)
- ✅ Busca en el campo `busqueda` del JSON
- ✅ Búsqueda case-insensitive
- ✅ Muestra resultados correctamente
- ✅ Manejo de búsqueda vacía (muestra todas las películas)

---

### 12. Sistema de Filtros (10 puntos)

| Criterio | Excelente (9-10) | Bueno (7-8) | Regular (4-6) | Insuficiente (0-3) |
|----------|------------------|---------------|---------------|-------------------|
| **Filtros implementados** | Filtros por género y categoría funcionan perfectamente, pueden combinarse entre sí y con búsqueda, interfaz clara, sin errores | Filtros funcionan pero con errores menores en combinación o UI | Filtros implementados pero con problemas significativos (no se combinan correctamente, errores de lógica) | Filtros no implementados o no funcionales |

**Puntos clave a evaluar:**
- ✅ Filtro por género implementado con todas las opciones disponibles
- ✅ Filtro por categoría (Película/Serie) implementado
- ✅ Los filtros pueden seleccionarse múltiples opciones simultáneamente
- ✅ Los filtros se combinan correctamente entre sí (AND lógico)
- ✅ Los filtros se combinan correctamente con la búsqueda
- ✅ Interfaz clara para seleccionar/deseleccionar filtros
- ✅ Botón para limpiar filtros implementado

---

### 13. Feedback y UX de Búsqueda/Filtros (5 puntos)

| Criterio | Excelente (5) | Bueno (4) | Regular (2-3) | Insuficiente (0-1) |
|----------|--------------|-----------|---------------|-------------------|
| **Feedback al usuario** | Muestra contador de resultados, mensaje cuando no hay resultados, indicadores visuales de filtros activos, todo claro y bien diseñado | Feedback implementado con elementos menores faltantes | Feedback básico pero incompleto | No hay feedback al usuario |

**Puntos clave a evaluar:**
- ✅ Muestra número de resultados encontrados
- ✅ Mensaje claro cuando no hay resultados
- ✅ Indicadores visuales de filtros activos
- ✅ Diseño consistente y profesional

---

### 14. Persistencia de Sesión (5 puntos)

| Criterio | Excelente (5) | Bueno (4) | Regular (2-3) | Insuficiente (0-1) |
|----------|--------------|-----------|---------------|-------------------|
| **localStorage implementado** | Persistencia funciona perfectamente, usuario permanece logueado al recargar, manejo correcto de errores | Persistencia funciona con errores menores | Persistencia implementada pero con problemas (no funciona correctamente) | No implementa persistencia |

**Puntos clave a evaluar:**
- ✅ Usuario permanece logueado al recargar la página
- ✅ Uso correcto de localStorage
- ✅ Manejo de casos edge (datos corruptos, etc.)
- ✅ Limpieza correcta al cerrar sesión