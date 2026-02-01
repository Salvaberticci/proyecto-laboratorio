// DBService.js - Servicio de Base de Datos IN-MEMORY (Simulado)
// Cumple con el requisito académico de "almacenar información en variables"
// Mantiene las mismas firmas de métodos para compatibilidad con Controladores

class DBService {
  constructor() {
    // Inicialización de "Tablas" en memoria (Arrays)
    this.reactivos = [
      { id: 1, nombre: 'Ácido Clorhídrico 1L', descripcion: 'Ácido clorhídrico concentrado para análisis', precio: 15.50, stock: 100, fecha_creacion: '2025-10-22' },
      { id: 2, nombre: 'Placas Petri (Pack 50)', descripcion: 'Placas de cultivo estériles', precio: 25.00, stock: 150, fecha_creacion: '2025-10-22' },
      { id: 3, nombre: 'Pipetas Graduadas 10ml', descripcion: 'Set de pipetas graduadas de vidrio', precio: 18.00, stock: 80, fecha_creacion: '2025-10-22' }
    ];

    this.pedidos = []; // RESTORED: Inicialización de pedidos

    this.users = [
      { id: 1, username: 'admin', email: 'admin@example.com', password_hash: '$2b$10$IeyDE0DtGmqpSFl8r25.KesEvsH/C9OcxDOC90MzMfref6oykzeNq', role: 'admin', activo: 1 }, // admin 12345
      { id: 2, username: 'user', email: 'user@example.com', password_hash: '$2b$10$IeyDE0DtGmqpSFl8r25.KesEvsH/C9OcxDOC90MzMfref6oykzeNq', role: 'user', activo: 1 }   // user 12345
    ];
    this.nextUserId = 3;

    // Inicialización de nuevos módulos: Experimentos, Pruebas (Citas), Laboratorios
    this.experimentos = [
      { id: 1, nombre: 'Experimento de Titulación', fecha_creacion: 2024, duracion_estimada: 60 },
      { id: 2, nombre: 'Cultivo de Bacterias', fecha_creacion: 2025, duracion_estimada: 120 }
    ];
    this.pruebas = [];
    this.laboratorios = [
      { id_laboratorio: 1, nombre: 'Laboratorio de Química', ubicacion: 'Edificio A' },
      { id_laboratorio: 2, nombre: 'Laboratorio de Biología', ubicacion: 'Edificio B' },
      { id_laboratorio: 3, nombre: 'Laboratorio de Física', ubicacion: 'Edificio C' }
    ];

    // Contadores para IDs automáticos
    this.nextReactivoId = 4;
    this.nextPedidoId = 1;
    this.nextExperimentoId = 3;
    this.nextPruebaId = 1;

    console.log('BASE DE DATOS EN MEMORIA INICIALIZADA (Sin MySQL)');
  }

  // Helper para simular delay de BD (opcional)
  async _delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========== MÉTODOS CRUD PARA REACTIVOS (Insumos) ==========

