const express = require('express');
const router = express.Router();
const metodosPagoController = require('../controllers/MetodosPagoController');
const { authenticateToken, requireUserOrAdmin, requireAdmin, requireWebAuth, requireWebRole } = require('../middleware/auth');

// ========== RUTAS API (Retornan JSON) ==========
// Prefijo: /api/metodospago

// GET /api/metodospago - Lista todos los métodos de pago
router.get('/api/metodospago', metodosPagoController.apiListar);

// GET /api/metodospago/:id - Muestra detalle de un método de pago por ID
router.get('/api/metodospago/:id', metodosPagoController.apiObtener);

// POST /api/metodospago - Crea un nuevo método de pago (requiere user o admin)
router.post('/api/metodospago', authenticateToken, requireUserOrAdmin, metodosPagoController.apiCrear);

// PUT /api/metodospago/:id - Modifica todos los datos de un método de pago (requiere user o admin)
router.put('/api/metodospago/:id', authenticateToken, requireUserOrAdmin, metodosPagoController.apiActualizar);

// DELETE /api/metodospago/:id - Elimina un método de pago por ID (solo admin)
router.delete('/api/metodospago/:id', authenticateToken, requireAdmin, metodosPagoController.apiEliminar);

// ========== RUTAS DE VISTAS (Retornan HTML con EJS) ==========
// Prefijo: /metodospago

// GET /metodospago - Lista de métodos de pago
router.get('/metodospago', metodosPagoController.listar);

// GET /metodospago/crear - Formulario de Creación de método de pago (requiere user o admin)
router.get('/metodospago/crear', requireWebAuth, requireWebRole('user'), metodosPagoController.crearForm);

// POST /metodospago - Procesa creación de método de pago desde formulario (requiere user o admin)
router.post('/metodospago', requireWebAuth, requireWebRole('user'), metodosPagoController.crear);

// GET /metodospago/:id/editar - Formulario de Edición de método de pago (requiere user o admin)
router.get('/metodospago/:id/editar', requireWebAuth, requireWebRole('user'), metodosPagoController.editarForm);

// POST /metodospago/:id/editar - Procesa edición de método de pago desde formulario (requiere user o admin)
router.post('/metodospago/:id/editar', requireWebAuth, requireWebRole('user'), metodosPagoController.editar);

// DELETE /metodospago/:id - Elimina un método de pago (requiere admin)
router.delete('/metodospago/:id', requireWebAuth, requireWebRole('admin'), metodosPagoController.eliminar);

module.exports = router;