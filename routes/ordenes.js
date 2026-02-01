// routes/pedidos.js - Router que separa las rutas API y Vistas para Pedidos
// Aplica el principio de Separación de Intereses (SoC) manteniendo rutas organizadas

const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/OrdenController');
const { authenticateToken, requireUserOrAdmin, requireAdmin, requireWebAuth, requireWebRole } = require('../middleware/auth');

// ========== RUTAS API (Retornan JSON) ==========
// Prefijo: /api/ordenes

// GET /api/ordenes/ultimos - Muestra los últimos 5 pedidos ordenados por fecha (público)
router.get('/api/ordenes/ultimos', ordenController.apiUltimos);

// GET /api/ordenes/rango-fechas - Filtra pedidos por rango de fechas (requiere user o admin)
router.get('/api/ordenes/rango-fechas', authenticateToken, requireUserOrAdmin, ordenController.apiFiltrarPorFecha);

// GET /api/ordenes - Lista todos los pedidos (requiere user o admin)
router.get('/api/ordenes', authenticateToken, requireUserOrAdmin, ordenController.apiListar);

// GET /api/ordenes/:id - Muestra el detalle de un pedido por ID (requiere user o admin)
router.get('/api/ordenes/:id', authenticateToken, requireUserOrAdmin, ordenController.apiObtener);

// POST /api/ordenes - Crea un nuevo pedido (requiere user o admin)
router.post('/api/ordenes', authenticateToken, requireUserOrAdmin, ordenController.apiCrear);

// PUT /api/ordenes/:id - Actualiza un pedido (requiere user o admin)
router.put('/api/ordenes/:id', authenticateToken, requireUserOrAdmin, ordenController.apiActualizar);

// DELETE /api/ordenes/:pedidoId/producto/:productoId - Elimina la relación específica entre un pedido y un producto (solo admin)
router.delete('/api/ordenes/:pedidoId/producto/:productoId', authenticateToken, requireAdmin, ordenController.apiEliminarRelacion);

// ========== RUTAS DE VISTAS (Retornan HTML con EJS) ==========
// Prefijo: /ordenes

// GET /ordenes - Lista de pedidos (requiere user o admin)
router.get('/ordenes', requireWebAuth, requireWebRole('user'), ordenController.listar);

// GET /ordenes/crear - Formulario de Creación de pedido (requiere user o admin)
router.get('/ordenes/crear', requireWebAuth, requireWebRole('user'), ordenController.crearForm);

// POST /ordenes - Procesa creación de pedido desde formulario (requiere user o admin)
router.post('/ordenes', requireWebAuth, requireWebRole('user'), ordenController.crear);

module.exports = router;