  async createReactivo(reactivoData) {
    await this._delay();
    const newReactivo = {
      id: this.nextReactivoId++,
      nombre: reactivoData.nombre,
      descripcion: reactivoData.descripcion,
      precio: parseFloat(reactivoData.precio),
      stock: parseInt(reactivoData.stock),
      fecha_creacion: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.reactivos.push(newReactivo);
    return newReactivo;
  }

  async getAllReactivos() {
    await this._delay();
    return [...this.reactivos].sort((a, b) => b.id - a.id); // Orden DESC
  }

  async getReactivoById(id) {
    await this._delay();
    const reactivo = this.reactivos.find(r => r.id === parseInt(id));
    if (!reactivo) throw new Error('Reactivo no encontrado');
    return reactivo;
  }

  async updateReactivo(id, reactivoData) {
    await this._delay();
    const index = this.reactivos.findIndex(r => r.id === parseInt(id));
    if (index === -1) throw new Error('Reactivo no encontrado');

    this.reactivos[index] = {
      ...this.reactivos[index],
      nombre: reactivoData.nombre,
      descripcion: reactivoData.descripcion,
      precio: parseFloat(reactivoData.precio),
      stock: parseInt(reactivoData.stock)
    };
    return this.reactivos[index];
  }

  async deleteReactivo(id) {
    await this._delay();
    const index = this.reactivos.findIndex(r => r.id === parseInt(id));
    if (index === -1) throw new Error('Reactivo no encontrado');

    const deleted = this.reactivos.splice(index, 1)[0];
    return deleted;
  }

  // ========== MÉTODOS LEGACY (Alias para compatibilidad) ==========
  // Redirigen a los métodos de Reactivos para evitar errores "Productos no existe"

  async createProducto(data) { return this.createReactivo(data); }
  async getAllProductos() { return this.getAllReactivos(); }
  async getProductoById(id) { return this.getReactivoById(id); }
  async updateProducto(id, data) { return this.updateReactivo(id, data); }
  async deleteProducto(id) { return this.deleteReactivo(id); }


  // ========== MÉTODOS CRUD PARA PEDIDOS (Órdenes) ==========

  async createPedido(pedidoData) {
    await this._delay();
    // Verificar producto existe
    await this.getReactivoById(pedidoData.producto_id);

    const newPedido = {
      id: this.nextPedidoId++,
      producto_id: parseInt(pedidoData.producto_id),
      cantidad: parseInt(pedidoData.cantidad),
      fecha_pedido: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.pedidos.push(newPedido);
    return newPedido;
  }

  async getAllPedidos() {
    await this._delay();
    return [...this.pedidos].sort((a, b) => b.id - a.id);
  }

  async getUltimosPedidos() {
    await this._delay();
    // Ordenar por fecha DESC, y luego ID DESC
    return [...this.pedidos]
      .sort((a, b) => {
        if (b.fecha_pedido !== a.fecha_pedido) {
          return new Date(b.fecha_pedido) - new Date(a.fecha_pedido);
        }
        return b.id - a.id;
      })
      .slice(0, 5);
  }

  async getPedidosByDateRange(inicio, fin) {
    await this._delay();
    const start = new Date(inicio);
    const end = new Date(fin);
    // Ajustar fin al final del día
    end.setHours(23, 59, 59, 999);

    return this.pedidos.filter(p => {
      const pDate = new Date(p.fecha_pedido);
      return pDate >= start && pDate <= end;
    }).sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido));
  }

  async getPedidoById(id) {
    await this._delay();
    const pedido = this.pedidos.find(p => p.id === parseInt(id));
    if (!pedido) throw new Error('Pedido no encontrado');
    return pedido;
  }

  async updatePedido(id, pedidoData) {
    await this._delay();
    const index = this.pedidos.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Pedido no encontrado');

    // Verificar producto
    await this.getReactivoById(pedidoData.producto_id);

    this.pedidos[index] = {
      ...this.pedidos[index],
      producto_id: parseInt(pedidoData.producto_id),
      cantidad: parseInt(pedidoData.cantidad)
    };
    return this.pedidos[index];
  }

  async deletePedidoProducto(pedidoId, productoId) {
    await this._delay();
    const index = this.pedidos.findIndex(p =>
      p.id === parseInt(pedidoId) && p.producto_id === parseInt(productoId)
    );
    if (index === -1) throw new Error('Relación pedido-producto no encontrada');

    const deleted = this.pedidos.splice(index, 1)[0];
    return { id: deleted.id, producto_id: deleted.producto_id };
  }


  // ========== MÉTODOS DE USUARIOS COMPLETO (Soporte Auth + CRUD) ==========

