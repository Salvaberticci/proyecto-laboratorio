// routes/productos.js - Router que separa las rutas API y Vistas para Productos
// Aplica el principio de Separación de Intereses (SoC) manteniendo rutas organizadas

const express = require('express');
const router = express.Router();
const insumoController = require('../controllers/InsumoController');
const { authenticateToken, requireUserOrAdmin, requireAdmin, requireWebAuth, requireWebRole } = require('../middleware/auth');

// ========== RUTAS API (Retornan JSON) ==========
// Prefijo: /api/productos

// GET /api/productos - Lista todos los productos (público)
router.get('/api/insumos', insumoController.apiListar);

// GET /api/insumos/:id - Muestra el detalle de un reactivo por ID (público)
router.get('/api/insumos/:id', insumoController.apiObtener);

// POST /api/insumos - Crea un nuevo reactivo (requiere user o admin)
router.post('/api/insumos', authenticateToken, requireUserOrAdmin, insumoController.apiCrear);

// PUT /api/insumos/:id - Modifica todos los datos de un reactivo (requiere user o admin)
router.put('/api/insumos/:id', authenticateToken, requireUserOrAdmin, insumoController.apiActualizar);

// DELETE /api/insumos/:id - Elimina un reactivo por ID (solo admin)
router.delete('/api/insumos/:id', authenticateToken, requireAdmin, insumoController.apiEliminar);

// ========== RUTAS DE VISTAS (Retornan HTML con EJS) ==========
// Prefijo: /insumos

// GET /insumos - Lista de reactivos (público)
router.get('/insumos', insumoController.listar);

// GET /insumos/crear - Formulario de Creación de reactivo (requiere user o admin)
router.get('/insumos/crear', requireWebAuth, requireWebRole('user'), insumoController.crearForm);

// POST /insumos - Procesa creación de reactivo desde formulario (requiere user o admin)
router.post('/insumos', requireWebAuth, requireWebRole('user'), insumoController.crear);

// GET /insumos/:id/editar - Formulario de Edición de reactivo (requiere user o admin)
router.get('/insumos/:id/editar', requireWebAuth, requireWebRole('user'), insumoController.editarForm);

// POST /insumos/:id/editar - Procesa edición de reactivo desde formulario (requiere user o admin)
router.post('/insumos/:id/editar', requireWebAuth, requireWebRole('user'), insumoController.editar);

module.exports = router;