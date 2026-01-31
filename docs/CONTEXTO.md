# Construyamos Juntos - Red de Amigos

## Documentación Técnica Completa

**Última actualización:** Enero 2026
**Versión:** 1.0.0
**Proyecto:** Plataforma de gestión de referidos políticos
**Campaña:** Gustavo García Figueroa - Senado #1 - Frente Amplio Unitario

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Modelo de Datos](#modelo-de-datos)
5. [Sistema de Autenticación](#sistema-de-autenticación)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Sistema de Rutas](#sistema-de-rutas)
8. [Componentes Principales](#componentes-principales)
9. [Flujos de Datos en Tiempo Real](#flujos-de-datos-en-tiempo-real)
10. [Estructura del Proyecto](#estructura-del-proyecto)
11. [Variables de Entorno](#variables-de-entorno)
12. [Comandos de Desarrollo](#comandos-de-desarrollo)
13. [Funcionalidades Implementadas](#funcionalidades-implementadas)
14. [Pendientes y Mejoras](#pendientes-y-mejoras)

---

## Resumen Ejecutivo

**Construyamos Juntos - Red de Amigos** es una plataforma web full-stack para la gestión de redes de referidos de campaña política. Permite a coordinadores y voluntarios:

- Registrar nuevos amigos/referidos
- Visualizar estadísticas de crecimiento de red
- Ver reportes con diferentes visualizaciones (tablas, grafos, rankings)
- Gestionar su perfil y compartir código de referido via QR

La aplicación ha evolucionado de un frontend estático a una plataforma completa con:
- Backend en **Supabase** (PostgreSQL + Auth + Realtime)
- State management con **Zustand**
- Sistema de referidos **multinivel**
- Autenticación real con **persistencia de sesión**
- Actualizaciones en **tiempo real**

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React 19)                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   Login     │  │  Dashboard  │  │   Reports   │  │  Profile   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬──────┘ │
│         │                │                │               │         │
│  ┌──────┴────────────────┴────────────────┴───────────────┴──────┐ │
│  │                    CUSTOM HOOKS (Zustand)                      │ │
│  │  useAuth │ useReferrals │ useReports │ useProfile             │ │
│  └────────────────────────────┬──────────────────────────────────┘ │
├───────────────────────────────┼─────────────────────────────────────┤
│                               ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Supabase Client (lib/supabase.ts)         │   │
│  └─────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SUPABASE BACKEND                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │
│  │  Auth Service │  │   Database    │  │   Realtime    │           │
│  │  (JWT/Email)  │  │  (PostgreSQL) │  │  (WebSocket)  │           │
│  └───────────────┘  └───────────────┘  └───────────────┘           │
│                              │                                      │
│  ┌───────────────────────────┼───────────────────────────────────┐ │
│  │                      TABLAS                                    │ │
│  │  users │ referrals │ activity_log │ municipalities            │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                              │                                      │
│  ┌───────────────────────────┼───────────────────────────────────┐ │
│  │                   FUNCIONES RPC                                │ │
│  │  generate_referral_code │ get_user_network │ get_user_ranking │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2.4 | Framework UI |
| TypeScript | 5.8.2 | Tipado estático |
| Vite | 6.2.0 | Build tool |
| Zustand | 5.0.10 | State management global |
| React Router DOM | 7.13.0 | Navegación SPA |
| D3.js | 7.9.0 | Visualizaciones/grafos |
| Lucide React | 0.563.0 | Iconos |
| QRCode.react | 4.2.0 | Generación de QR |
| react-hot-toast | 2.6.0 | Notificaciones |
| Tailwind CSS | CDN | Estilos utility-first |

### Backend (Supabase)

| Servicio | Función |
|----------|---------|
| **Auth** | Autenticación con email sintético |
| **Database** | PostgreSQL con 4 tablas |
| **Realtime** | Suscripciones WebSocket |
| **RPC** | Funciones serverless (ranking, network) |
| **Storage** | Almacenamiento de avatares |

### Dependencias Completas (package.json)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.93.3",
    "d3": "^7.9.0",
    "lucide-react": "^0.563.0",
    "qrcode.react": "^4.2.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.13.0",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.2.10",
    "@types/react-dom": "^19.2.3",
    "@types/react-router-dom": "^5.3.3",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

---

## Modelo de Datos

### Tabla: `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `auth_id` | UUID (FK→auth.users) | Enlace a Supabase Auth |
| `identification` | VARCHAR (UNIQUE) | Cédula del usuario |
| `email` | VARCHAR | Email sintético |
| `phone` | VARCHAR | Teléfono de contacto |
| `first_name` | VARCHAR | Nombres |
| `last_name` | VARCHAR | Apellidos |
| `role` | ENUM | admin/coordinator/volunteer |
| `referral_code` | VARCHAR (UNIQUE) | Código único de referido |
| `parent_user_id` | UUID (FK→users) | Referidor (red multinivel) |
| `department` | VARCHAR | Departamento |
| `municipality` | VARCHAR | Municipio |
| `zone` | VARCHAR | Urbana/Rural |
| `neighborhood` | VARCHAR | Barrio/Corregimiento |
| `birth_date` | DATE | Fecha de nacimiento |
| `occupation` | VARCHAR | Ocupación |
| `avatar_url` | VARCHAR | URL de foto de perfil |
| `created_at` | TIMESTAMP | Fecha de registro |
| `updated_at` | TIMESTAMP | Última actualización |

### Tabla: `referrals`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `identification` | VARCHAR (UNIQUE) | Cédula del referido |
| `first_name` | VARCHAR | Nombres |
| `last_name` | VARCHAR | Apellidos |
| `gender` | ENUM | M/F/O |
| `birth_date` | DATE | Fecha de nacimiento |
| `phone` | VARCHAR | Teléfono |
| `email` | VARCHAR | Email |
| `municipality` | VARCHAR (REQ) | Municipio |
| `zone` | ENUM | Urbana/Rural |
| `neighborhood` | VARCHAR | Barrio |
| `occupation` | VARCHAR | Ocupación |
| `status` | ENUM | active/pending/inactive |
| `referred_by` | UUID (FK→users) | Usuario que lo registró |
| `user_id` | UUID | Si se convirtió en usuario |
| `terms_accepted` | BOOLEAN | Aceptó términos |
| `privacy_accepted` | BOOLEAN | Aceptó política de datos |
| `created_at` | TIMESTAMP | Fecha de registro |

### Tabla: `activity_log`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `user_id` | UUID (FK→users) | Usuario que realizó acción |
| `action` | VARCHAR | Tipo de acción |
| `entity_type` | VARCHAR | Entidad afectada |
| `entity_id` | UUID | ID de la entidad |
| `description` | TEXT | Descripción legible |
| `metadata` | JSONB | Datos adicionales |
| `created_at` | TIMESTAMP | Timestamp |

### Tabla: `municipalities`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT (PK) | Identificador |
| `department` | VARCHAR | Departamento |
| `name` | VARCHAR | Nombre del municipio |

### Funciones RPC

```sql
-- Genera código único tipo "GGF-ABC123"
generate_referral_code() → VARCHAR

-- Obtiene red jerárquica del usuario
get_user_network(user_uuid) → TABLE(id, name, level, parent_id, referral_count)

-- Ranking de usuarios por referidos
get_user_ranking(limit_count) → TABLE(user_id, name, direct_count, rank)
```

---

## Sistema de Autenticación

### Estrategia de Email Sintético

La aplicación usa **emails sintéticos** generados a partir de la identificación del usuario:

```typescript
// lib/supabase.ts
export const generateSyntheticEmail = (identification: string): string => {
  return `${identification}@gustavogarcia.co`;
};

// Ejemplo: "123456789" → "123456789@gustavogarcia.co"
```

**Ventajas:**
- No requiere email real del usuario
- La identificación es única por persona
- Simplifica el flujo de registro

### Flujo de Login

```
Usuario ingresa: Identificación + Contraseña
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  generateSyntheticEmail("123456789")                │
│  → "123456789@gustavogarcia.co"                     │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  supabase.auth.signInWithPassword({                 │
│    email: "123456789@gustavogarcia.co",             │
│    password: "123456789"                            │
│  })                                                 │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Cargar perfil desde tabla `users`                  │
│  WHERE auth_id = session.user.id                    │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Zustand: Persistir en localStorage                 │
│  { isAuthenticated: true, user: {...} }             │
└─────────────────────────────────────────────────────┘
```

### Flujo de Registro (con código de referido)

```
Usuario accede a: /ref/GGF-ABC123
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Validar código de referido                         │
│  SELECT * FROM users WHERE referral_code = ?        │
└─────────────────────────────────────────────────────┘
                      │
                      ▼ (válido)
┌─────────────────────────────────────────────────────┐
│  Usuario completa formulario de registro            │
│  Identificación = Contraseña (automático)           │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  1. supabase.auth.signUp()                          │
│  2. generate_referral_code() → nuevo código único   │
│  3. INSERT INTO users (parent_user_id = referidor)  │
│  4. INSERT INTO activity_log (new_referral)         │
│  5. Auto-login                                      │
└─────────────────────────────────────────────────────┘
```

---

## Hooks Personalizados

### `useAuth` (hooks/useAuth.ts)

**Propósito:** Manejo global de autenticación con Zustand.

```typescript
interface AuthState {
  user: UserWithStats | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  login(identification, password): Promise<boolean>;
  logout(): Promise<void>;
  register(userData): Promise<{success, error?}>;
  fetchUser(): Promise<void>;
  clearError(): void;
}
```

**Características:**
- Persistencia con `zustand/middleware/persist`
- Listener de cambios de sesión en tiempo real
- Generación de email sintético
- Auto-login después de registro
- Conteo de referidos al cargar perfil

### `useReferrals` (hooks/useReferrals.ts)

**Propósito:** CRUD completo de referidos con actualizaciones en tiempo real.

```typescript
interface UseReferralsReturn {
  referrals: Referral[];
  isLoading: boolean;
  totalCount: number;
  error: string | null;

  addReferral(data): Promise<{success, error?}>;
  updateReferral(id, data): Promise<boolean>;
  deleteReferral(id): Promise<boolean>;
  refetch(): Promise<void>;
}
```

**Características:**
- Suscripción Realtime a cambios (INSERT/UPDATE/DELETE)
- Validación de duplicados por identificación
- Registro automático de actividad
- Ordenamiento por fecha de creación

### `useReports` (hooks/useReports.ts)

**Propósito:** Datos para reportes y visualizaciones.

```typescript
interface UseReportsReturn {
  network: NetworkNode[];      // Árbol de red
  ranking: UserRanking[];      // Top usuarios
  stats: UserStats | null;     // Estadísticas
  activity: ActivityItem[];    // Log de actividades
  isLoading: boolean;
  error: string | null;

  fetchNetwork(): Promise<void>;
  fetchRanking(): Promise<void>;
  fetchStats(): Promise<void>;
  fetchActivity(limit?): Promise<void>;
}
```

**Características:**
- Llamadas a funciones RPC con fallbacks
- Cálculo de estadísticas del mes actual
- Mapeo de datos para D3.js
- Ranking del usuario actual

### `useProfile` (hooks/useProfile.ts)

**Propósito:** Gestión del perfil de usuario.

```typescript
interface UseProfileReturn {
  isUpdating: boolean;
  updateProfile(data): Promise<{success, error?}>;
  uploadAvatar(file): Promise<{success, url?, error?}>;
}
```

**Características:**
- Upload de avatares a Supabase Storage
- Actualización parcial de perfil

---

## Sistema de Rutas

### Configuración (App.tsx)

```typescript
<BrowserRouter>
  <Routes>
    {/* Rutas públicas */}
    <Route path="/login" element={<LoginWrapper />} />
    <Route path="/ref/:referralCode" element={<PublicRegisterWrapper />} />
    <Route path="/register/:referralCode" element={<PublicRegisterWrapper />} />

    {/* Rutas protegidas */}
    <Route path="/*" element={
      <ProtectedRoute>
        <AuthenticatedApp />
      </ProtectedRoute>
    } />
  </Routes>
</BrowserRouter>
```

### Tabla de Rutas

| Ruta | Componente | Acceso | Descripción |
|------|------------|--------|-------------|
| `/login` | LoginWrapper | Público | Inicio de sesión |
| `/ref/:code` | PublicRegisterWrapper | Público | Registro por referido |
| `/register/:code` | PublicRegisterWrapper | Público | Alias de registro |
| `/` | AuthenticatedApp | Protegido | Dashboard principal |
| `/` → register | RegisterReferral | Protegido | Registrar amigo |
| `/` → reports | Reports | Protegido | Reportes |
| `/` → profile | Profile | Protegido | Mi perfil |

### Componente ProtectedRoute

```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

---

## Componentes Principales

### 1. Login.tsx (203 líneas)

**Propósito:** Pantalla de inicio de sesión.

**Características:**
- Layout 2 columnas (35% formulario / 65% imagen)
- Imagen de campaña a pantalla completa
- Formulario controlado con validación
- Integración con `useAuth.login()`
- Manejo de errores con toast
- Responsive (imagen arriba en mobile)

**Elementos visuales:**
- Badge con rayo amarillo (#1)
- Título "CONSTRUYAMOS JUNTOS" en naranja
- Icono de usuario y candado en inputs

### 2. Dashboard.tsx (254 líneas)

**Propósito:** Panel principal con estadísticas.

**Características:**
- Imagen de fondo del candidato (50% opacidad)
- 4 tarjetas de estadísticas:
  - Referidos directos
  - Total en red
  - Ranking
  - Meta del mes (progreso %)
- Actividad reciente desde `activity_log`
- Acciones rápidas (navegación)
- Saludo personalizado con nombre del usuario

### 3. Reports.tsx (481 líneas)

**Propósito:** Reportes y visualizaciones.

**4 vistas disponibles:**

1. **Árbol Jerárquico**
   - Red visual con niveles
   - Avatar del usuario como raíz
   - Tarjetas de referidos directos

2. **Vista de Nodos (Grafo D3.js)**
   - Force simulation interactiva
   - Nodos arrastrables
   - Colores por nivel jerárquico
   - Labels con nombres

3. **Tabla de Referidos**
   - Búsqueda por nombre/cédula
   - Filtros
   - Columnas: ID, Nombre, Nacimiento, Municipio, Teléfono, Estado

4. **Ranking**
   - Top usuarios con medallas (oro, plata, bronce)
   - Estadísticas globales
   - Referidos directos y red total

### 4. Profile.tsx (247 líneas)

**Propósito:** Gestión del perfil de usuario.

**Características:**
- Avatar con opción de carga (hover para cambiar)
- Información personal:
  - Identificación
  - Teléfono
  - Email
  - Municipio
  - Fecha de registro
- Sección de código QR:
  - Código único mostrado
  - QR funcional generado con `qrcode.react`
  - Link compartible
  - Botón copiar con feedback
- Estadísticas: Referidos directos y red total
- Instrucciones de cómo funciona el sistema

### 5. RegisterReferral.tsx (262 líneas)

**Propósito:** Formulario para registrar nuevos referidos.

**Campos del formulario:**

**Información Personal:**
- Identificación (obligatorio)
- Nombres (obligatorio)
- Apellidos (obligatorio)
- Sexo
- Fecha de nacimiento

**Ubicación y Contacto:**
- Departamento (Caquetá)
- Municipio (obligatorio) - 16 municipios de Caquetá
- Zona (Urbana/Rural)
- Barrio/Corregimiento
- Teléfono
- Email
- Ocupación

**Legal:**
- Términos y condiciones (obligatorio)
- Política de tratamiento de datos - Ley 1581/2012 (obligatorio)

**Características:**
- Validación de campos obligatorios
- Notificación de éxito animada
- Limpieza de formulario después de registro
- Integración con `useReferrals.addReferral()`

### 6. PublicRegister.tsx (425 líneas)

**Propósito:** Página pública de registro sin autenticación.

**Características:**
- Accesible via `/ref/:referralCode`
- Valida código de referido al cargar
- Muestra nombre del referidor
- Estados:
  - Loading: Spinner mientras valida código
  - Error: Mensaje si código inválido
  - Éxito: Formulario de registro
- Auto-login al completar registro
- Formulario idéntico a RegisterReferral

### 7. Layout.tsx (137 líneas)

**Propósito:** Estructura principal de la app autenticada.

**Elementos:**
- Header sticky naranja con:
  - Botón hamburguesa
  - Logo "GUSTAVO GARCÍA #1 SENADO"
  - Avatar del usuario
- Sidebar deslizante con:
  - Avatar grande del usuario
  - Navegación: Inicio, Registro, Reportes, Mi Perfil
  - Botón cerrar sesión
  - Créditos "Desarrollado por Amazonico.dev"

### 8. QRCode.tsx (37 líneas)

**Propósito:** Componente wrapper para generación de QR.

```typescript
interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}
```

---

## Flujos de Datos en Tiempo Real

### Suscripción Realtime (useReferrals)

```typescript
useEffect(() => {
  if (!user?.id) return;

  const channel = supabase
    .channel('referrals-changes')
    .on(
      'postgres_changes',
      {
        event: '*',           // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'referrals',
        filter: `referred_by=eq.${user.id}`
      },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setReferrals(prev => [payload.new as Referral, ...prev]);
          setTotalCount(prev => prev + 1);
        } else if (payload.eventType === 'UPDATE') {
          setReferrals(prev =>
            prev.map(r => r.id === payload.new.id ? payload.new as Referral : r)
          );
        } else if (payload.eventType === 'DELETE') {
          setReferrals(prev => prev.filter(r => r.id !== payload.old.id));
          setTotalCount(prev => prev - 1);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user?.id]);
```

### Listener de Sesión (useAuth)

```typescript
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuth.setState({
      user: null,
      session: null,
      isAuthenticated: false
    });
  } else if (event === 'SIGNED_IN' && session) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();

    if (profile) {
      useAuth.setState({
        user: profile,
        session,
        isAuthenticated: true
      });
    }
  }
});
```

---

## Estructura del Proyecto

```
construyamos-juntos/
├── .claude/                          # Configuración de Claude
│   └── settings.local.json
├── .env.local                        # Variables de entorno
├── .gitignore                        # Git ignore
│
├── docs/                             # Documentación
│   └── CONTEXTO.md                   # Este archivo
│
├── public/                           # Archivos estáticos
│   ├── gustavo-dashboard.jpg         # Imagen Dashboard (663 KB)
│   └── gustavo-login.jpg             # Imagen Login (763 KB)
│
├── components/                       # Componentes React
│   ├── Dashboard.tsx                 # Panel principal (254 líneas)
│   ├── Layout.tsx                    # Layout con sidebar (137 líneas)
│   ├── Login.tsx                     # Pantalla login (203 líneas)
│   ├── Profile.tsx                   # Perfil usuario (247 líneas)
│   ├── QRCode.tsx                    # Generador QR (37 líneas)
│   ├── RegisterReferral.tsx          # Formulario registro (262 líneas)
│   └── Reports.tsx                   # Reportes/visualizaciones (481 líneas)
│
├── hooks/                            # Custom hooks
│   ├── useAuth.ts                    # Autenticación Zustand (299 líneas)
│   ├── useProfile.ts                 # Gestión perfil (102 líneas)
│   ├── useReferrals.ts               # CRUD referidos (186 líneas)
│   └── useReports.ts                 # Datos reportes (210 líneas)
│
├── lib/                              # Servicios/utilidades
│   └── supabase.ts                   # Cliente Supabase (29 líneas)
│
├── pages/                            # Páginas públicas
│   └── PublicRegister.tsx            # Registro público (425 líneas)
│
├── types/                            # Tipos TypeScript
│   └── database.types.ts             # Tipos de BD (291 líneas)
│
├── App.tsx                           # Componente principal (131 líneas)
├── index.html                        # HTML base
├── index.tsx                         # Entry point React
├── metadata.json                     # Metadata del proyecto
├── package.json                      # Dependencias
├── package-lock.json                 # Lock de versiones
├── README.md                         # Documentación básica
├── tsconfig.json                     # Config TypeScript
├── types.ts                          # Tipos globales (35 líneas)
├── vite.config.ts                    # Config Vite
└── vite-env.d.ts                     # Tipos Vite
```

### Estadísticas del Código

| Categoría | Archivos | Líneas |
|-----------|----------|--------|
| Componentes | 7 | ~1,621 |
| Hooks | 4 | ~797 |
| Páginas | 1 | 425 |
| Tipos | 2 | ~326 |
| Servicios | 1 | 29 |
| Config/otros | 8 | ~300 |
| **TOTAL** | **23** | **~3,500** |

---

## Variables de Entorno

### Archivo: `.env.local`

```bash
# Supabase
VITE_SUPABASE_URL=https://hguxjqpfvuevvwfkhhta.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
VITE_APP_URL=https://gustavogarcia.vercel.app

# API (opcional)
GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

### Acceso en el código

```typescript
// Vite expone variables con prefijo VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const appUrl = import.meta.env.VITE_APP_URL;
```

---

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (puerto 3000)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Configuración de Vite (vite.config.ts)

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',  // Accesible desde red local
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
```

---

## Funcionalidades Implementadas

### Autenticación
- [x] Login con identificación/contraseña
- [x] Registro con código de referido
- [x] Logout
- [x] Persistencia de sesión (localStorage)
- [x] Auto-refresh de tokens
- [x] Protección de rutas
- [x] Listener de cambios de sesión

### Gestión de Usuarios
- [x] Perfil editable
- [x] Upload de avatar a Supabase Storage
- [x] Código QR personal funcional
- [x] Link de referido compartible
- [x] Botón copiar con feedback visual
- [x] Roles (admin/coordinator/volunteer)

### Sistema de Referidos
- [x] Registro de nuevos referidos
- [x] Validación de duplicados por identificación
- [x] Red multinivel (parent_user_id)
- [x] Actualización en tiempo real (Realtime)
- [x] Historial de actividad (activity_log)
- [x] Generación automática de código único

### Reportes y Análisis
- [x] Dashboard con estadísticas dinámicas
- [x] Tabla de referidos con búsqueda
- [x] Ranking de usuarios con medallas
- [x] Grafo interactivo D3.js
- [x] Vista jerárquica de red
- [x] Estadísticas del mes actual

### UX/UI
- [x] Diseño responsive (mobile-first)
- [x] Notificaciones toast
- [x] Estados de carga (spinners)
- [x] Mensajes de error amigables
- [x] Animaciones suaves
- [x] Identidad visual de campaña (naranja #FF6600)

---

## Pendientes y Mejoras

### Funcionalidad
- [ ] Recuperación de contraseña
- [ ] Edición de referidos existentes
- [ ] Eliminar referidos
- [ ] Exportación a Excel/PDF
- [ ] Filtros avanzados en reportes
- [ ] Notificaciones push
- [ ] Modo offline (PWA)

### Seguridad
- [ ] Row Level Security (RLS) en Supabase
- [ ] Validación de roles en backend
- [ ] Rate limiting
- [ ] Sanitización de inputs
- [ ] HTTPS obligatorio
- [ ] Auditoría de acciones

### Performance
- [ ] Paginación en tablas grandes
- [ ] Caché de consultas (React Query/SWR)
- [ ] Lazy loading de componentes
- [ ] Optimización de imágenes (WebP)
- [ ] Code splitting

### Infraestructura
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Tests automatizados (Vitest/Jest)
- [ ] Monitoreo de errores (Sentry)
- [ ] Analytics (GA4/Plausible)
- [ ] Backups automáticos de BD

### Nuevas Features
- [ ] Chat interno entre coordinadores
- [ ] Mapas de calor por municipio
- [ ] Objetivos/metas personalizables
- [ ] Gamificación (badges, niveles)
- [ ] Importación masiva de referidos (CSV)

---

## Identidad Visual

### Paleta de Colores

```css
campaign-orange: #FF6600   /* Color principal */
campaign-dark:   #E55A00   /* Variante oscura */
campaign-light:  #F77E16   /* Variante clara */
```

### Tipografía

- **Montserrat** (400, 600, 700, 900) → Títulos y display
- **DM Sans** (400, 500, 700) → Texto general

### Elementos de UI

- Bordes redondeados: `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- Sombras suaves: `shadow-sm`, `shadow-lg`, `shadow-2xl`
- Gradientes: `from-campaign-orange to-campaign-dark`
- Transiciones: `transition-all`, `hover:-translate-y-1`

---

## Contacto

**Campaña:** Gustavo García Figueroa
**Cargo:** Senado de la República #1
**Partido:** Frente Amplio Unitario
**Website:** gustavogarcia.co
**Desarrollador:** Amazonico.dev

---

*Documentación generada el 30 de enero de 2026*
