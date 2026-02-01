const express = require('express');
const router = express.Router();
const citasController = require('../controllers/CitasController');
const { authenticateToken, requireUserOrAdmin, requireAdmin, requireWebAuth, requireWebRole } = require('../middleware/auth');

// ========== RUTAS API (Retornan JSON) ==========
// Prefijo: /api/citas

// GET /ap/citas - Lista todas las pruebas
router.get('/api/citas', citasController.apiListar);

// GET /api/citas/:id - Muestra detalle de una prueba por ID
router.get('/api/citas/:id', citasController.apiObtener);

// POST /api/citas - Crea una nueva prueba (requiere user o admin)
router.post('/api/citas', authenticateToken, requireUserOrAdmin, citasController.apiCrear);

// PUT /api/citas/:id - Modifica todos los datos de una prueba (requiere user o admin)
router.put('/api/citas/:id', authenticateToken, requireUserOrAdmin, citasController.apiActualizar);

// DELETE /api/citas/:id - Elimina una prueba por ID (solo admin)
router.delete('/api/citas/:id', authenticateToken, requireAdmin, citasController.apiEliminar);

// ========== RUTAS DE VISTAS (Retornan HTML con EJS) ==========
// Prefijo: /citas

// GET /citas - Lista de pruebas
router.get('/citas', citasController.listar);

// GET /citas/crear - Formulario de Creación de prueba (requiere user o admin)
router.get('/citas/crear', requireWebAuth, requireWebRole('user'), citasController.crearForm);

// POST /citas - Procesa creación de prueba desde formulario (requiere user o admin)
router.post('/citas', requireWebAuth, requireWebRole('user'), citasController.crear);

// GET /citas/:id/editar - Formulario de Edición de prueba (requiere user o admin)
router.get('/citas/:id/editar', requireWebAuth, requireWebRole('user'), citasController.editarForm);

// POST /citas/:id/editar - Procesa edición de prueba desde formulario (requiere user o admin)
router.post('/citas/:id/editar', requireWebAuth, requireWebRole('user'), citasController.editar);

module.exports = router;