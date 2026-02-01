const dbService = require('../database/DBService');

class CitasController {
  // ========== MÉTODOS PARA RUTAS API (Retornan JSON) ==========

  // GET /api/citas - Lista todas las pruebas
  async apiListar(req, res) {
    try {
      const pruebas = await dbService.getAllPruebas();
      res.json({
        success: true,
        data: pruebas,
        count: pruebas.length
      });
    } catch (error) {
      console.error('Error en apiListar pruebas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // GET /api/citas/:id - Muestra detalle de una prueba por ID
  async apiObtener(req, res) {
    try {
      const { id } = req.params;
      const prueba = await dbService.getPruebaById(id);
      res.json({
        success: true,
        data: prueba
      });
    } catch (error) {
      console.error('Error en apiObtener prueba:', error);
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          message: 'Prueba no encontrada'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // POST /api/citas - Crea una nueva prueba
  async apiCrear(req, res) {
    try {
      const { id_experimento, id_laboratorio, fecha_hora_inicio } = req.body;

      // Validación básica
      if (!id_experimento || !id_laboratorio || !fecha_hora_inicio) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: id_experimento, id_laboratorio, fecha_hora_inicio'
        });
      }

      const nuevaPrueba = await dbService.createPrueba({
        id_experimento: parseInt(id_experimento),
        id_laboratorio: parseInt(id_laboratorio),
        fecha_hora_inicio
      });

      res.status(201).json({
        success: true,
        message: 'Prueba creada exitosamente',
        data: nuevaPrueba
      });
    } catch (error) {
      console.error('Error en apiCrear prueba:', error);
      if (error.message.includes('Experimento no encontrado') || error.message.includes('Laboratorio no encontrado')) {
        return res.status(400).json({
          success: false,
          message: 'Experimento o laboratorio especificado no existe'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // PUT /api/citas/:id - Modifica todos los datos de una prueba
  async apiActualizar(req, res) {
    try {
      const { id } = req.params;
      const { id_experimento, id_laboratorio, fecha_hora_inicio } = req.body;

      // Validación básica
      if (!id_experimento || !id_laboratorio || !fecha_hora_inicio) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: id_experimento, id_laboratorio, fecha_hora_inicio'
        });
      }

      const pruebaActualizada = await dbService.updatePrueba(id, {
        id_experimento: parseInt(id_experimento),
        id_laboratorio: parseInt(id_laboratorio),
        fecha_hora_inicio
      });

      res.json({
        success: true,
        message: 'Prueba actualizada exitosamente',
        data: pruebaActualizada
      });
    } catch (error) {
      console.error('Error en apiActualizar prueba:', error);
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          message: 'Prueba no encontrada'
        });
      }
      if (error.message.includes('Experimento no encontrado') || error.message.includes('Laboratorio no encontrado')) {
        return res.status(400).json({
          success: false,
          message: 'Experimento o laboratorio especificado no existe'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/citas/:id - Elimina una prueba por ID
  async apiEliminar(req, res) {
    try {
      const { id } = req.params;
      const pruebaEliminada = await dbService.deletePrueba(id);

      res.json({
        success: true,
        message: 'Prueba eliminada exitosamente',
        data: pruebaEliminada
      });
    } catch (error) {
      console.error('Error en apiEliminar prueba:', error);
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          message: 'Prueba no encontrada'
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

  // GET /citas - Lista de pruebas
  async listar(req, res) {
    try {
      const pruebas = await dbService.getAllPruebas();
      // Obtener experimentos y laboratorios para mostrar nombres en lugar de IDs
      const experimentos = await dbService.getAllExperimentos();
      const laboratorios = await dbService.getAllLaboratorios();

      const experimentosMap = experimentos.reduce((map, experimento) => {
        map[experimento.id_experimento] = experimento.nombre;
        return map;
      }, {});

      const laboratoriosMap = laboratorios.reduce((map, laboratorio) => {
        map[laboratorio.id_laboratorio] = laboratorio.nombre;
        return map;
      }, {});

      res.render('citas/listar', {
        title: 'Lista de Pruebas',
        pruebas: pruebas,
        experimentosMap: experimentosMap,
        laboratoriosMap: laboratoriosMap
      });
    } catch (error) {
      console.error('Error en listar pruebas:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar la lista de pruebas',
        error: error.message
      });
    }
  }

  // GET /citas/crear - Formulario de creación de prueba
  async crearForm(req, res) {
    try {
      const experimentos = await dbService.getAllExperimentos();
      const laboratorios = await dbService.getAllLaboratorios();
      res.render('citas/crear', {
        title: 'Crear Prueba',
        experimentos: experimentos,
        laboratorios: laboratorios
      });
    } catch (error) {
      console.error('Error en crearForm prueba:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario de creación',
        error: error.message
      });
    }
  }

  // POST /citas - Procesa creación de prueba desde formulario
  async crear(req, res) {
    try {
      const { id_experimento, id_laboratorio, fecha_hora_inicio } = req.body;

      // Validación básica
      if (!id_experimento || !id_laboratorio || !fecha_hora_inicio) {
        const experimentos = await dbService.getAllExperimentos();
        const laboratorios = await dbService.getAllLaboratorios();
        return res.render('citas/crear', {
          title: 'Crear Prueba',
          error: 'Los campos experimento, laboratorio y fecha/hora son requeridos',
          experimentos: experimentos,
          laboratorios: laboratorios,
          prueba: req.body
        });
      }

      await dbService.createPrueba({
        id_experimento: parseInt(id_experimento),
        id_laboratorio: parseInt(id_laboratorio),
        fecha_hora_inicio
      });

      res.redirect('/citas');
    } catch (error) {
      console.error('Error en crear prueba:', error);
      try {
        const experimentos = await dbService.getAllExperimentos();
        const laboratorios = await dbService.getAllLaboratorios();
        res.render('citas/crear', {
          title: 'Crear Prueba',
          error: 'Error al crear la prueba: ' + error.message,
          experimentos: experimentos,
          laboratorios: laboratorios,
          prueba: req.body
        });
      } catch (dbError) {
        res.status(500).render('error', {
          title: 'Error',
          message: 'Error al procesar la creación',
          error: error.message
        });
      }
    }
  }

  // GET /citas/:id/editar - Formulario de edición de prueba
  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const prueba = await dbService.getPruebaById(id);
      const experimentos = await dbService.getAllExperimentos();
      const laboratorios = await dbService.getAllLaboratorios();

      res.render('citas/editar', {
        title: 'Editar Prueba',
        prueba: prueba,
        experimentos: experimentos,
        laboratorios: laboratorios
      });
    } catch (error) {
      console.error('Error en editarForm prueba:', error);
      if (error.message.includes('no encontrada')) {
        return res.status(404).render('error', {
          title: 'Prueba no encontrada',
          message: 'La prueba que intenta editar no existe'
        });
      }
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario de edición',
        error: error.message
      });
    }
  }

  // POST /citas/:id/editar - Procesa edición de prueba desde formulario
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { id_experimento, id_laboratorio, fecha_hora_inicio } = req.body;

      // Validación básica
      if (!id_experimento || !id_laboratorio || !fecha_hora_inicio) {
        const prueba = await dbService.getPruebaById(id);
        const experimentos = await dbService.getAllExperimentos();
        const laboratorios = await dbService.getAllLaboratorios();
        return res.render('citas/editar', {
          title: 'Editar Prueba',
          error: 'Los campos experimento, laboratorio y fecha/hora son requeridos',
          prueba: { ...prueba, ...req.body },
          experimentos: experimentos,
          laboratorios: laboratorios
        });
      }

      await dbService.updatePrueba(id, {
        id_experimento: parseInt(id_experimento),
        id_laboratorio: parseInt(id_laboratorio),
        fecha_hora_inicio
      });

      res.redirect('/citas');
    } catch (error) {
      console.error('Error en editar prueba:', error);
      try {
        const prueba = await dbService.getPruebaById(req.params.id);
        const experimentos = await dbService.getAllExperimentos();
        const laboratorios = await dbService.getAllLaboratorios();
        res.render('citas/editar', {
          title: 'Editar Prueba',
          error: 'Error al actualizar la prueba: ' + error.message,
          prueba: { ...prueba, ...req.body },
          experimentos: experimentos,
          laboratorios: laboratorios
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
}

module.exports = new CitasController();