-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `laboratorio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_experimentos`
--

CREATE TABLE `categorias_experimentos` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias_experimentos`
--

INSERT INTO `categorias_experimentos` (`id_categoria`, `nombre`) VALUES
(1, 'Química'),
(2, 'Biología'),
(3, 'Física'),
(4, 'Microbiología'),
(5, 'Análisis Clínicos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pruebas`
--

CREATE TABLE `pruebas` (
  `id_prueba` int(11) NOT NULL,
  `id_experimento` int(11) DEFAULT NULL,
  `id_laboratorio` int(11) DEFAULT NULL,
  `fecha_hora_inicio` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pruebas`
--

INSERT INTO `pruebas` (`id_prueba`, `id_experimento`, `id_laboratorio`, `fecha_hora_inicio`) VALUES
(1, 1, 1, '2023-10-01 09:00:00'),
(2, 1, 2, '2023-10-02 10:00:00'),
(3, 2, 3, '2023-10-03 11:30:00'),
(4, 3, 4, '2023-10-04 08:00:00'),
(5, 4, 1, '2023-10-05 14:00:00'),
(6, 5, 2, '2023-10-06 08:00:00'),
(7, 6, 3, '2023-10-07 09:00:00'),
(8, 7, 4, '2023-10-08 10:30:00'),
(9, 8, 1, '2023-10-09 13:00:00'),
(10, 1, 3, '2023-10-10 09:00:00'),
(11, 2, 4, '2023-10-11 10:30:00'),
(12, 1, 2, '2025-08-14 09:52:00'),
(13, 1, 1, '2025-08-04 08:27:00'),
(14, 2, 2, '2025-08-15 10:29:00'),
(15, 2, 2, '2025-08-17 11:37:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id_metodo`, `nombre`) VALUES
(1, 'Transferencia Bancaria'),
(2, 'Tarjeta de Crédito'),
(3, 'Efectivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `reactivo_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha_solicitud` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id`, `reactivo_id`, `cantidad`, `fecha_solicitud`) VALUES
(1, 1, 2, '2025-10-22'),
(2, 2, 1, '2025-10-22'),
(3, 3, 3, '2025-10-22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experimentos`
--

CREATE TABLE `experimentos` (
  `id_experimento` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_creacion` int(11) DEFAULT NULL,
  `duracion_estimada` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `experimentos`
--

INSERT INTO `experimentos` (`id_experimento`, `nombre`, `fecha_creacion`, `duracion_estimada`) VALUES
(1, 'Análisis de pH en Soluciones', 2019, 120),
(2, 'Cultivo de Bacterias', 2014, 180),
(3, 'Medición de Densidad', 1994, 90),
(4, 'Prueba de Toxicidad', 2016, 150),
(5, 'Análisis de ADN', 1993, 240),
(6, 'Cromatografía Líquida', 2010, 180),
(7, 'Espectrofotometría', 1999, 120),
(8, 'Análisis de Proteínas', 1994, 150),
(12, 'Microscopia Electrónica', 2012, 200);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experimentos_categorias`
--

CREATE TABLE `experimentos_categorias` (
  `id_experimento` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `experimentos_categorias`
--

INSERT INTO `experimentos_categorias` (`id_experimento`, `id_categoria`) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 3),
(4, 1),
(4, 4),
(5, 2),
(5, 5),
(6, 1),
(6, 2),
(7, 1),
(7, 2),
(8, 3),
(8, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reactivos`
--

CREATE TABLE `reactivos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `fecha_creacion` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reactivos`
--

INSERT INTO `reactivos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `fecha_creacion`) VALUES
(1, 'Ácido Clorhídrico 1L', 'Ácido clorhídrico concentrado para análisis', 15.50, 100, '2025-10-22'),
(2, 'Placas Petri (Pack 50)', 'Placas de cultivo estériles', 25.00, 150, '2025-10-22'),
(3, 'Pipetas Graduadas 10ml', 'Set de pipetas graduadas de vidrio', 18.00, 80, '2025-10-22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `laboratorios`
--

CREATE TABLE `laboratorios` (
  `id_laboratorio` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `capacidad_personas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `laboratorios`
--

INSERT INTO `laboratorios` (`id_laboratorio`, `nombre`, `capacidad_personas`) VALUES
(1, 'Laboratorio de Química', 20),
(2, 'Laboratorio de Biología', 15),
(3, 'Laboratorio de Física', 18),
(4, 'Laboratorio de Microbiología', 12),
(5, 'Laboratorio 2', 10),
(6, 'Laboratorio 3', 10),
(7, 'Laboratorio 4', 22),
(8, 'Laboratorio 5', 21);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `id_ticket` int(11) NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_prueba` int(11) DEFAULT NULL,
  `asiento` varchar(10) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tickets`
--

INSERT INTO `tickets` (`id_ticket`, `id_venta`, `id_prueba`, `asiento`, `precio`) VALUES
(1, 1, 1, 'A1', 12.50),
(2, 1, 1, 'A2', 12.50),
(3, 1, 1, 'A3', 12.50),
(4, 1, 1, 'A4', 12.50),
(5, 2, 2, 'B1', 12.50),
(6, 2, 2, 'B2', 12.50),
(7, 2, 2, 'B3', 12.50),
(8, 3, 3, 'C1', 12.50),
(9, 3, 3, 'C2', 12.50),
(10, 4, 4, 'D1', 12.50),
(11, 5, 5, 'E1', 12.50),
(12, 5, 5, 'E2', 12.50),
(13, 5, 5, 'E3', 12.50),
(14, 5, 5, 'E4', 12.50),
(15, 5, 5, 'E5', 12.50),
(16, 5, 5, 'E6', 12.50),
(17, 6, 6, 'F1', 12.50),
(18, 6, 6, 'F2', 12.50),
(19, 6, 6, 'F3', 12.50),
(20, 6, 6, 'F4', 12.50),
(21, 7, 7, 'G1', 12.50),
(22, 7, 7, 'G2', 12.50),
(23, 7, 7, 'G3', 12.50),
(24, 7, 7, 'G4', 12.50),
(25, 7, 7, 'G5', 12.50),
(26, 8, 8, 'H1', 12.50),
(27, 8, 8, 'H2', 12.50),
(28, 8, 8, 'H3', 12.50),
(29, 9, 9, 'I1', 12.50),
(30, 9, 9, 'I2', 12.50),
(31, 10, 10, 'J1', 12.50),
(32, 10, 10, 'J2', 12.50),
(33, 10, 10, 'J3', 12.50),
(34, 10, 10, 'J4', 12.50),
(35, 10, 10, 'J5', 12.50),
(36, 10, 10, 'J6', 12.50),
(37, 10, 10, 'J7', 12.50),
(38, 10, 10, 'J8', 12.50),
(39, 11, 11, 'K1', 12.50),
(40, 11, 11, 'K2', 12.50),
(41, 11, 11, 'K3', 12.50),
(42, 11, 11, 'K4', 12.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user','guest') NOT NULL DEFAULT 'user',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'admin', 'admin@laboratorio.com', '$2b$10$IeyDE0DtGmqpSFl8r25.KesEvsH/C9OcxDOC90MzMfref6oykzeNq', 'admin', 1, '2025-11-12 14:08:40', '2025-11-12 14:08:40'),
(2, 'usuario1', 'usuario1@laboratorio.com', '$2b$10$IeyDE0DtGmqpSFl8r25.KesEvsH/C9OcxDOC90MzMfref6oykzeNq', 'user', 1, '2025-11-12 14:08:40', '2025-11-12 14:08:40'),
(3, 'invitado', 'invitado@laboratorio.com', '$2b$10$IeyDE0DtGmqpSFl8r25.KesEvsH/C9OcxDOC90MzMfref6oykzeNq', 'guest', 1, '2025-11-12 14:08:40', '2025-11-12 14:08:40'),
(4, 'testuser', 'test@example.com', '$2b$10$bYbhnqHFTw.45hgfeKj.luxa7Q/bDS2MJs9k9kUWUb7mV2qQcqBpe', 'user', 1, '2025-11-12 14:57:04', '2025-11-12 14:57:04'),
(5, 'prueba', 'prueba@gmail.com', '$2b$10$R136BsMPSb7opRZd9MzPfuZbR.5HaPpMY9ATQQP.OBjlcOi2aHAGa', 'user', 0, '2025-11-12 14:58:08', '2025-11-12 16:03:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_metodo` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `id_metodo`, `fecha`, `total`) VALUES
(1, 1, '2023-10-01 09:50:00', 50.00),
(2, 2, '2023-10-02 10:45:00', 37.50),
(3, 3, '2023-10-03 11:20:00', 25.00),
(4, 1, '2023-10-04 08:50:00', 12.50),
(5, 2, '2023-10-05 14:50:00', 75.00),
(6, 3, '2023-10-06 08:45:00', 50.00),
(7, 1, '2023-10-07 09:50:00', 62.50),
(8, 2, '2023-10-08 10:20:00', 37.50),
(9, 3, '2023-10-09 13:50:00', 25.00),
(10, 1, '2023-10-10 09:45:00', 100.00),
(11, 2, '2023-10-11 10:20:00', 50.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_experimentos`
--
ALTER TABLE `categorias_experimentos`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `pruebas`
--
ALTER TABLE `pruebas`
  ADD PRIMARY KEY (`id_prueba`),
  ADD KEY `id_experimento` (`id_experimento`),
  ADD KEY `id_laboratorio` (`id_laboratorio`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reactivo_id` (`reactivo_id`);

--
-- Indices de la tabla `experimentos`
--
ALTER TABLE `experimentos`
  ADD PRIMARY KEY (`id_experimento`);

--
-- Indices de la tabla `experimentos_categorias`
--
ALTER TABLE `experimentos_categorias`
  ADD PRIMARY KEY (`id_experimento`,`id_categoria`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `reactivos`
--
ALTER TABLE `reactivos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `laboratorios`
--
ALTER TABLE `laboratorios`
  ADD PRIMARY KEY (`id_laboratorio`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_prueba` (`id_prueba`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_metodo` (`id_metodo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_experimentos`
--
ALTER TABLE `categorias_experimentos`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pruebas`
--
ALTER TABLE `pruebas`
  MODIFY `id_prueba` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `experimentos`
--
ALTER TABLE `experimentos`
  MODIFY `id_experimento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `reactivos`
--
ALTER TABLE `reactivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `laboratorios`
--
ALTER TABLE `laboratorios`
  MODIFY `id_laboratorio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id_ticket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pruebas`
--
ALTER TABLE `pruebas`
  ADD CONSTRAINT `pruebas_ibfk_1` FOREIGN KEY (`id_experimento`) REFERENCES `experimentos` (`id_experimento`),
  ADD CONSTRAINT `pruebas_ibfk_2` FOREIGN KEY (`id_laboratorio`) REFERENCES `laboratorios` (`id_laboratorio`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`reactivo_id`) REFERENCES `reactivos` (`id`);

--
-- Filtros para la tabla `experimentos_categorias`
--
ALTER TABLE `experimentos_categorias`
  ADD CONSTRAINT `experimentos_categorias_ibfk_1` FOREIGN KEY (`id_experimento`) REFERENCES `experimentos` (`id_experimento`) ON DELETE CASCADE,
  ADD CONSTRAINT `experimentos_categorias_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_experimentos` (`id_categoria`);

--
-- Filtros para la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_prueba`) REFERENCES `pruebas` (`id_prueba`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_metodo`) REFERENCES `metodos_pago` (`id_metodo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
