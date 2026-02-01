const dbService = require('../database/DBService');

class AreasController {
  // ========== MÉTODOS PARA RUTAS API (Retornan JSON) ==========

  // GET /api/areas - Lista todos los laboratorios
  async apiListar(req, res) {
    try {
      const laboratorios = await dbService.getAllLaboratorios();
      res.json({
        success: true,
        data: laboratorios,
        count: laboratorios.length
      });
    } catch (error) {
      console.error('Error en apiListar laboratorios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // GET /api/areas/:id - Muestra detalle de un laboratorio por ID
  async apiObtener(req, res) {
    try {
      const { id } = req.params;
      const laboratorio = await dbService.getLaboratorioById(id);
      res.json({
        success: true,
        data: laboratorio
      });
    } catch (error) {
      console.error('Error en apiObtener laboratorio:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Laboratorio no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // POST /api/areas - Crea un nuevo laboratorio
  async apiCrear(req, res) {
    try {
      const { nombre, capacidad_personas } = req.body;

      // Validación básica
      if (!nombre || !capacidad_personas) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: nombre, capacidad_personas'
        });
      }

      if (capacidad_personas <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La capacidad debe ser un número positivo'
        });
      }

      const nuevoLaboratorio = await dbService.createLaboratorio({
        nombre,
        capacidad_personas: parseInt(capacidad_personas)
      });

      res.status(201).json({
        success: true,
        message: 'Laboratorio creado exitosamente',
        data: nuevoLaboratorio
      });
    } catch (error) {
      console.error('Error en apiCrear laboratorio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // PUT /api/areas/:id - Modifica todos los datos de un laboratorio
  async apiActualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, capacidad_personas } = req.body;

      // Validación básica
      if (!nombre || !capacidad_personas) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: nombre, capacidad_personas'
        });
      }

      if (capacidad_personas <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La capacidad debe ser un número positivo'
        });
      }

      const laboratorioActualizado = await dbService.updateLaboratorio(id, {
        nombre,
        capacidad_personas: parseInt(capacidad_personas)
      });

      res.json({
        success: true,
        message: 'Laboratorio actualizado exitosamente',
        data: laboratorioActualizado
      });
    } catch (error) {
      console.error('Error en apiActualizar laboratorio:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Laboratorio no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/areas/:id - Elimina un laboratorio por ID
  async apiEliminar(req, res) {
    try {
      const { id } = req.params;
      const laboratorioEliminado = await dbService.deleteLaboratorio(id);

      res.json({
        success: true,
        message: 'Laboratorio eliminado exitosamente',
        data: laboratorioEliminado
      });
    } catch (error) {
      console.error('Error en apiEliminar laboratorio:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Laboratorio no encontrado'
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

  // GET /areas - Lista de laboratorios
  async listar(req, res) {
    try {
      const laboratorios = await dbService.getAllLaboratorios();
      res.render('areas/listar', {
        title: 'Lista de Laboratorios',
        laboratorios: laboratorios,
        error: req.query.error,
        success: req.query.success
      });
    } catch (error) {
      console.error('Error en listar laboratorios:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar la lista de laboratorios',
        error: error.message
      });
    }
  }

  // GET /areas/crear - Formulario de creación de laboratorio
  crearForm(req, res) {
    res.render('areas/crear', {
      title: 'Crear Laboratorio'
    });
  }

  // POST /areas - Procesa creación de laboratorio desde formulario
  async crear(req, res) {
    try {
      const { nombre, capacidad_personas } = req.body;

      // Validación básica
      if (!nombre || !capacidad_personas) {
        return res.render('areas/crear', {
          title: 'Crear Laboratorio',
          error: 'Todos los campos son requeridos',
          laboratorio: req.body
        });
      }

      if (capacidad_personas <= 0) {
        return res.render('areas/crear', {
          title: 'Crear Laboratorio',
          error: 'La capacidad debe ser un número positivo',
          laboratorio: req.body
        });
      }

      await dbService.createLaboratorio({
        nombre,
        capacidad_personas: parseInt(capacidad_personas)
      });

      res.redirect('/areas');
    } catch (error) {
      console.error('Error en crear laboratorio:', error);
      res.render('areas/crear', {
        title: 'Crear Laboratorio',
        error: 'Error al crear el laboratorio: ' + error.message,
        laboratorio: req.body
      });
    }
  }

  // GET /areas/:id/editar - Formulario de edición de laboratorio
  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const laboratorio = await dbService.getLaboratorioById(id);

      res.render('areas/editar', {
        title: 'Editar Laboratorio',
        laboratorio: laboratorio
      });
    } catch (error) {
      console.error('Error en editarForm laboratorio:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).render('error', {
          title: 'Laboratorio no encontrado',
          message: 'El laboratorio que intenta editar no existe'
        });
      }
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario de edición',
        error: error.message
      });
    }
  }

  // POST /areas/:id/editar - Procesa edición de laboratorio desde formulario
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, capacidad_personas } = req.body;

      // Validación básica
      if (!nombre || !capacidad_personas) {
        const laboratorio = await dbService.getLaboratorioById(id);
        return res.render('areas/editar', {
          title: 'Editar Laboratorio',
          error: 'Todos los campos son requeridos',
          laboratorio: { ...laboratorio, ...req.body }
        });
      }

      if (capacidad_personas <= 0) {
        const laboratorio = await dbService.getLaboratorioById(id);
        return res.render('areas/editar', {
          title: 'Editar Laboratorio',
          error: 'La capacidad debe ser un número positivo',
          laboratorio: { ...laboratorio, ...req.body }
        });
      }

      await dbService.updateLaboratorio(id, {
        nombre,
        capacidad_personas: parseInt(capacidad_personas)
      });

      res.redirect('/areas');
    } catch (error) {
      console.error('Error en editar laboratorio:', error);
      try {
        const laboratorio = await dbService.getLaboratorioById(req.params.id);
        res.render('areas/editar', {
          title: 'Editar Laboratorio',
          error: 'Error al actualizar el laboratorio: ' + error.message,
          laboratorio: { ...laboratorio, ...req.body }
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

  // DELETE /areas/:id - Elimina un laboratorio desde vista web
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await dbService.deleteLaboratorio(id);

      res.redirect('/areas?success=Laboratorio eliminado exitosamente');
    } catch (error) {
      console.error('Error en eliminar laboratorio:', error);
      if (error.message.includes('no encontrado')) {
        return res.redirect('/areas?error=Laboratorio no encontrado');
      }
      res.redirect('/areas?error=Error al eliminar el laboratorio');
    }
  }
}

module.exports = new AreasController();