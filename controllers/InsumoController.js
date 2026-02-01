// InsumoController.js - Clase controladora para la gestión de reactivos
// Implementa POO con ES6 classes, consume DBService con async/await y gestiona errores
// Maneja tanto rutas API (JSON) como rutas de vistas (EJS)

const dbService = require('../database/DBService');

class InsumoController {
  // ========== MÉTODOS PARA RUTAS API (Retornan JSON) ==========

  // GET /api/insumos - Lista todos los reactivos
  async apiListar(req, res) {
    try {
      const reactivos = await dbService.getAllReactivos();
      res.json({
        success: true,
        data: reactivos,
        count: reactivos.length
      });
    } catch (error) {
      console.error('Error en apiListar reactivos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // GET /api/insumos/:id - Muestra detalle de un reactivo por ID
  async apiObtener(req, res) {
    try {
      const { id } = req.params;
      const reactivo = await dbService.getReactivoById(id);
      res.json({
        success: true,
        data: reactivo
      });
    } catch (error) {
      console.error('Error en apiObtener reactivo:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'reactivo no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // POST /api/insumos - Crea un nuevo reactivo
  async apiCrear(req, res) {
    try {
      const { nombre, descripcion, precio, stock } = req.body;

      // Validación básica
      if (!nombre || !descripcion || precio === undefined || stock === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: nombre, descripcion, precio, stock'
        });
      }

      if (precio < 0 || stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Precio y stock deben ser valores positivos'
        });
      }

      const nuevoreactivo = await dbService.createReactivo({
        nombre,
        descripcion,
        precio,
        stock
      });

      res.status(201).json({
        success: true,
        message: 'reactivo creado exitosamente',
        data: nuevoreactivo
      });
    } catch (error) {
      console.error('Error en apiCrear reactivo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // PUT /api/insumos/:id - Modifica todos los datos de un reactivo
  async apiActualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock } = req.body;

      // Validación básica
      if (!nombre || !descripcion || precio === undefined || stock === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: nombre, descripcion, precio, stock'
        });
      }

      if (precio < 0 || stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Precio y stock deben ser valores positivos'
        });
      }

      const reactivoActualizado = await dbService.updateReactivo(id, {
        nombre,
        descripcion,
        precio,
        stock
      });

      res.json({
        success: true,
        message: 'reactivo actualizado exitosamente',
        data: reactivoActualizado
      });
    } catch (error) {
      console.error('Error en apiActualizar reactivo:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'reactivo no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/insumos/:id - Elimina un reactivo por ID
  async apiEliminar(req, res) {
    try {
      const { id } = req.params;
      const reactivoEliminado = await dbService.deleteReactivo(id);

      res.json({
        success: true,
        message: 'reactivo eliminado exitosamente',
        data: reactivoEliminado
      });
    } catch (error) {
      console.error('Error en apiEliminar reactivo:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'reactivo no encontrado'
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

  // GET /insumos - Lista de reactivos
  async listar(req, res) {
    try {
      const reactivos = await dbService.getAllReactivos();
      res.render('insumos/listar', {
        title: 'Lista de reactivos',
        reactivos: reactivos
      });
    } catch (error) {
      console.error('Error en listar reactivos:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar la lista de reactivos',
        error: error.message
      });
    }
  }

  // GET /insumos/crear - Formulario de creación de reactivo
  crearForm(req, res) {
    res.render('insumos/crear', {
      title: 'Crear reactivo'
    });
  }

  // POST /insumos - Procesa creación de reactivo desde formulario
  async crear(req, res) {
    try {
      const { nombre, descripcion, precio, stock } = req.body;

      // Validación básica
      if (!nombre || !descripcion || precio === undefined || stock === undefined) {
        return res.render('insumos/crear', {
          title: 'Crear reactivo',
          error: 'Todos los campos son requeridos',
          reactivo: req.body
        });
      }

      if (precio < 0 || stock < 0) {
        return res.render('insumos/crear', {
          title: 'Crear reactivo',
          error: 'Precio y stock deben ser valores positivos',
          reactivo: req.body
        });
      }

      await dbService.createReactivo({
        nombre,
        descripcion,
        precio,
        stock
      });

      res.redirect('/insumos');
    } catch (error) {
      console.error('Error en crear reactivo:', error);
      res.render('insumos/crear', {
        title: 'Crear reactivo',
        error: 'Error al crear el reactivo: ' + error.message,
        reactivo: req.body
      });
    }
  }

  // GET /insumos/:id/editar - Formulario de edición de reactivo
  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const reactivo = await dbService.getReactivoById(id);

      res.render('insumos/editar', {
        title: 'Editar reactivo',
        reactivo: reactivo
      });
    } catch (error) {
      console.error('Error en editarForm reactivo:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).render('error', {
          title: 'reactivo no encontrado',
          message: 'El reactivo que intenta editar no existe'
        });
      }
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario de edición',
        error: error.message
      });
    }
  }

  // POST /insumos/:id/editar - Procesa edición de reactivo desde formulario
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock } = req.body;

      // Validación básica
      if (!nombre || !descripcion || precio === undefined || stock === undefined) {
        const reactivo = await dbService.getReactivoById(id);
        return res.render('insumos/editar', {
          title: 'Editar reactivo',
          error: 'Todos los campos son requeridos',
          reactivo: { ...reactivo, ...req.body }
        });
      }

      if (precio < 0 || stock < 0) {
        const reactivo = await dbService.getReactivoById(id);
        return res.render('insumos/editar', {
          title: 'Editar reactivo',
          error: 'Precio y stock deben ser valores positivos',
          reactivo: { ...reactivo, ...req.body }
        });
      }

      await dbService.updateReactivo(id, {
        nombre,
        descripcion,
        precio,
        stock
      });

      res.redirect('/insumos');
    } catch (error) {
      console.error('Error en editar reactivo:', error);
      try {
        const reactivo = await dbService.getReactivoById(req.params.id);
        res.render('insumos/editar', {
          title: 'Editar reactivo',
          error: 'Error al actualizar el reactivo: ' + error.message,
          reactivo: { ...reactivo, ...req.body }
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

module.exports = new InsumoController();
