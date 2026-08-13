# Sabor Salvadoreño

Sitio web para un restaurante ficticio de comida típica salvadoreña. Permite a los usuarios explorar el menú, ver promociones, conocer información del restaurante y contactar al equipo. Incluye un panel administrativo para empleados y gerentes.

## Demo

[Ver sitio en vivo](https://esmemejia29.github.io/ProyectoDeCatedra_DesarrolloWeb/)

## Funcionalidades

**Público general:**
- Página de inicio con carrusel de imágenes y platos populares
- Menú completo organizado por categorías (Pupusas, Platos Principales, Entradas, Postres, Bebidas)
- Sección de promociones y ofertas especiales
- Página "Sobre nosotros" con galería e información del equipo
- Formulario de contacto
- Diseño responsivo con menú hamburguesa para móviles

**Panel administrativo (requiere autenticación):**
- Login con roles (Gerente / Empleado)
- CRUD de platos del menú
- CRUD de promociones
- Gestión de empleados (solo Gerente)
- Dashboard con estadísticas y gráficos (solo Gerente)

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura |
| CSS3 | Estilos y diseño responsivo |
| JavaScript (ES Modules) | Lógica del cliente |
| Firebase Authentication | Login y control de acceso |
| Firebase Firestore | Base de datos (menú y promociones) |
| Font Awesome 6.5 | Iconografía |
| Bootstrap 5 | Panel administrativo |
| Chart.js | Gráficos del dashboard |
| GitHub Pages | Hosting |

## Estructura del proyecto

```
├── index.html              # Página principal
├── login.html              # Inicio de sesión
├── html/
│   ├── menu.html           # Menú del restaurante
│   ├── promocion.html      # Promociones
│   ├── aboutus.html        # Sobre nosotros
│   └── contacto.html       # Contacto
├── admin/
│   ├── empleado.html       # Panel de empleado
│   └── gerente.html        # Panel de gerente
├── css/
│   ├── header.css          # Header, footer y navbar
│   ├── inicioIndex.css     # Estilos del inicio
│   ├── menu.css            # Estilos del menú
│   ├── promocion.css       # Estilos de promociones
│   ├── aboutus.css         # Estilos de "Sobre nosotros"
│   ├── formulario.css      # Estilos del contacto
│   ├── login.css           # Estilos del login
│   ├── empleado.css        # Estilos panel empleado
│   └── gerente.css         # Estilos panel gerente
├── js/
│   ├── navbar/navbar.js    # Menú móvil dinámico
│   ├── login.js            # Lógica de autenticación
│   ├── logout.js           # Cierre de sesión
│   ├── cartas/             # Generación dinámica de tarjetas
│   ├── operaciones/        # CRUD y lógica administrativa
│   └── service/            # Configuración de Firebase y Firestore
└── img/                    # Imágenes del sitio
```

## Configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/EsmeMejia29/ProyectoDeCatedra_DesarrolloWeb.git
   ```

2. Crear un archivo `.env` en la raíz con las credenciales de Firebase:
   ```
   apiKey=tu_api_key
   authDomain=tu_proyecto.firebaseapp.com
   projectId=tu_proyecto
   storageBucket=tu_proyecto.appspot.com
   messagingSenderId=123456789
   appId=tu_app_id
   measurementId=G-XXXXXXX
   ```

3. Abrir `index.html` con un servidor local (Live Server, etc.)

## Equipo
Kathleen Argueta, Alejandro Duron, Esmeralda Mejia y Reina Sosa para el Proyecto de Cátedra de Desarrollo Web, Ciclo 3 2025, ESEN.
