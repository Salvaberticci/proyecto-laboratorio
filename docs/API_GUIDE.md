# Guía de API - Sistema de Laboratorio Clínico

## URL Base
```
http://localhost:8888
```

---

## 🧪 **REACTIVOS (INSUMOS)**

### **GET /api/insumos**
Obtiene todos los reactivos disponibles en inventario.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Ácido Clorhídrico",
      "stock": 100,
      "precio": 15.50
    }
  ]
}
```

### **GET /api/insumos/:id**
Obtiene detalle de un reactivo.

### **POST /api/insumos**
Crea un nuevo reactivo.
**Body:** `{ "nombre": "Alcohol", "descripcion": "96%", "precio": 10, "stock": 50 }`

---

## 📋 **ÓRDENES (PEDIDOS)**

### **GET /api/ordenes**
Lista todas las órdenes generadas.

### **GET /api/ordenes/ultimos**
Obtiene las últimas 5 órdenes.

### **GET /api/ordenes/rango-fechas**
Filtra órdenes por rango de fechas.
**Params:** `?inicio=2025-01-01&fin=2025-12-31`

### **POST /api/ordenes**
Genera una nueva orden de compra.
**Body:** `{ "producto_id": 1, "cantidad": 5 }`

---

## 🔐 **AUTENTICACIÓN**

El sistema utiliza JWT para la seguridad de los endpoints protegidos.

### **POST /auth/login**
Inicia sesión y devuelve un token.
**Body:** `{ "username": "admin", "password": "..." }`