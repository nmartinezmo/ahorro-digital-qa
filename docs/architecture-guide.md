# Ahorro Digital - Guía de Arquitectura y Preparación para Entrevista

---

# ÍNDICE

1. [Explicación de Archivos](#1-explicación-de-archivos)
2. [Principios SOLID Aplicados](#2-principios-solid-aplicados)
3. [Patrones de Diseño](#3-patrones-de-diseño)
4. [Enfoque BDD](#4-enfoque-bdd)
5. [Reportería Automática](#5-reportería-automática)
6. [Preguntas y Respuestas de Entrevista](#6-preguntas-y-respuestas)

---

# 1. EXPLICACIÓN DE ARCHIVOS

## BACKEND

### `backend/src/index.js`
**Qué hace:** Punto de entrada de la aplicación Express.
**Cómo:** Configura middleware (CORS, JSON parser), monta rutas y maneja errores.
**Por qué:** Centraliza la configuración del servidor en un solo lugar.

### `backend/src/middleware/auth.js`
**Qué hace:** Verifica tokens JWT en rutas protegidas.
**Cómo:** Extrae token del header Authorization, lo valida con jwt.verify().
**Por qué:** Seguridad - solo usuarios autenticados acceden a recursos protegidos.

### `backend/src/routes/auth.js`
**Qué hace:** Endpoints de registro y login.
**Cómo:** Valida datos, hashea contraseñas con bcrypt, genera JWT.
**Por qué:** Maneja todo el flujo de autenticación de usuarios.

### `backend/src/routes/products.js`
**Qué hace:** API de catálogo de productos de ahorro.
**Cómo:** Retorna lista de productos con tasas de interés.
**Por qué:** Proporciona datos para mostrar opciones de ahorro al usuario.

### `backend/src/routes/simulator.js`
**Qué hace:** Calcula proyecciones de ahorro.
**Cómo:** Recibe monto y plazo, aplica tasa de interés, retorna ganancia.
**Por qué:** Funcionalidad core del negocio.

### `backend/src/data/users.js` y `products.js`
**Qué hace:** Almacén de datos en memoria.
**Cómo:** Arrays de JavaScript que simulan base de datos.
**Por qué:** Patrón Repository - abstrae acceso a datos.

---

## FRONTEND

### `frontend/src/context/AuthContext.jsx`
**Qué hace:** Estado global de autenticación.
**Cómo:** React Context API con useState para user y token.
**Por qué:** Evita prop drilling, cualquier componente accede al estado auth.

### `frontend/src/services/api.js`
**Qué hace:** Capa de comunicación con el backend.
**Cómo:** Funciones fetch que incluyen headers y manejo de errores.
**Por qué:** Abstrae HTTP - componentes no conocen detalles de fetch.

### `frontend/src/App.jsx`
**Qué hace:** Componente raíz con routing.
**Cómo:** Define rutas públicas y privadas con React Router.
**Por qué:** Controla navegación y protege rutas que requieren auth.

### `frontend/src/pages/*.jsx`
**Qué hace:** Componentes de página (Login, Register, Simulator, Products).
**Cómo:** Formularios, validación, llamadas a API.
**Por qué:** Cada página maneja su propia lógica de UI.

---

## TESTS

### `tests/playwright.config.js`
**Qué hace:** Configura Playwright test runner.
**Cómo:** Define reporters, browsers, timeouts, webServers.
**Por qué:** Control centralizado de cómo se ejecutan los tests.

### `tests/e2e/*.spec.js`
**Qué hace:** Tests End-to-End de interfaz.
**Cómo:** Simula usuario real: navegar, llenar formularios, hacer clic.
**Por qué:** Valida flujos completos desde perspectiva del usuario.

### `tests/api/api.spec.js`
**Qué hace:** Tests de endpoints del backend.
**Cómo:** Requests HTTP directos, valida status codes y respuestas.
**Por qué:** Valida contrato de API sin UI.

---

# 2. PRINCIPIOS SOLID APLICADOS

## S - Single Responsibility (Responsabilidad Única)

Cada archivo tiene UNA sola razón para cambiar:

| Archivo | Responsabilidad Única |
|---------|----------------------|
| `auth.js` (routes) | Solo autenticación |
| `products.js` (routes) | Solo productos |
| `simulator.js` (routes) | Solo cálculos |
| `AuthContext.jsx` | Solo estado de auth |
| `api.js` | Solo comunicación HTTP |

**Ejemplo:**
```javascript
// BIEN: auth.js solo maneja autenticación
router.post('/login', ...);
router.post('/register', ...);
router.get('/me', ...);

// MAL: Un archivo gigante con todo
```

## O - Open/Closed (Abierto/Cerrado)

Abierto para extensión, cerrado para modificación.

```javascript
// Agregar nueva ruta NO modifica index.js existente
// Solo creo nuevo archivo y lo importo
app.use('/api/transfers', transferRoutes); // Nueva feature
```

## L - Liskov Substitution

Todos los route handlers siguen el mismo contrato:
```javascript
(req, res, next) => { ... }
```
Cualquier handler puede reemplazar a otro sin romper Express.

## I - Interface Segregation

```javascript
// api.js expone métodos específicos
export const api = {
  login,           // Solo auth
  register,
  getProducts,     // Solo products
  calculate        // Solo simulator
};

// Cada página importa solo lo que necesita
```

## D - Dependency Inversion

```javascript
// Rutas dependen de abstracciones (users array)
// No de implementaciones concretas (MySQL, MongoDB)
const users = require('./data/users');

// Puedo cambiar data source sin modificar rutas
```

---

# 3. PATRONES DE DISEÑO

## 3.1 Repository Pattern

```
backend/src/data/
├── users.js      → Repositorio de usuarios
└── products.js   → Repositorio de productos
```

**Beneficio:** Cambiar de memoria a MongoDB solo modifica estos archivos.

## 3.2 Middleware Pattern

```javascript
// Cadena de responsabilidad
app.use(cors());              // 1. CORS
app.use(express.json());      // 2. Parse body
app.use(authenticateToken);   // 3. Verificar JWT
// handler                    // 4. Lógica de negocio
```

## 3.3 Provider Pattern (React Context)

```javascript
<AuthProvider>           {/* Provee estado */}
  <App />                {/* Consume con useAuth() */}
</AuthProvider>
```

## 3.4 Service Layer Pattern

```javascript
// Componentes NO conocen fetch
const products = await api.getProducts();

// Solo llaman métodos del servicio
```

## 3.5 Page Object Model (Testing)

```javascript
// Selectores centralizados con data-testid
page.getByTestId('login-button')

// Si cambia el UI, solo actualizo el selector
```

---

# 4. ENFOQUE BDD

## ¿Qué es BDD?

**Behavior-Driven Development** describe comportamiento del sistema en lenguaje natural.

## Formato Given-When-Then

```javascript
test('TC-001: Login exitoso', async ({ page }) => {
  // GIVEN: Usuario está en página de login
  await page.goto('/login');
  
  // WHEN: Ingresa credenciales válidas y envía
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();
  
  // THEN: Es redirigido al simulador
  await expect(page).toHaveURL('/simulator');
});
```

## Organización con Describe

```javascript
test.describe('P0 - Módulo Onboarding', () => {
  test.describe('Registro', () => {
    test('TC-001: Registro exitoso', ...);
    test('TC-002: Campos faltantes', ...);
  });
  
  test.describe('Login', () => {
    test('TC-003: Login exitoso', ...);
    test('TC-004: Credenciales inválidas', ...);
  });
});
```

## BDD vs TDD

| TDD | BDD |
|-----|-----|
| Escribe test técnico primero | Describe comportamiento primero |
| Enfoque en implementación | Enfoque en usuario |
| Lenguaje técnico | Lenguaje natural |
| "El método retorna X" | "El usuario ve X" |

---

# 5. REPORTERÍA AUTOMÁTICA

## 5.1 Playwright HTML Reporter

```javascript
reporter: [
  ['html', { outputFolder: '../reports/html-report' }]
]
```

**Características:**
- Resultados interactivos en navegador
- Reproducción de videos de tests
- Screenshots de fallos
- Filtros por estado
- Timeline de ejecución

**Comando:**
```bash
npx playwright show-report
```

## 5.2 JUnit Reporter (CI/CD)

```javascript
reporter: [
  ['junit', { outputFile: '../reports/junit-report.xml' }]
]
```

**Uso:** Integración con Jenkins, GitHub Actions, Azure DevOps.

## 5.3 Captura de Evidencia

```javascript
use: {
  video: 'on',                    // Siempre graba video
  screenshot: 'only-on-failure',  // Screenshot en fallos
  trace: 'on-first-retry'         // Trace en reintentos
}
```

| Tipo | Cuándo | Para qué |
|------|--------|----------|
| Video | Siempre | Prueba visual de ejecución |
| Screenshot | En fallos | Identificar bug rápido |
| Trace | En retry | Debugging profundo (red, DOM, consola) |

---

# 6. PREGUNTAS Y RESPUESTAS DE ENTREVISTA

## SOLID y Patrones

### P: ¿Cómo aplicaste Single Responsibility?
**R:** Cada archivo tiene una única responsabilidad. `auth.js` solo maneja autenticación, `products.js` solo productos. Si necesito cambiar cómo funciona el login, solo modifico `auth.js`.

### P: ¿Por qué usaste el patrón Repository?
**R:** Para abstraer el acceso a datos. Actualmente uso arrays en memoria, pero podría cambiar a MongoDB sin modificar las rutas. Solo cambiaría los archivos en `/data`.

### P: ¿Cómo harías el proyecto más escalable?
**R:** 
1. TypeScript para type safety
2. Caching con Redis
3. Base de datos real (MongoDB/PostgreSQL)
4. Docker para containerización
5. CI/CD con GitHub Actions

### P: ¿Qué patrón usaste en el frontend para estado global?
**R:** Provider Pattern con React Context. AuthProvider envuelve la app y cualquier componente accede al estado con useAuth(). Evita pasar props manualmente a través de múltiples niveles.

---

## BDD

### P: ¿Qué es BDD y cómo lo aplicaste?
**R:** BDD describe comportamiento en lenguaje natural. Usé Given-When-Then:
- **Given**: Precondición (usuario en login)
- **When**: Acción (ingresa credenciales)
- **Then**: Resultado (redirige a simulator)

### P: ¿Por qué BDD y no solo tests técnicos?
**R:** BDD permite que product owners y QA lean los tests. Son documentación viva del comportamiento esperado. Facilita comunicación entre equipos.

### P: ¿Diferencia entre test E2E y test de API?
**R:** 
- **E2E**: Simula usuario real con navegador (lento, completo)
- **API**: Solo backend, sin UI (rápido, aislado)

Uso ambos: API para validar lógica, E2E para flujos críticos.

---

## Reportería

### P: ¿Qué herramientas de reportería usaste?
**R:** Playwright con tres reporters:
1. **HTML**: Reporte interactivo con videos
2. **JUnit**: XML para CI/CD
3. **List**: Output en consola

### P: ¿Cómo capturas evidencia de bugs?
**R:** Playwright graba video de cada test, captura screenshot en fallos, y genera trace completo en reintentos. Todo se guarda automáticamente en `/reports`.

### P: ¿Cómo integrarías en CI/CD?
**R:** 
```yaml
# GitHub Actions
- run: npx playwright test
- uses: actions/upload-artifact@v3
  with:
    name: test-report
    path: reports/
```

El JUnit XML se integra con dashboards de Jenkins o Azure DevOps.

---

## Preguntas Técnicas Generales

### P: ¿Por qué Playwright y no Selenium o Cypress?
**R:** 
- **Auto-wait**: No necesito waits explícitos
- **Multi-browser**: Chrome, Firefox, Safari con misma API
- **API testing**: Integrado, no necesito otra herramienta
- **Videos**: Captura automática sin configuración extra

### P: ¿Cómo manejas autenticación en tests?
**R:** 
- **E2E**: Login via UI en `beforeEach`
- **API**: Obtengo token en `beforeAll`, lo reutilizo en headers

### P: ¿Cómo priorizaste los tests?
**R:** Matriz de riesgos P0/P1/P2:
- **P0 (Crítico)**: Login/Registro - sin esto no hay app
- **P1 (Alto)**: Simulador - funcionalidad core
- **P2 (Medio)**: Productos - informativo

---

*Este documento es para preparación de entrevista - no incluir en repositorio*
