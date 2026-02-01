# 🧪 Sistema de Gestión de Laboratorio Clínico - Glorimar

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)
[![EJS](https://img.shields.io/badge/EJS-Templates-yellow.svg)](https://ejs.co/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

> Un sistema integral para la gestión de laboratorios clínicos, diseñado para administrar inventario de reactivos, órdenes de compra y gestión de usuarios. Desarrollado con Node.js y Express.

## 📋 Tabla de Contenidos

- [🧪 Sistema de Gestión de Laboratorio](#-sistema-de-gestión-de-laboratorio-clínico---glorimar)
  - [✨ Características](#-características)
  - [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
  - [🚀 Inicio Rápido](#-inicio-rápido)
  - [📖 Documentación](#-documentación)
  - [🎨 Vistas del Sistema](#-vistas-del-sistema)
  - [📄 Licencia](#-licencia)

## ✨ Características

### 🎯 Funcionalidad Principal
- **🧪 Gestión de Inventario (Reactivos)**: CRUD completo para administrar reactivos, precios y stock.
- **📋 Gestión de Órdenes (Pedidos)**: Creación y seguimiento de pedidos de insumos.
- **🔐 Gestión de Usuarios**: Sistema de autenticación y roles (Admin/User).
- **📅 Filtrado por Fechas**: Reportes de órdenes por rangos de fecha específicos.
- **⚡ In-Memory Data**: Versión académica optimizada para funcionar sin base de datos externa (persistencia en memoria).

### 🎨 Experiencia de Usuario
- **🌐 Interfaz Web Moderna**: Diseño limpio y responsivo utilizando EJS.
- **📱 Responsive Design**: Adaptable a dispositivos móviles y escritorio.
- **🔍 Búsqueda y Filtrado**: Herramientas integradas para localizar información rápidamente.

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, CSS3 (Custom Styling), HTML5
- **Datos**: Estructuras de datos en memoria (Simulación de DB para fines académicos)
- **Herramientas**: Git, VS Code

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js** 18 o superior
- **Git**

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/usuario/proyecto-laboratorio.git
   cd proyecto-laboratorio-glorimar
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar entorno**
   Crea un archivo `.env` basado en `.env.example` (opcional para esta versión en memoria).

4. **Iniciar la aplicación**
   ```bash
   npm start
   # O para desarrollo:
   npm run dev
   ```

5. **Acceder**
   - Web: http://localhost:8888
   - Usuario prueba: `admin` / `admin123`

## 📖 Documentación

La API cuenta con los siguientes endpoints principales:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/insumos` | Listar todos los reactivos |
| GET | `/api/ordenes` | Listar todas las órdenes |
| POST | `/api/ordenes` | Crear una nueva orden |
| GET | `/api/ordenes/rango-fechas` | Filtrar órdenes por fecha |

Para más detalles, consulta `docs/API_GUIDE.md`.

## 🎨 Vistas del Sistema

El sistema cuenta con más de 5 vistas dinámicas desarrolladas con EJS:
1. **Dashboard**: Resumen de actividad.
2. **Listado de Insumos**: Tabla con inventario actual.
3. **Detalle de Insumo**: Vista de edición y detalles.
4. **Listado de Órdenes**: Historial de pedidos.
5. **Crear Orden**: Formulario transaccional con validación.
6. **Login**: Acceso seguro al sistema.

## 📄 Licencia

Este proyecto es para fines académicos. Uso permitido bajo licencia MIT.

---
**Universidad Valle del Momboy** - Prof. Roberto DM - #tareaUVM