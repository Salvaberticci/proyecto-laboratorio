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
- **🏢 Gestión de Áreas (Laboratorios)**: Administración de salas y capacidades físicas.
- **💳 Gestión de Pagos**: Configuración de métodos de pago aceptados.
- **🔐 Gestión de Usuarios**: Sistema de autenticación y roles (Admin/User).
- **📅 Gestión de Citas**: Programación de experimentos en laboratorios específicos.
- **📊 Reportes**: Filtrado de órdenes por rangos de fecha específicos.
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

## 📖 Documentación y Pruebas con Postman

### 1. Configuración Inicial

El servidor corre por defecto en el puerto **8888**.
**Base URL:** `http://localhost:8888`

### 2. Autenticación (Obtener Token)

La mayoría de los endpoints de la API están protegidos y requieren un token JWT.

#### Login (Obtener Token)
*   **Método:** `POST`
*   **URL:** `{{base_url}}/auth/login`
*   **Body (JSON):**
    ```json
    {
      "username": "admin",
      "password": "password123"
    }
    ```
    *(Nota: Usa las credenciales configuradas en tu `DBService.js`. Por defecto: `admin` / `12345`)*

**Respuesta Exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": { ... }
}
```

> **Importante:** Copia el valor del `token` de la respuesta. Lo necesitarás para las siguientes peticiones.

### 3. Configurar Autorización en Postman

Para las peticiones protegidas (rutas `/api/...`):
1.  Ve a la pestaña **Authorization**.
2.  Selecciona el tipo **Bearer Token**.
3.  Pega el token que obtuviste en el paso de Login.

### 4. Endpoints de Experimentos (Exámenes)

#### Listar Experimentos
*   **Método:** `GET`
*   **URL:** `{{base_url}}/api/examenes`
*   **Auth:** No requerida

#### Crear Experimento
*   **Método:** `POST`
*   **URL:** `{{base_url}}/api/examenes`
*   **Auth:** Bearer Token (Requerido)
*   **Body (JSON):**
    ```json
    {
      "nombre": "Análisis de Espectroscopía",
      "fecha_creacion": 2024,
      "duracion_estimada": 90
    }
    ```

### 5. Endpoints de Citas (Pruebas)

#### Crear Cita
*   **Método:** `POST`
*   **URL:** `{{base_url}}/api/citas`
*   **Auth:** Bearer Token (Requerido)
*   **Body (JSON):**
    ```json
    {
      "id_experimento": 1,
      "id_laboratorio": 2,
      "fecha_hora_inicio": "2024-12-01T10:00:00"
    }
    ```

### 6. Endpoints de Insumos (Reactivos)

#### Listar Insumos
*   **Método:** `GET`
*   **URL:** `{{base_url}}/api/insumos`
*   **Auth:** No requerida

#### Crear Insumo
*   **Método:** `POST`
*   **URL:** `{{base_url}}/api/insumos`
*   **Auth:** Bearer Token (Requerido)
*   **Body (JSON):**
    ```json
    {
      "nombre": "Ácido Sulfúrico",
      "descripcion": "Concentrado al 98%",
      "precio": 45.50,
      "stock": 20
    }
    ```

## 🎨 Vistas del Sistema

El sistema cuenta con más de 5 vistas dinámicas desarrolladas con EJS:
1. **Dashboard**: Resumen de actividad y navegación centralizada.
2. **Listado de Insumos**: Tabla con inventario actual de reactivos.
3. **Gestión de Experimentos**: Catálogo de pruebas de laboratorio.
4. **Programación de Citas**: Calendario de pruebas en salas.
5. **Gestión de Áreas**: Administración de laboratorios físicos.
6. **Métodos de Pago**: Configuración para facturación.
7. **Historial de Órdenes**: Seguimiento de pedidos de reactivos.
8. **Login**: Acceso seguro al sistema.

## 📄 Licencia

Este proyecto es para fines académicos. Uso permitido bajo licencia MIT.

---
**Universidad Valle del Momboy** - Prof. Roberto DM - #tareaUVM