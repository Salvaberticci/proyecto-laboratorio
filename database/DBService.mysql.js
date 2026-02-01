// DBService.js - Clase que encapsula la conexión y consultas a la BD MySQL
// Utiliza mysql2 con Promesas para operaciones asíncronas reales de BD
// Aplica el principio de Separación de Intereses (SoC) manteniendo la lógica de BD separada

const mysql = require('mysql2/promise');
require('dotenv').config();

class DBService {
  constructor() {
    this.connection = null;
    this.initConnection();
  }

  // Inicializar conexión a la base de datos
  async initConnection() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      });
      console.log('Conexión a la base de datos establecida exitosamente');
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
      throw error;
    }
  }

  // ========== MÉTODOS CRUD PARA PRODUCTOS ==========

  // CREATE - Crear un nuevo producto
  async createProducto(productoData) {
    try {
      const query = `
        INSERT INTO reactivos (nombre, descripcion, precio, stock, fecha_creacion)
        VALUES (?, ?, ?, ?, CURDATE())
      `;
      const [result] = await this.connection.execute(query, [
        productoData.nombre,
        productoData.descripcion,
        parseFloat(productoData.precio),
        parseInt(productoData.stock)
      ]);

      // Obtener el producto (reactivo) creado
      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw new Error('Error al crear producto: ' + error.message);
    }
  }

  // READ - Obtener todos los productos
  async getAllProductos() {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM reactivos ORDER BY id DESC');
      // Convertir precio a número para compatibilidad con vistas EJS
      return rows.map(producto => ({
        ...producto,
        precio: parseFloat(producto.precio)
      }));
    } catch (error) {
      throw new Error('Error al obtener productos: ' + error.message);
    }
  }

  // READ - Obtener producto por ID
  async getProductoById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Producto no encontrado');
      }

      // Convertir precio a número para compatibilidad con vistas EJS
      return {
        ...rows[0],
        precio: parseFloat(rows[0].precio)
      };
    } catch (error) {
      if (error.message.includes('Producto no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener producto: ' + error.message);
    }
  }

  // UPDATE - Actualizar producto completo
  async updateProducto(id, productoData) {
    try {
      const query = `
        UPDATE reactivos
        SET nombre = ?, descripcion = ?, precio = ?, stock = ?
        WHERE id = ?
      `;
      const [result] = await this.connection.execute(query, [
        productoData.nombre,
        productoData.descripcion,
        parseFloat(productoData.precio),
        parseInt(productoData.stock),
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Producto no encontrado');
      }

      // Obtener el producto actualizado
      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [parseInt(id)]
      );

      return {
        ...rows[0],
        precio: parseFloat(rows[0].precio)
      };
    } catch (error) {
      if (error.message.includes('Producto no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar producto: ' + error.message);
    }
  }

  // DELETE - Eliminar producto por ID
  async deleteProducto(id) {
    try {
      // Primero verificar que el producto existe y obtener sus datos
      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Producto no encontrado');
      }

      // Eliminar el producto
      await this.connection.execute('DELETE FROM reactivos WHERE id = ?', [parseInt(id)]);

      return {
        ...rows[0],
        precio: parseFloat(rows[0].precio)
      };
    } catch (error) {
      if (error.message.includes('Producto no encontrado')) {
        throw error;
      }
      throw new Error('Error al eliminar producto: ' + error.message);
    }
  }

  // ========== MÉTODOS CRUD PARA PEDIDOS ==========

  // CREATE - Crear un nuevo pedido
  async createPedido(pedidoData) {
    try {
      // Verificar que el reactivo existe
      await this.getReactivoById(pedidoData.producto_id);

      const query = `
        INSERT INTO pedidos (producto_id, cantidad, fecha_pedido)
        VALUES (?, ?, CURDATE())
      `;
      const [result] = await this.connection.execute(query, [
        parseInt(pedidoData.producto_id),
        parseInt(pedidoData.cantidad)
      ]);

      // Obtener el pedido creado
      const [rows] = await this.connection.execute(
        'SELECT * FROM pedidos WHERE id = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw new Error('Error al crear pedido: ' + error.message);
    }
  }

  // READ - Obtener todos los pedidos
  async getAllPedidos() {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM pedidos ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw new Error('Error al obtener pedidos: ' + error.message);
    }
  }

  // READ - Obtener últimos 5 pedidos
  async getUltimosPedidos() {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM pedidos ORDER BY fecha_pedido DESC, id DESC LIMIT 5'
      );
      return rows;
    } catch (error) {
      throw new Error('Error al obtener últimos pedidos: ' + error.message);
    }
  }

  // READ - Obtener pedidos por rango de fechas
  async getPedidosByDateRange(fechaInicio, fechaFin) {
    try {
      const query = `
        SELECT * FROM pedidos 
        WHERE fecha_pedido BETWEEN ? AND ?
        ORDER BY fecha_pedido DESC
      `;
      const [rows] = await this.connection.execute(query, [fechaInicio, fechaFin]);
      return rows;
    } catch (error) {
      throw new Error('Error al filtrar pedidos por fecha: ' + error.message);
    }
  }

  // READ - Obtener pedido por ID
  async getPedidoById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM pedidos WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Pedido no encontrado');
      }

      return rows[0];
    } catch (error) {
      if (error.message.includes('Pedido no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener pedido: ' + error.message);
    }
  }

  // UPDATE - Actualizar pedido completo
  async updatePedido(id, pedidoData) {
    try {
      // Verificar que el reactivo existe
      await this.getReactivoById(pedidoData.producto_id);

      const query = `
        UPDATE pedidos
        SET producto_id = ?, cantidad = ?
        WHERE id = ?
      `;
      const [result] = await this.connection.execute(query, [
        parseInt(pedidoData.producto_id),
        parseInt(pedidoData.cantidad),
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Pedido no encontrado');
      }

      // Obtener el pedido actualizado
      const [rows] = await this.connection.execute(
        'SELECT * FROM pedidos WHERE id = ?',
        [parseInt(id)]
      );

      return rows[0];
    } catch (error) {
      if (error.message.includes('Pedido no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar pedido: ' + error.message);
    }
  }

  // DELETE - Eliminar pedido por ID
  async deletePedido(id) {
    try {
      // Primero verificar que el pedido existe y obtener sus datos
      const [rows] = await this.connection.execute(
        'SELECT * FROM pedidos WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Pedido no encontrado');
      }

      // Eliminar el pedido
      await this.connection.execute('DELETE FROM pedidos WHERE id = ?', [parseInt(id)]);

      return rows[0];
    } catch (error) {
      if (error.message.includes('Pedido no encontrado')) {
        throw error;
      }
      throw new Error('Error al eliminar pedido: ' + error.message);
    }
  }

  // DELETE - Eliminar relación específica entre pedido y producto
  async deletePedidoProducto(pedidoId, productoId) {
    try {
      const query = `
        DELETE FROM pedidos
        WHERE id = ? AND producto_id = ?
      `;
      const [result] = await this.connection.execute(query, [
        parseInt(pedidoId),
        parseInt(productoId)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Relación pedido-producto no encontrada');
      }

      return { id: parseInt(pedidoId), producto_id: parseInt(productoId) };
    } catch (error) {
      if (error.message.includes('Relación pedido-producto no encontrada')) {
        throw error;
      }
      throw new Error('Error al eliminar relación pedido-producto: ' + error.message);
    }
  }

  // ========== MÉTODOS CRUD PARA EXPERIMENTOS ==========

  // CREATE - Crear un nuevo experimento
  async createExperimento(experimentoData) {
    try {
      const query = `
        INSERT INTO experimentos (nombre, fecha_creacion, duracion_estimada)
        VALUES (?, ?, ?)
      `;
      const [result] = await this.connection.execute(query, [
        experimentoData.nombre,
        parseInt(experimentoData.fecha_creacion),
        parseInt(experimentoData.duracion_estimada)
      ]);

      // Obtener el experimento creado
      const [rows] = await this.connection.execute(
        'SELECT * FROM experimentos WHERE id_experimento = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw new Error('Error al crear experimento: ' + error.message);
    }
  }

  // READ - Obtener todos los experimentos
  async getAllExperimentos() {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM experimentos ORDER BY id_experimento DESC');
      return rows;
    } catch (error) {
      throw new Error('Error al obtener experimentos: ' + error.message);
    }
  }

  // READ - Obtener experimento por ID
  async getExperimentoById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM experimentos WHERE id_experimento = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Experimento no encontrado');
      }

      return rows[0];
    } catch (error) {
      if (error.message.includes('Experimento no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener experimento: ' + error.message);
    }
  }

  // UPDATE - Actualizar experimento completo
  async updateExperimento(id, experimentoData) {
    try {
      const query = `
        UPDATE experimentos
        SET nombre = ?, fecha_creacion = ?, duracion_estimada = ?
        WHERE id_experimento = ?
      `;
      const [result] = await this.connection.execute(query, [
        experimentoData.nombre,
        parseInt(experimentoData.fecha_creacion),
        parseInt(experimentoData.duracion_estimada),
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Experimento no encontrado');
      }

      // Obtener el experimento actualizado
      const [rows] = await this.connection.execute(
        'SELECT * FROM experimentos WHERE id_experimento = ?',
        [parseInt(id)]
      );

      return rows[0];
    } catch (error) {
      if (error.message.includes('Experimento no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar experimento: ' + error.message);
    }
  }

  // DELETE - Eliminar experimento por ID
  async deleteExperimento(id) {
    try {
      // Primero verificar que el experimento existe y obtener sus datos
      const [rows] = await this.connection.execute(
        'SELECT * FROM experimentos WHERE id_experimento = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Experimento no encontrado');
      }

      // Eliminar el experimento
      await this.connection.execute('DELETE FROM experimentos WHERE id_experimento = ?', [parseInt(id)]);

      return rows[0];
    } catch (error) {
      if (error.message.includes('Experimento no encontrado')) {
        throw error;
      }
      throw new Error('Error al eliminar experimento: ' + error.message);
    }
  }

  // ========== MÉTODOS CRUD PARA LABORATORIOS ==========

  // CREATE - Crear un nuevo laboratorio
  async createLaboratorio(laboratorioData) {
    try {
      const query = `
        INSERT INTO laboratorios (nombre, capacidad_personas)
        VALUES (?, ?)
      `;
      const [result] = await this.connection.execute(query, [
        laboratorioData.nombre,
        parseInt(laboratorioData.capacidad_personas)
      ]);

      // Obtener el laboratorio creado
      const [rows] = await this.connection.execute(
        'SELECT * FROM laboratorios WHERE id_laboratorio = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw new Error('Error al crear laboratorio: ' + error.message);
    }
  }

  // READ - Obtener todos los laboratorios
  async getAllLaboratorios() {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM laboratorios ORDER BY id_laboratorio DESC');
      return rows;
    } catch (error) {
      throw new Error('Error al obtener laboratorios: ' + error.message);
    }
  }

  // READ - Obtener laboratorio por ID
  async getLaboratorioById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM laboratorios WHERE id_laboratorio = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Laboratorio no encontrado');
      }

      return rows[0];
    } catch (error) {
      if (error.message.includes('Laboratorio no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener laboratorio: ' + error.message);
    }
  }

  // UPDATE - Actualizar laboratorio completo
  async updateLaboratorio(id, laboratorioData) {
    try {
      const query = `
        UPDATE laboratorios
        SET nombre = ?, capacidad_personas = ?
        WHERE id_laboratorio = ?
      `;
      const [result] = await this.connection.execute(query, [
        laboratorioData.nombre,
        parseInt(laboratorioData.capacidad_personas),
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Laboratorio no encontrado');
      }

      // Obtener el laboratorio actualizado
      const [rows] = await this.connection.execute(
        'SELECT * FROM laboratorios WHERE id_laboratorio = ?',
        [parseInt(id)]
      );

      return rows[0];
    } catch (error) {
      if (error.message.includes('Laboratorio no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar laboratorio: ' + error.message);
    }
  }

  // DELETE - Eliminar laboratorio por ID
  async deleteLaboratorio(id) {
    try {
      // Primero verificar que el laboratorio existe y obtener sus datos
      const [rows] = await this.connection.execute(
        'SELECT * FROM laboratorios WHERE id_laboratorio = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Laboratorio no encontrado');
      }

      // Eliminar el laboratorio
      await this.connection.execute('DELETE FROM laboratorios WHERE id_laboratorio = ?', [parseInt(id)]);

      return rows[0];
    } catch (error) {
      if (error.message.includes('Laboratorio no encontrado')) {
        throw error;
      }
      throw new Error('Error al eliminar laboratorio: ' + error.message);
    }
  }

  // ========== MÉTODOS CRUD PARA MÉTODOS DE PAGO ==========

  // CREATE - Crear un nuevo método de pago
  async createMetodoPago(metodoData) {
    try {
      const query = `
        INSERT INTO metodos_pago (nombre)
        VALUES (?)
      `;
      const [result] = await this.connection.execute(query, [metodoData.nombre]);

      // Obtener el método de pago creado
      const [rows] = await this.connection.execute(
        'SELECT * FROM metodos_pago WHERE id_metodo = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw new Error('Error al crear método de pago: ' + error.message);
    }
  }

  // READ - Obtener todos los métodos de pago
  async getAllMetodosPago() {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM metodos_pago ORDER BY id_metodo DESC');
      return rows;
    } catch (error) {
      throw new Error('Error al obtener métodos de pago: ' + error.message);
    }
  }

  // READ - Obtener método de pago por ID
  async getMetodoPagoById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM metodos_pago WHERE id_metodo = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Método de pago no encontrado');
      }

      return rows[0];
    } catch (error) {
      if (error.message.includes('Método de pago no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener método de pago: ' + error.message);
    }
  }

  // UPDATE - Actualizar método de pago completo
  async updateMetodoPago(id, metodoData) {
    try {
      const query = `
        UPDATE metodos_pago
        SET nombre = ?
        WHERE id_metodo = ?
      `;
      const [result] = await this.connection.execute(query, [
        metodoData.nombre,
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Método de pago no encontrado');
      }

      // Obtener el método de pago actualizado
      const [rows] = await this.connection.execute(
        'SELECT * FROM metodos_pago WHERE id_metodo = ?',
        [parseInt(id)]
      );

      return rows[0];
    } catch (error) {
      if (error.message.includes('Método de pago no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar método de pago: ' + error.message);
    }
  }

  // DELETE - Eliminar método de pago por ID
  async deleteMetodoPago(id) {
    try {
      // Primero verificar que el método de pago existe y obtener sus datos
      const [rows] = await this.connection.execute(
        'SELECT * FROM metodos_pago WHERE id_metodo = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Método de pago no encontrado');
      }

      // Eliminar el método de pago
      await this.connection.execute('DELETE FROM metodos_pago WHERE id_metodo = ?', [parseInt(id)]);

      return rows[0];
    } catch (error) {
      if (error.message.includes('Método de pago no encontrado')) {
        throw error;
      }
      throw new Error('Error al eliminar método de pago: ' + error.message);
    }
  }

  // ========== MÉTODOS CRUD PARA PRUEBAS ==========

  // CREATE - Crear una nueva prueba
  async createPrueba(pruebaData) {
    try {
      // Verificar que el experimento y laboratorio existen
      await this.getExperimentoById(pruebaData.id_experimento);
      await this.getLaboratorioById(pruebaData.id_laboratorio);

      const query = `
        INSERT INTO pruebas (id_experimento, id_laboratorio, fecha_hora_inicio)
        VALUES (?, ?, ?)
      `;
      const [result] = await this.connection.execute(query, [
        parseInt(pruebaData.id_experimento),
        parseInt(pruebaData.id_laboratorio),
        pruebaData.fecha_hora_inicio
      ]);

      // Obtener la prueba creada
      const [rows] = await this.connection.execute(
        'SELECT * FROM pruebas WHERE id_prueba = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw new Error('Error al crear prueba: ' + error.message);
    }
  }

  // READ - Obtener todas las pruebas
  async getAllPruebas() {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM pruebas ORDER BY id_prueba DESC');
      return rows;
    } catch (error) {
      throw new Error('Error al obtener pruebas: ' + error.message);
    }
  }

  // READ - Obtener prueba por ID
  async getPruebaById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM pruebas WHERE id_prueba = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Prueba no encontrada');
      }
      return rows[0];
    } catch (error) {
      if (error.message.includes('Prueba no encontrada')) {
        throw error;
      }
      throw new Error('Error al obtener prueba: ' + error.message);
    }
  }

  // UPDATE - Actualizar prueba completa
  async updatePrueba(id, pruebaData) {
    try {
      // Verificar que el experimento y laboratorio existen
      await this.getExperimentoById(pruebaData.id_experimento);
      await this.getLaboratorioById(pruebaData.id_laboratorio);

      const query = `
        UPDATE pruebas
        SET id_experimento = ?, id_laboratorio = ?, fecha_hora_inicio = ?
        WHERE id_prueba = ?
      `;
      const [result] = await this.connection.execute(query, [
        parseInt(pruebaData.id_experimento),
        parseInt(pruebaData.id_laboratorio),
        pruebaData.fecha_hora_inicio,
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Prueba no encontrada');
      }

      // Obtener la prueba actualizada
      const [rows] = await this.connection.execute(
        'SELECT * FROM pruebas WHERE id_prueba = ?',
        [parseInt(id)]
      );

      return rows[0];
    } catch (error) {
      if (error.message.includes('Prueba no encontrada')) {
        throw error;
      }
      throw new Error('Error al actualizar prueba: ' + error.message);
    }
  }

  // DELETE - Eliminar prueba por ID
  async deletePrueba(id) {
    try {
      // Primero verificar que la prueba existe y obtener sus datos
      const [rows] = await this.connection.execute(
        'SELECT * FROM pruebas WHERE id_prueba = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Prueba no encontrada');
      }

      // Eliminar la prueba
      await this.connection.execute('DELETE FROM pruebas WHERE id_prueba = ?', [parseInt(id)]);

      return rows[0];
    } catch (error) {
      if (error.message.includes('Prueba no encontrada')) {
        throw error;
      }
      throw new Error('Error al eliminar prueba: ' + error.message);
    }
  }

  // ========== MÉTODOS CRUD PARA USUARIOS ==========

  // CREATE - Crear un nuevo usuario
  async createUsuario(userData) {
    try {
      const query = `
        INSERT INTO usuarios (username, email, password_hash, role, activo)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await this.connection.execute(query, [
        userData.username,
        userData.email,
        userData.password_hash,
        userData.role || 'user',
        userData.activo !== undefined ? userData.activo : 1
      ]);

      // Obtener el usuario creado (sin password_hash por seguridad)
      const [rows] = await this.connection.execute(
        'SELECT id, username, email, role, activo, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error) {
      throw new Error('Error al crear usuario: ' + error.message);
    }
  }

  // READ - Obtener todos los usuarios
  async getAllUsuarios() {
    try {
      const [rows] = await this.connection.execute(
        'SELECT id, username, email, role, activo, fecha_creacion, fecha_actualizacion FROM usuarios ORDER BY id DESC'
      );
      return rows;
    } catch (error) {
      throw new Error('Error al obtener usuarios: ' + error.message);
    }
  }

  // READ - Obtener usuario por ID
  async getUsuarioById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT id, username, email, role, activo, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return rows[0];
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener usuario: ' + error.message);
    }
  }

  // READ - Obtener usuario por username (para login)
  async getUsuarioByUsername(username) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM usuarios WHERE username = ? AND activo = 1',
        [username]
      );

      if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return rows[0];
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener usuario: ' + error.message);
    }
  }

  // READ - Obtener usuario por email
  async getUsuarioByEmail(email) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT id, username, email, role, activo, fecha_creacion, fecha_actualizacion FROM usuarios WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return rows[0];
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener usuario: ' + error.message);
    }
  }

  // UPDATE - Actualizar usuario completo
  async updateUsuario(id, userData) {
    try {
      const query = `
        UPDATE usuarios
        SET username = ?, email = ?, role = ?, activo = ?
        WHERE id = ?
      `;
      const [result] = await this.connection.execute(query, [
        userData.username,
        userData.email,
        userData.role,
        userData.activo !== undefined ? userData.activo : 1,
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Obtener el usuario actualizado
      const [rows] = await this.connection.execute(
        'SELECT id, username, email, role, activo, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ?',
        [parseInt(id)]
      );

      return rows[0];
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar usuario: ' + error.message);
    }
  }

  // UPDATE - Actualizar contraseña
  async updateUsuarioPassword(id, passwordHash) {
    try {
      const query = `
        UPDATE usuarios
        SET password_hash = ?
        WHERE id = ?
      `;
      const [result] = await this.connection.execute(query, [
        passwordHash,
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Usuario no encontrado');
      }

      return { id: parseInt(id), updated: true };
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar contraseña: ' + error.message);
    }
  }

  // DELETE - Eliminar usuario por ID (desactivar)
  async deleteUsuario(id) {
    try {
      // Primero verificar que el usuario existe
      const [rows] = await this.connection.execute(
        'SELECT id, username, email FROM usuarios WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Desactivar usuario en lugar de eliminar físicamente
      await this.connection.execute(
        'UPDATE usuarios SET activo = 0 WHERE id = ?',
        [parseInt(id)]
      );

      return rows[0];
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw error;
      }
      throw new Error('Error al eliminar usuario: ' + error.message);
    }
  }

  // ========== MÉTODOS CRUD PARA REACTIVOS ==========

  // CREATE - Crear un nuevo reactivo
  async createReactivo(reactivoData) {
    try {
      const query = `
        INSERT INTO reactivos (nombre, descripcion, precio, stock)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await this.connection.execute(query, [
        reactivoData.nombre,
        reactivoData.descripcion || null,
        parseFloat(reactivoData.precio),
        parseInt(reactivoData.stock)
      ]);


      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [result.insertId]
      );

      return {
        ...rows[0],
        precio: parseFloat(rows[0].precio)
      };
    } catch (error) {
      throw new Error('Error al crear reactivo: ' + error.message);
    }
  }

  // READ - Obtener todos los reactivos
  async getAllReactivos() {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM reactivos ORDER BY id DESC');
      return rows.map(reactivo => ({
        ...reactivo,
        precio: parseFloat(reactivo.precio)
      }));
    } catch (error) {
      throw new Error('Error al obtener reactivos: ' + error.message);
    }
  }

  // READ - Obtener reactivo por ID
  async getReactivoById(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Reactivo no encontrado');
      }

      return {
        ...rows[0],
        precio: parseFloat(rows[0].precio)
      };
    } catch (error) {
      if (error.message.includes('Reactivo no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener reactivo: ' + error.message);
    }
  }

  // UPDATE - Actualizar reactivo completo
  async updateReactivo(id, reactivoData) {
    try {
      const query = `
        UPDATE reactivos
        SET nombre = ?, descripcion = ?, precio = ?, stock = ?
        WHERE id = ?
      `;
      const [result] = await this.connection.execute(query, [
        reactivoData.nombre,
        reactivoData.descripcion || null,
        parseFloat(reactivoData.precio),
        parseInt(reactivoData.stock),
        parseInt(id)
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Reactivo no encontrado');
      }

      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [parseInt(id)]
      );

      return {
        ...rows[0],
        precio: parseFloat(rows[0].precio)
      };
    } catch (error) {
      if (error.message.includes('Reactivo no encontrado')) {
        throw error;
      }
      throw new Error('Error al actualizar reactivo: ' + error.message);
    }
  }

  // DELETE - Eliminar reactivo por ID
  async deleteReactivo(id) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM reactivos WHERE id = ?',
        [parseInt(id)]
      );

      if (rows.length === 0) {
        throw new Error('Reactivo no encontrado');
      }

      // Eliminar el reactivo
      await this.connection.execute('DELETE FROM reactivos WHERE id = ?', [parseInt(id)]);

      return {
        ...rows[0],
        precio: parseFloat(rows[0].precio)
      };
    } catch (error) {
      if (error.message.includes('Reactivo no encontrado')) {
        throw error;
      }
      throw new Error('Error al eliminar reactivo: ' + error.message);
    }
  }
}

module.exports = new DBService();