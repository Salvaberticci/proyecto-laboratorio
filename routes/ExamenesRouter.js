const express = require('express');
const router = express.Router();
const examenesController = require('../controllers/ExamenesController');
const { authenticateToken, requireUserOrAdmin, requireAdmin, requireWebAuth, requireWebRole } = require('../middleware/auth');

// ========== RUTAS API (Retornan JSON) ==========
// Prefijo: /api/examenes

// GET /api/examenes - Lista todos los experimentos (público)
router.get('/api/examenes', examenesController.apiListar);

// GET /api/examenes/:id - Muestra detalle de un experimento por ID (público)
router.get('/api/examenes/:id', examenesController.apiObtener);

// POST /api/examenes - Crea un nuevo experimento (requiere user o admin)
router.post('/api/examenes', authenticateToken, requireUserOrAdmin, examenesController.apiCrear);

// PUT /api/examenes/:id - Modifica todos los datos de un experimento (requiere user o admin)
router.put('/api/examenes/:id', authenticateToken, requireUserOrAdmin, examenesController.apiActualizar);

// DELETE /api/examenes/:id - Elimina un experimento por ID (solo admin)
router.delete('/api/examenes/:id', authenticateToken, requireAdmin, examenesController.apiEliminar);

// ========== RUTAS DE VISTAS (Retornan HTML con EJS) ==========
// Prefijo: /examenes

// GET /examenes - Lista de experimentos (público)
router.get('/examenes', examenesController.listar);

// GET /examenes/crear - Formulario de Creación de experimento (requiere user o admin)
router.get('/examenes/crear', requireWebAuth, requireWebRole('user'), examenesController.crearForm);

// POST /examenes - Procesa creación de experimento desde formulario (requiere user o admin)
router.post('/examenes', requireWebAuth, requireWebRole('user'), examenesController.crear);

// GET /examenes/:id/editar - Formulario de Edición de experimento (requiere user o admin)
router.get('/examenes/:id/editar', requireWebAuth, requireWebRole('user'), examenesController.editarForm);

// POST /examenes/:id/editar - Procesa edición de experimento desde formulario (requiere user o admin)
router.post('/examenes/:id/editar', requireWebAuth, requireWebRole('user'), examenesController.editar);

// DELETE /examenes/:id - Elimina un experimento (requiere admin)
router.delete('/examenes/:id', requireWebAuth, requireWebRole('admin'), examenesController.eliminar);

module.exports = router;