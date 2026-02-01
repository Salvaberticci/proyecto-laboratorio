const dbService = require('../database/DBService');

class MetodosPagoController {
  // ========== MÉTODOS PARA RUTAS API (Retornan JSON) ==========

  // GET /api/metodospago - Lista todos los métodos de pago
  async apiListar(req, res) {
    try {
      const metodosPago = await dbService.getAllMetodosPago();
      res.json({
        success: true,
        data: metodosPago,
        count: metodosPago.length
      });
    } catch (error) {
      console.error('Error en apiListar métodos de pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // GET /api/metodospago/:id - Muestra detalle de un método de pago por ID
  async apiObtener(req, res) {
    try {
      const { id } = req.params;
      const metodoPago = await dbService.getMetodoPagoById(id);
      res.json({
        success: true,
        data: metodoPago
      });
    } catch (error) {
      console.error('Error en apiObtener método de pago:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Método de pago no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // POST /api/metodospago - Crea un nuevo método de pago
  async apiCrear(req, res) {
    try {
      const { nombre } = req.body;

      // Validación básica
      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: 'El campo nombre es requerido'
        });
      }

      const nuevoMetodoPago = await dbService.createMetodoPago({
        nombre
      });

      res.status(201).json({
        success: true,
        message: 'Método de pago creado exitosamente',
        data: nuevoMetodoPago
      });
    } catch (error) {
      console.error('Error en apiCrear método de pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // PUT /api/metodospago/:id - Modifica todos los datos de un método de pago
  async apiActualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      // Validación básica
      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: 'El campo nombre es requerido'
        });
      }

      const metodoPagoActualizado = await dbService.updateMetodoPago(id, {
        nombre
      });

      res.json({
        success: true,
        message: 'Método de pago actualizado exitosamente',
        data: metodoPagoActualizado
      });
    } catch (error) {
      console.error('Error en apiActualizar método de pago:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Método de pago no encontrado'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/metodospago/:id - Elimina un método de pago por ID
  async apiEliminar(req, res) {
    try {
      const { id } = req.params;
      const metodoPagoEliminado = await dbService.deleteMetodoPago(id);

      res.json({
        success: true,
        message: 'Método de pago eliminado exitosamente',
        data: metodoPagoEliminado
      });
    } catch (error) {
      console.error('Error en apiEliminar método de pago:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: 'Método de pago no encontrado'
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

  // GET /metodospago - Lista de métodos de pago
  async listar(req, res) {
    try {
      const metodosPago = await dbService.getAllMetodosPago();
      res.render('metodospago/listar', {
        title: 'Lista de Métodos de Pago',
        metodosPago: metodosPago
      });
    } catch (error) {
      console.error('Error en listar métodos de pago:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar la lista de métodos de pago',
        error: error.message
      });
    }
  }

  // GET /metodospago/crear - Formulario de creación de método de pago
  crearForm(req, res) {
    res.render('metodospago/crear', {
      title: 'Crear Método de Pago'
    });
  }

  // POST /metodospago - Procesa creación de método de pago desde formulario
  async crear(req, res) {
    try {
      const { nombre } = req.body;

      // Validación básica
      if (!nombre) {
        return res.render('metodospago/crear', {
          title: 'Crear Método de Pago',
          error: 'El campo nombre es requerido',
          metodoPago: req.body
        });
      }

      await dbService.createMetodoPago({
        nombre
      });

      res.redirect('/metodospago');
    } catch (error) {
      console.error('Error en crear método de pago:', error);
      res.render('metodospago/crear', {
        title: 'Crear Método de Pago',
        error: 'Error al crear el método de pago: ' + error.message,
        metodoPago: req.body
      });
    }
  }

  // GET /metodospago/:id/editar - Formulario de edición de método de pago
  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const metodoPago = await dbService.getMetodoPagoById(id);

      res.render('metodospago/editar', {
        title: 'Editar Método de Pago',
        metodoPago: metodoPago
      });
    } catch (error) {
      console.error('Error en editarForm método de pago:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).render('error', {
          title: 'Método de pago no encontrado',
          message: 'El método de pago que intenta editar no existe'
        });
      }
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario de edición',
        error: error.message
      });
    }
  }

  // POST /metodospago/:id/editar - Procesa edición de método de pago desde formulario
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      // Validación básica
      if (!nombre) {
        const metodoPago = await dbService.getMetodoPagoById(id);
        return res.render('metodospago/editar', {
          title: 'Editar Método de Pago',
          error: 'El campo nombre es requerido',
          metodoPago: { ...metodoPago, ...req.body }
        });
      }

      await dbService.updateMetodoPago(id, {
        nombre
      });

      res.redirect('/metodospago');
    } catch (error) {
      console.error('Error en editar método de pago:', error);
      try {
        const metodoPago = await dbService.getMetodoPagoById(req.params.id);
        res.render('metodospago/editar', {
          title: 'Editar Método de Pago',
          error: 'Error al actualizar el método de pago: ' + error.message,
          metodoPago: { ...metodoPago, ...req.body }
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
  // DELETE /metodospago/:id - Elimina un método de pago desde vista web
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await dbService.deleteMetodoPago(id);

      res.redirect('/metodospago?success=Método de pago eliminado exitosamente');
    } catch (error) {
      console.error('Error en eliminar método de pago:', error);
      if (error.message.includes('no encontrado')) {
        return res.redirect('/metodospago?error=Método de pago no encontrado');
      }
      res.redirect('/metodospago?error=Error al eliminar el método de pago');
    }
  }
}

module.exports = new MetodosPagoController();