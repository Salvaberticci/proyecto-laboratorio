const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('Conectado a la base de datos.');

        const createQuery = `
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        fecha_pedido DATE DEFAULT NULL,
        FOREIGN KEY (producto_id) REFERENCES reactivos(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;

        await connection.execute(createQuery);
        console.log('Tabla "pedidos" creada exitosamente.');

        await connection.end();
    } catch (error) {
        console.error('Error al crear la tabla:', error);
        process.exit(1);
    }
}

createTable();
