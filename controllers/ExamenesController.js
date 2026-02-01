const dbService = require('../database/DBService');

class ExamenesController {
  // ========== MÉTODOS PARA RUTAS API (Retornan JSON) ==========

  // GET /api/examenes - Lista todos los exámenes
  async apiListar(req, res) {
    try {
      const experimentos = await dbService.getAllExperimentos();
      res.json({
        success: true,
        data: experimentos,
        count: experimentos.length
      });
    } catch (error) {
      console.error('Error en apiListar experimentos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // GET /api/examenes/:id - Muestra detalle de un examen por ID
  async apiObtener(req, res) {
    try {
      const { id } = req.params;
      const experimento = await dbService.getExperimentoById(id);
      res.json({
        success: true,
        data: experimento
      });
    } catch (error) {
      console.error('Error en apiObtener experimento:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Experimento no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // POST /api/examenes - Crea un nuevo examen
  async apiCrear(req, res) {
    try {
      const { nombre, fecha_creacion, duracion_estimada } = req.body;

      // Validación básica
      if (!nombre || !fecha_creacion || !duracion_estimada) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: nombre, fecha_creacion, duracion_estimada'
        });
      }

      if (fecha_creacion < 1900 || fecha_creacion > new Date().getFullYear() + 5) {
        return res.status(400).json({
          success: false,
          message: 'Fecha de creación inválida'
        });
      }

      if (duracion_estimada <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La duración estimada debe ser un número positivo'
        });
      }

      const nuevoExperimento = await dbService.createExperimento({
        nombre,
        fecha_creacion: parseInt(fecha_creacion),
        duracion_estimada: parseInt(duracion_estimada)
      });

      res.status(201).json({
        success: true,
        message: 'Experimento creado exitosamente',
        data: nuevoExperimento
      });
    } catch (error) {
      console.error('Error en apiCrear experimento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // PUT /api/examenes/:id - Modifica todos los datos de un examen
  async apiActualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, fecha_creacion, duracion_estimada } = req.body;

      // Validación básica
      if (!nombre || !fecha_creacion || !duracion_estimada) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: nombre, fecha_creacion, duracion_estimada'
        });
      }

      if (fecha_creacion < 1900 || fecha_creacion > new Date().getFullYear() + 5) {
        return res.status(400).json({
          success: false,
          message: 'Fecha de creación inválida'
        });
      }

