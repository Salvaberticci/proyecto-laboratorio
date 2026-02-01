const express = require('express');
const router = express.Router();
const areasController = require('../controllers/AreasController');
const { authenticateToken, requireUserOrAdmin, requireAdmin, requireWebAuth, requireWebRole } = require('../middleware/auth');

// ========== RUTAS API (Retornan JSON) ==========
// Prefijo: /api/areas

// GET /api/areas - Lista todos los laboratorios
router.get('/api/areas', areasController.apiListar);

// GET /api/areas/:id - Muestra detalle de un laboratorioor ID
router.get('/api/areas/:id', areasController.apiObtener);

// POST /api/areas - Crea un nuevo laboratorio (requiere user o admin)
router.post('/api/areas', authenticateToken, requireUserOrAdmin, areasController.apiCrear);

// PUT /api/areas/:id - Modifica todos los datos de un laboratorio (requiere user o admin)
router.put('/api/areas/:id', authenticateToken, requireUserOrAdmin, areasController.apiActualizar);

// DELETE /api/areas/:id - Elimina un laboratorio por ID (solo admin)
router.delete('/api/areas/:id', authenticateToken, requireAdmin, areasController.apiEliminar);

// ========== RUTAS DE VISTAS (Retornan HTML con EJS) ==========
// Prefijo: /areas

// GET /areas - Lista de laboratorios
router.get('/areas', areasController.listar);

// GET /areas/crear - Formulario de Creación de laboratorio (requiere user o admin)
router.get('/areas/crear', requireWebAuth, requireWebRole('user'), areasController.crearForm);

// POST /areas - Procesa creación de laboratorio desde formulario (requiere user o admin)
router.post('/areas', requireWebAuth, requireWebRole('user'), areasController.crear);

// GET /areas/:id/editar - Formulario de Edición de laboratorio (requiere user o admin)
router.get('/areas/:id/editar', requireWebAuth, requireWebRole('user'), areasController.editarForm);

// POST /areas/:id/editar - Procesa edición de laboratorio desde formulario (requiere user o admin)
router.post('/areas/:id/editar', requireWebAuth, requireWebRole('user'), areasController.editar);

module.exports = router;