  // Busca usuario por username (Login)
  async getUsuarioByUsername(username) {
    await this._delay();
    const user = this.users.find(u => u.username === username);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  // Busca usuario por email (Registro)
  async getUsuarioByEmail(email) {
    await this._delay();
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  // Busca usuario por ID (Profile/Edit)
  async getUsuarioById(id) {
    await this._delay();
    const user = this.users.find(u => u.id === parseInt(id));
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  // Crear usuario (Registro/Admin)
  async createUsuario(userData) {
    await this._delay();
    const newUser = {
      id: this.nextUserId++,
      username: userData.username,
      email: userData.email,
      password_hash: userData.password_hash,
      role: userData.role || 'user',
      activo: 1, // Por defecto activo
      created_at: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Obtener todos los usuarios (Admin List)
  async getAllUsuarios() {
    await this._delay();
    // Clonar para evitar mutaciones externas directas
    return this.users.map(u => ({ ...u }));
  }

  // Actualizar usuario (Admin Edit)
  async updateUsuario(id, userData) {
    await this._delay();
    const index = this.users.findIndex(u => u.id === parseInt(id));
    if (index === -1) throw new Error('Usuario no encontrado');

    // Mantener datos existentes si no se envían nuevos
    const currentUser = this.users[index];

    this.users[index] = {
      ...currentUser,
      username: userData.username !== undefined ? userData.username : currentUser.username,
      email: userData.email !== undefined ? userData.email : currentUser.email,
      role: userData.role !== undefined ? userData.role : currentUser.role,
      activo: userData.activo !== undefined ? userData.activo : currentUser.activo,
      password_hash: userData.password_hash !== undefined ? userData.password_hash : currentUser.password_hash
    };

    return this.users[index];
  }

  // Eliminar usuario (Admin Delete / Desactivar)
  async deleteUsuario(id) {
    await this._delay();
    const index = this.users.findIndex(u => u.id === parseInt(id));
    if (index === -1) throw new Error('Usuario no encontrado');

    const deleted = this.users.splice(index, 1)[0];
    return deleted;
  }

  // Métodos Legacy
  async getUserByUsername(u) { return this.getUsuarioByUsername(u); }
  async getUserById(id) { return this.getUsuarioById(id); }


  // ========== MÉTODOS CRUD PARA EXPERIMENTOS (Examenes) ==========

  async getAllExperimentos() {
    await this._delay();
    return [...this.experimentos].sort((a, b) => b.id - a.id);
  }

  async getExperimentoById(id) {
    await this._delay();
    const exp = this.experimentos.find(e => e.id === parseInt(id));
    if (!exp) throw new Error('Experimento no encontrado');
    return exp;
  }

  async createExperimento(data) {
    await this._delay();
    const newExp = {
      id: this.nextExperimentoId++,
      nombre: data.nombre,
      fecha_creacion: parseInt(data.fecha_creacion),
      duracion_estimada: parseInt(data.duracion_estimada)
    };
    this.experimentos.push(newExp);
    return newExp;
  }

  async updateExperimento(id, data) {
    await this._delay();
    const index = this.experimentos.findIndex(e => e.id === parseInt(id));
    if (index === -1) throw new Error('Experimento no encontrado');

    this.experimentos[index] = {
      ...this.experimentos[index],
      nombre: data.nombre,
      fecha_creacion: parseInt(data.fecha_creacion),
      duracion_estimada: parseInt(data.duracion_estimada)
    };
    return this.experimentos[index];
  }

  async deleteExperimento(id) {
    await this._delay();
    const index = this.experimentos.findIndex(e => e.id === parseInt(id));
    if (index === -1) throw new Error('Experimento no encontrado');

    const deleted = this.experimentos.splice(index, 1)[0];
    return deleted;
  }


  // ========== MÉTODOS CRUD PARA PRUEBAS (Citas) ==========

  async getAllPruebas() {
    await this._delay();
    return [...this.pruebas].sort((a, b) => b.id_prueba - a.id_prueba); // Asumiendo id_prueba o id
  }

  async getPruebaById(id) {
    await this._delay();
    const prueba = this.pruebas.find(p => p.id === parseInt(id));
    if (!prueba) throw new Error('Prueba no encontrada');
    return prueba;
  }

  async createPrueba(data) {
    await this._delay();
    // Validar FKs
    if (!this.experimentos.find(e => e.id === parseInt(data.id_experimento))) throw new Error('Experimento no encontrado');
    if (!this.laboratorios.find(l => l.id_laboratorio === parseInt(data.id_laboratorio))) throw new Error('Laboratorio no encontrado');

    const newPrueba = {
      id: this.nextPruebaId++,
      id_experimento: parseInt(data.id_experimento),
      id_laboratorio: parseInt(data.id_laboratorio),
      fecha_hora_inicio: data.fecha_hora_inicio
    };
    this.pruebas.push(newPrueba);
    return newPrueba;
  }

  async updatePrueba(id, data) {
    await this._delay();
    const index = this.pruebas.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Prueba no encontrada');

    // Validar FKs
    if (!this.experimentos.find(e => e.id === parseInt(data.id_experimento))) throw new Error('Experimento no encontrado');
    if (!this.laboratorios.find(l => l.id_laboratorio === parseInt(data.id_laboratorio))) throw new Error('Laboratorio no encontrado');

    this.pruebas[index] = {
      ...this.pruebas[index],
      id_experimento: parseInt(data.id_experimento),
      id_laboratorio: parseInt(data.id_laboratorio),
      fecha_hora_inicio: data.fecha_hora_inicio
    };
    return this.pruebas[index];
  }

  async deletePrueba(id) {
    await this._delay();
    const index = this.pruebas.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Prueba no encontrada');

    const deleted = this.pruebas.splice(index, 1)[0];
    return deleted;
  }


  // ========== MÉTODOS PARA LABORATORIOS ==========

  async getAllLaboratorios() {
    await this._delay();
    return [...this.laboratorios];
  }

}

module.exports = new DBService();