      if (duracion_estimada <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La duración estimada debe ser un número positivo'
        });
      }

      const experimentoActualizado = await dbService.updateExperimento(id, {
        nombre,
        fecha_creacion: parseInt(fecha_creacion),
        duracion_estimada: parseInt(duracion_estimada)
      });

      res.json({
        success: true,
        message: 'Experimento actualizado exitosamente',
        data: experimentoActualizado
      });
    } catch (error) {
      console.error('Error en apiActualizar experimento:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Experimento no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/examenes/:id - Elimina un examen por ID
  async apiEliminar(req, res) {
    try {
      const { id } = req.params;
      const experimentoEliminado = await dbService.deleteExperimento(id);

      res.json({
        success: true,
        message: 'Experimento eliminado exitosamente',
        data: experimentoEliminado
      });
    } catch (error) {
      console.error('Error en apiEliminar experimento:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Experimento no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // ========== MÉTODOS PARA RUTAS DE VISTAS (Retornan HTML con EJS) ==========

  // GET /examenes - Lista de experimentos
  async listar(req, res) {
    try {
      const experimentos = await dbService.getAllExperimentos();
      res.render('examenes/listar', {
        title: 'Lista de Experimentos',
        experimentos: experimentos,
        error: req.query.error,
        success: req.query.success
      });
    } catch (error) {
      console.error('Error en listar experimentos:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar la lista de experimentos',
        error: error.message
      });
    }
  }

  // GET /examenes/crear - Formulario de creación de experimento
  crearForm(req, res) {
    res.render('examenes/crear', {
      title: 'Crear Experimento'
    });
  }

  // POST /examenes - Procesa creación de experimento desde formulario
  async crear(req, res) {
    try {
      const { nombre, fecha_creacion, duracion_estimada } = req.body;

      // Validación básica
      if (!nombre || !fecha_creacion || !duracion_estimada) {
        return res.render('examenes/crear', {
          title: 'Crear Experimento',
          error: 'Todos los campos son requeridos',
          experimento: req.body
        });
      }

      if (fecha_creacion < 1900 || fecha_creacion > new Date().getFullYear() + 5) {
        return res.render('examenes/crear', {
          title: 'Crear Experimento',
          error: 'Fecha de creación inválida',
          experimento: req.body
        });
      }

      if (duracion_estimada <= 0) {
        return res.render('examenes/crear', {
          title: 'Crear Experimento',
          error: 'La duración estimada debe ser un número positivo',
          experimento: req.body
        });
      }

      await dbService.createExperimento({
        nombre,
        fecha_creacion: parseInt(fecha_creacion),
        duracion_estimada: parseInt(duracion_estimada)
      });

      res.redirect('/examenes');
    } catch (error) {
      console.error('Error en crear experimento:', error);
      res.render('examenes/crear', {
        title: 'Crear Experimento',
        error: 'Error al crear el experimento: ' + error.message,
        experimento: req.body
      });
    }
  }

  // GET /examenes/:id/editar - Formulario de edición de experimento
  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const experimento = await dbService.getExperimentoById(id);

      res.render('examenes/editar', {
        title: 'Editar Experimento',
        experimento: experimento
      });
    } catch (error) {
      console.error('Error en editarForm experimento:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).render('error', {
          title: 'Experimento no encontrado',
          message: 'El experimento que intenta editar no existe'
        });
      }
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario de edición',
        error: error.message
      });
    }
  }

  // POST /examenes/:id/editar - Procesa edición de experimento desde formulario
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, fecha_creacion, duracion_estimada } = req.body;

      // Validación básica
      if (!nombre || !fecha_creacion || !duracion_estimada) {
        const experimento = await dbService.getExperimentoById(id);
        return res.render('examenes/editar', {
          title: 'Editar Experimento',
          error: 'Todos los campos son requeridos',
          experimento: { ...experimento, ...req.body }
        });
      }

      if (fecha_creacion < 1900 || fecha_creacion > new Date().getFullYear() + 5) {
        const experimento = await dbService.getExperimentoById(id);
        return res.render('examenes/editar', {
          title: 'Editar Experimento',
          error: 'Fecha de creación inválida',
          experimento: { ...experimento, ...req.body }
        });
      }

      if (duracion_estimada <= 0) {
        const experimento = await dbService.getExperimentoById(id);
        return res.render('examenes/editar', {
          title: 'Editar Experimento',
          error: 'La duración estimada debe ser un número positivo',
          experimento: { ...experimento, ...req.body }
        });
      }

      await dbService.updateExperimento(id, {
        nombre,
        fecha_creacion: parseInt(fecha_creacion),
        duracion_estimada: parseInt(duracion_estimada)
      });

      res.redirect('/examenes');
    } catch (error) {
      console.error('Error en editar experimento:', error);
      try {
        const experimento = await dbService.getExperimentoById(req.params.id);
        res.render('examenes/editar', {
          title: 'Editar Experimento',
          error: 'Error al actualizar el experimento: ' + error.message,
          experimento: { ...experimento, ...req.body }
        });
      } catch (dbError) {
        res.status(500).render('error', {
          title: 'Error',
          message: 'Error al procesar la edición',
          error: error.message
        });
      }
    }
  }

  // DELETE /examenes/:id - Elimina un experimento desde vista web
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await dbService.deleteExperimento(id);

      res.redirect('/examenes?success=Experimento eliminado exitosamente');
    } catch (error) {
      console.error('Error en eliminar experimento:', error);
      if (error.message.includes('no encontrado')) {
        return res.redirect('/examenes?error=Experimento no encontrado');
      }
      res.redirect('/examenes?error=Error al eliminar el experimento');
    }
  }
}

module.exports = new ExamenesController();