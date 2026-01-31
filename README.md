# 🧡 Construyamos Juntos - Red de Amigos

**Plataforma de gestión de referidos políticos para la campaña de Gustavo García Figueroa**  
🏛️ Candidato al Senado #1 - Frente Amplio Unitario

---

## 📋 Descripción

Aplicación web para la gestión de redes de referidos de campaña política. Permite a coordinadores y voluntarios registrar amigos, visualizar su red de contactos y hacer seguimiento del crecimiento de la campaña.

### ✨ Características

- 🔐 Sistema de autenticación
- 📊 Dashboard con estadísticas de la red
- 👥 Registro de amigos/referidos
- 🌳 Visualización de árbol jerárquico
- 📈 Grafo interactivo de la red (D3.js)
- 📋 Tabla de referidos con filtros
- 🏆 Ranking de coordinadores
- 👤 Perfil con código QR de referido

---

## 🚀 Instalación

**Requisitos previos:** Node.js 18+

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## 🎨 Identidad Visual

| Elemento | Valor |
|----------|-------|
| Color Primario | `#FF6600` (Naranja Campaña) |
| Color Secundario | `#F77E16` |
| Color Oscuro | `#E55A00` |
| Fuente Display | Montserrat Bold/Black |
| Fuente Body | DM Sans |

---

## 🛠️ Stack Tecnológico

- **React 19** + TypeScript
- **Vite 6** (Build tool)
- **Tailwind CSS** (Estilos)
- **D3.js** (Visualizaciones)
- **Lucide React** (Iconos)

---

## 📁 Estructura

```
├── App.tsx              # Componente principal
├── components/
│   ├── Login.tsx        # Pantalla de login
│   ├── Layout.tsx       # Sidebar + Header
│   ├── Dashboard.tsx    # Panel principal
│   ├── RegisterReferral.tsx  # Formulario registro
│   ├── Reports.tsx      # Reportes y visualizaciones
│   └── Profile.tsx      # Perfil del usuario
├── public/
│   ├── gustavo-login.jpg
│   └── gustavo-dashboard.jpg
└── types.ts             # Interfaces TypeScript
```

---

## 📞 Contacto

**Campaña Gustavo García Figueroa**  
Senado #1 - Frente Amplio Unitario  
🌐 gustavogarcia.co

---

*Desarrollado con 🧡 para la campaña #ConstruyamosJuntos*
