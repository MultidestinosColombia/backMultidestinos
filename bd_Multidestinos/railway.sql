/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `correo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nit` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rnt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lmc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `demas` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `primerDeposito` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `segundoDeposito` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zona` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `asesor` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipoBase` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `porcentajeIva` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rteFuente` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rteIca` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cotizacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idCotizacion` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `salida` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `destino` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nombrePrograma` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `plan` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hotel` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `totalAdultos` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `totalNinos` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `totalPasajeros` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioBrutoTotal` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `valorDescuento` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ivaValor` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rteFuente` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rteIca` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `totalComision` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `totalPrecioCliente` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `combus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tasa` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `iva` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ivaTa` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otros` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `suplemento` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioTrans` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `noches` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `totalPrecio` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `notas` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cliente` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clientePorcentaje` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nochesAdicionales` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreadorCotizacion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fechaCreacion` date DEFAULT NULL,
  `aerolineaIda` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vueloIda` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `horaLlegadaIda` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `horaSalidaIda` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `claseIda` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fechaInicio` datetime DEFAULT NULL,
  `aerolineaVuelta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vueloVuelta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `horaLlegadaVuelta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `horaSalidaVuelta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `claseVuelta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fechaFin` datetime DEFAULT NULL,
  `correo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCotizacion` (`idCotizacion`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `habitacionescotizacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idCotizacion` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `adultos` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `niños` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `acomodacion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tipoHabitacion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `precioFlayerAdulto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioFlayerNino` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioHabitacionNino` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioHabitacionAdulto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioHabitacionTotal` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioComisionableAdulto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precioComisionableNino` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `valorDescuentoHabitacionNino` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `valorDescuentoHabitacionAdulto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `valorDescuentoCliente` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descuento` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TotalAcomodacionAdulto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TotalAcomodacionNino` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TotalAcomodacion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edadesAdultos` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edadNino` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `defensaCivil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cormacarena5a11` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cormacarena12a65` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cormacarenaExtranjero` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pqsNaturales5a24` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pqsNaturales25a65` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pqsNaturalesExtranjero` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alcaldiaNacional` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alcaldiaExtranjero` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `extranjero` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idCotizacion` (`idCotizacion`),
  CONSTRAINT `fk_idCotizacion` FOREIGN KEY (`idCotizacion`) REFERENCES `cotizacion` (`idCotizacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `hoteles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pertenece` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `destino` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nombrePrograma` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `hotel` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `plan` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `noches` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tipoHabitacion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sencilla` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `doble` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `triple` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cuadruple` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `niño` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nocheAdicionalsencilla` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nocheAdicionaldoble` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nocheAdicionaltriple` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nocheAdicionalcuadruple` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nocheAdicionalniño` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `incluye` varchar(2555) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `noIncluye` varchar(2555) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ImpuesCañoCristal` (
  `IMPUESTO` varchar(255) DEFAULT NULL,
  `5 a 11 años` varchar(255) DEFAULT NULL,
  `12 a 65 años` varchar(255) DEFAULT NULL,
  `5 a 24 años` varchar(255) DEFAULT NULL,
  `EXTRANJERO` varchar(255) DEFAULT NULL,
  `25 a 65 años` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `planes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pertenece` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `destino` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nombrePrograma` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `hotel` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `plan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `noches` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `baseComisionable` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `baseTiqueta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acomodacion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fechaBloqueo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vigenciaInicio` date DEFAULT NULL,
  `vigenciaFinal` date DEFAULT NULL,
  `incluye` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `noIncluye` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notas` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `secuencia_cotizacion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ultimo_valor` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `secuencia_cotizacion_c` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ultimo_valor` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tiquete` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salida` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pertenece` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `neta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tasas` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `iva` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `transportes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pertenece` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `destino` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nombrePrograma` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `combus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tasa` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `iva` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ivaTa` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otros` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `porcionTerrestreBaja` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `porcionTerrestreAlta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `creadorPor` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fechaCreacion` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreCompleto` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `usuario` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  `rol` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `zona` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `clientes` (`id`, `nombre`, `ciudad`, `correo`, `direccion`, `telefono`, `nit`, `rnt`, `lmc`, `demas`, `primerDeposito`, `segundoDeposito`, `zona`, `asesor`, `tipoBase`, `porcentajeIva`, `rteFuente`, `rteIca`) VALUES
(1, 'ABORDO', NULL, NULL, NULL, NULL, NULL, NULL, '12', '12', 'DEPOSITO', 'PAGO TOTAL', NULL, NULL, 'Descuento', NULL, NULL, NULL);
INSERT INTO `clientes` (`id`, `nombre`, `ciudad`, `correo`, `direccion`, `telefono`, `nit`, `rnt`, `lmc`, `demas`, `primerDeposito`, `segundoDeposito`, `zona`, `asesor`, `tipoBase`, `porcentajeIva`, `rteFuente`, `rteIca`) VALUES
(2, 'AEROCLUB VIAJES Y TURISMO', 'BOGOTA', NULL, 'KR 7 #33-29 ', '2880149', '830141268', NULL, '12', '12', 'DEPOSITO', 'PAGO TOTAL', 'Zona 1', '11', 'Descuento', NULL, NULL, NULL);
INSERT INTO `clientes` (`id`, `nombre`, `ciudad`, `correo`, `direccion`, `telefono`, `nit`, `rnt`, `lmc`, `demas`, `primerDeposito`, `segundoDeposito`, `zona`, `asesor`, `tipoBase`, `porcentajeIva`, `rteFuente`, `rteIca`) VALUES
(14, 'prueba', 'BOGOTA', 'prueba@gmail.com, prueba1@gmail.com, prueba3@gmail.com, prueba4@gmail.com, prueba5@gmail.com', 'cllsda njdsjs', '31032392839', '2121', '2121', '12', '12', '1', '1', 'Zona 1', '11', 'Descuento', NULL, NULL, NULL);





INSERT INTO `hoteles` (`id`, `pertenece`, `destino`, `nombrePrograma`, `hotel`, `plan`, `noches`, `tipoHabitacion`, `sencilla`, `doble`, `triple`, `cuadruple`, `niño`, `nocheAdicionalsencilla`, `nocheAdicionaldoble`, `nocheAdicionaltriple`, `nocheAdicionalcuadruple`, `nocheAdicionalniño`, `incluye`, `noIncluye`) VALUES
(1, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'Playa de Oro', 'PAE', '3 noches', 'Habitación vista a la selva', NULL, '2.519.000', '2.389.000', '2.179.000', '2.039.000', NULL, '339.000', '299.000', '279.000', '239.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL PLAYA DE ORO: ¿En habitaciones con baño privado y terraza con hamaca.¿ • Con vista a la selva: Con ventilador.¿ • Con vista al mar: Con aire acondicionado.', '• Bebidas y licores.¿\n• Imprevistos.¿\n• Propinas.¿\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\n• Servicios no especificados en el plan.¿\n• Gastos por cancelación de vuelos.¿');
INSERT INTO `hoteles` (`id`, `pertenece`, `destino`, `nombrePrograma`, `hotel`, `plan`, `noches`, `tipoHabitacion`, `sencilla`, `doble`, `triple`, `cuadruple`, `niño`, `nocheAdicionalsencilla`, `nocheAdicionaldoble`, `nocheAdicionaltriple`, `nocheAdicionalcuadruple`, `nocheAdicionalniño`, `incluye`, `noIncluye`) VALUES
(2, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'Playa de Oro', 'PAE', '3 noches', 'Habitación vista al mar', NULL, '2.719.000', '2.539.000', '2.449.000', '2.199.000', NULL, '399.000', '349.000', '319.000', '279.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL PLAYA DE ORO: ¿En habitaciones con baño privado y terraza con hamaca.¿ • Con vista a la selva: Con ventilador.¿ • Con vista al mar: Con aire acondicionado.', '• Bebidas y licores.¿\n• Imprevistos.¿\n• Propinas.¿\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\n• Servicios no especificados en el plan.¿\n• Gastos por cancelación de vuelos.¿');
INSERT INTO `hoteles` (`id`, `pertenece`, `destino`, `nombrePrograma`, `hotel`, `plan`, `noches`, `tipoHabitacion`, `sencilla`, `doble`, `triple`, `cuadruple`, `niño`, `nocheAdicionalsencilla`, `nocheAdicionaldoble`, `nocheAdicionaltriple`, `nocheAdicionalcuadruple`, `nocheAdicionalniño`, `incluye`, `noIncluye`) VALUES
(3, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'Playa de Oro', 'PAE', '4 noches', 'Habitación vista a la selva', NULL, '2.859.000', '2.679.000', '2.449.000', '2.299.000', NULL, '339.000', '299.000', '279.000', '239.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL PLAYA DE ORO: ¿En habitaciones con baño privado y terraza con hamaca.¿ • Con vista a la selva: Con ventilador.¿ • Con vista al mar: Con aire acondicionado.', '• Bebidas y licores.¿\n• Imprevistos.¿\n• Propinas.¿\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\n• Servicios no especificados en el plan.¿\n• Gastos por cancelación de vuelos.¿');
INSERT INTO `hoteles` (`id`, `pertenece`, `destino`, `nombrePrograma`, `hotel`, `plan`, `noches`, `tipoHabitacion`, `sencilla`, `doble`, `triple`, `cuadruple`, `niño`, `nocheAdicionalsencilla`, `nocheAdicionaldoble`, `nocheAdicionaltriple`, `nocheAdicionalcuadruple`, `nocheAdicionalniño`, `incluye`, `noIncluye`) VALUES
(4, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'Playa de Oro', 'PAE', '4 noches', 'Habitación vista al mar', NULL, '3.119.000', '2.889.000', '2.449.000', '2.199.000', NULL, '399.000', '349.000', '319.000', '279.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL PLAYA DE ORO: ¿En habitaciones con baño privado y terraza con hamaca.¿ • Con vista a la selva: Con ventilador.¿ • Con vista al mar: Con aire acondicionado.', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(5, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'El Almejal Ecolodge', 'PAE', '3 noches', 'Cabaña Familiar', NULL, '2.529.000', '2.129.000', '2.129.000', '1.819.000', NULL, '409.000', '359.000', '359.000', '259.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL EL ALMEJAL: ¿• Cabañas estándar: independientes con baño privado y ventilador; ubicadas en la parte baja del Lodge.¿ •Habitación superior: ubicada en la parte alta del hotel, se deben subir 85 escaleras para llegar, tiene baño a cielo abierto y la ducha cae en forma de cascada. Son con aire acondicionado (Solo para acomodación doble, sujeto a disponibilidad). ', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(6, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'El Almejal Ecolodge', 'PAE', '4 noches', 'Cabaña Familiar', NULL, '2.929.000', '2.479.000', '2.479.000', '2.069.000', NULL, '409.000', '359.000', '359.000', '259.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL EL ALMEJAL: ¿• Cabañas estándar: independientes con baño privado y ventilador; ubicadas en la parte baja del Lodge.¿ •Habitación superior: ubicada en la parte alta del hotel, se deben subir 85 escaleras para llegar, tiene baño a cielo abierto y la ducha cae en forma de cascada. Son con aire acondicionado (Solo para acomodación doble, sujeto a disponibilidad). ', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(7, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'El Almejal Ecolodge', 'PAE', '3 noches', 'Superior(Vista selva)', '3.019.000', '2.569.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL EL ALMEJAL: ¿• Cabañas estándar: independientes con baño privado y ventilador; ubicadas en la parte baja del Lodge.¿ •Habitación superior: ubicada en la parte alta del hotel, se deben subir 85 escaleras para llegar, tiene baño a cielo abierto y la ducha cae en forma de cascada. Son con aire acondicionado (Solo para acomodación doble, sujeto a disponibilidad). ', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(8, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'El Almejal Ecolodge', 'PAE', '4 noches', 'Superior(Vista selva)', '3.699.000', '3.109.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL EL ALMEJAL: ¿• Cabañas estándar: independientes con baño privado y ventilador; ubicadas en la parte baja del Lodge.¿ •Habitación superior: ubicada en la parte alta del hotel, se deben subir 85 escaleras para llegar, tiene baño a cielo abierto y la ducha cae en forma de cascada. Son con aire acondicionado (Solo para acomodación doble, sujeto a disponibilidad). ', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(9, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'El Almejal Ecolodge', 'PAE', '3 noches', 'Superior(Vista mar)', '3.289.000', '2.779.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL EL ALMEJAL: ¿• Cabañas estándar: independientes con baño privado y ventilador; ubicadas en la parte baja del Lodge.¿ •Habitación superior: ubicada en la parte alta del hotel, se deben subir 85 escaleras para llegar, tiene baño a cielo abierto y la ducha cae en forma de cascada. Son con aire acondicionado (Solo para acomodación doble, sujeto a disponibilidad). ', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(10, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'El Almejal Ecolodge', 'PAE', '4 noches', 'Superior(Vista mar)', '4.059.000', '3.389.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL EL ALMEJAL: ¿• Cabañas estándar: independientes con baño privado y ventilador; ubicadas en la parte baja del Lodge.¿ •Habitación superior: ubicada en la parte alta del hotel, se deben subir 85 escaleras para llegar, tiene baño a cielo abierto y la ducha cae en forma de cascada. Son con aire acondicionado (Solo para acomodación doble, sujeto a disponibilidad). ', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(11, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'Playa Alegre Ecolodge', 'PAE', '3 noches', 'Estandar', NULL, '2.429.000', '2.429.000', '2.329.000', '2.159.000', NULL, '339.000', '339.000', '339.000', '289.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL PLAYA ALEGRE:¿ Cabañas independientes con ventilador y mosquitero.', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(12, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'Playa Alegre Ecolodge', 'PAE', '4 noches', 'Estandar', NULL, '2.909.000', '2.909.000', '2.819.000', '2.549.000', NULL, '339.000', '339.000', '339.000', '289.000', '•Tiquete aéreo Bogotá - Bahía Solano - Bogotá (Escala en Medellín ó Quibdó) vía Satena en clase “M”. (Aplica suplemento para otras clases tarifarias).¿•Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Traslado Aeropuerto – Hotel- Aeropuerto en Bahía Solano.¿•Refresco de bienvenida.¿•Alojamiento: ¿- En el HOTEL PLAYA ALEGRE:¿ Cabañas independientes con ventilador y mosquitero.', '• Bebidas y licores.¿\r\n• Imprevistos.¿\r\n• Propinas.¿\r\n• Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿\r\n• Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):¿\r\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  ¿\r\nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.¿\r\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿\r\n• Servicios no especificados en el plan.¿\r\n• Gastos por cancelación de vuelos.¿'),
(13, 'Bogota', 'La Macarena', 'Caño Cristales', 'Casa Real', 'PAE', '2 noches', 'Normal', '2.599.000', '2.369.000', '2.369.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '•Tiquete aéreo en vuelo directo Bogotá - La Macarena- Bogotá vía Satena en clase “M”. Aplica suplemento en otras clases. •Impuestos de tiquete (Tasas, combustible, IVA y tarifa administrativa)¿•Recepción en el aeropuerto y manejo de equipaje¿•Alojamiento de acuerdo a las noches elegidas y hotel seleccionado, con baño privado y ventilador ó aire acondicionado.¿•Alimentación completa (Plan PAE): desayunos, almuerzos (fiambres) y cenas¿•Transportes terrestres y fluviales¿•Guía profesional y asistencia en el destino¿•Excursión a Caño Cristalitos y Mirador ó Caño de Piedra ó Laguna del Silencio ó Río Bajo Lozada; dependiendo de la capacidad de carga y el sendero que asignen las autoridades ambientales.¿•Excursión a Caño Cristales, visitando sus sitios más representativos (Dependiendo de la capacidad de carga y los senderos que asignen las autoridades ambientales).¿•Parrando Llanero (música llanera y mamona)¿•Tarjeta asistencia médica.¿•Piscina y jacuzzi en el hotel.¿•Amanecer o atardecer llanero con desayuno típico y cabalgata.¿•Clases de Joropo', '•Aporte Fondo Municipal de Promoción Turística $ 39.000 para pasajeros nacionales y $ 59.000 para extranjeros. (Este valor se cancela en la agencia junto con el valor del plan). ¿•Impuesto Defensa civil $ 20.000.  (Este valor se cancela en la agencia junto con el valor del plan).¿•Tarjeta de ingreso al Parque Natural a favor de CORMACARENA: (Este valor se cancela a nosotros junto con el valor del plan):¿a.Niños (5-11 años) nacionales o extranjeros, estudiantes con carnet o certificado de matrícula valor: $ 19.385.  ¿b.Adultos nacionales o extranjeros residentes en Colombia valor: $ 40.762.¿c.Adulto extranjero valor: $ 62.140¿•Tarjeta de ingreso al Parque Natural a favor de PARQUES NATURALES DE COLOMBIA: (Este valor se cancela a nosotros junto con el valor del plan):¿a.Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (De 5 a 25 años) valor: $ 22.000.  ¿b.Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 41.000.¿c.Extranjero no residente y no miembro de la CAN valor: $ 62.000¿•Estos impuestos son recaudados en la liquidación del plan.¿Mayores de 65 años no cancelan estos ingresos a favor de Cormacarena y Parques Nacionales Naturales (Deben enviar copia del documento de identidad para soporte ante las autoridades ambientales).¿•Servicios no estipulados en el programa');

INSERT INTO `ImpuesCañoCristal` (`IMPUESTO`, `5 a 11 años`, `12 a 65 años`, `5 a 24 años`, `EXTRANJERO`, `25 a 65 años`) VALUES
('cormacarena', '21584', '44545', NULL, '67906', NULL);
INSERT INTO `ImpuesCañoCristal` (`IMPUESTO`, `5 a 11 años`, `12 a 65 años`, `5 a 24 años`, `EXTRANJERO`, `25 a 65 años`) VALUES
('pqsNaturales', NULL, NULL, '25500', '71000', '46500');
INSERT INTO `ImpuesCañoCristal` (`IMPUESTO`, `5 a 11 años`, `12 a 65 años`, `5 a 24 años`, `EXTRANJERO`, `25 a 65 años`) VALUES
('alcaldia', '39000', '39000', NULL, '59000', NULL);
INSERT INTO `ImpuesCañoCristal` (`IMPUESTO`, `5 a 11 años`, `12 a 65 años`, `5 a 24 años`, `EXTRANJERO`, `25 a 65 años`) VALUES
('defensaCivil', '20000', '20000', NULL, '20000', NULL);

INSERT INTO `planes` (`id`, `pertenece`, `destino`, `nombrePrograma`, `hotel`, `plan`, `noches`, `baseComisionable`, `baseTiqueta`, `acomodacion`, `fechaBloqueo`, `vigenciaInicio`, `vigenciaFinal`, `incluye`, `noIncluye`, `notas`) VALUES
(1, 'Bogota', 'Bahía Solano', 'Temporada Baja', 'Playa de Oro*El Almejal Ecolodge*Playa Alegre Ecolodge*Hotel Kipará', 'PAE', '3 noches*4 noches', '523600', '729000', 'doble*triple*cuadruple', NULL, NULL, NULL, NULL, '-Bebidas y licores.¿-Imprevistos.¿-Propinas.¿- Contribución Pro-Turismo: Adultos nacionales $ 35.000 – Extranjeros $ 45.000. De 11 a 18 años nacionales o extranjeros $ 20.000 y menores de 10 años están exentos.¿-Ingreso a la cascada de Nabugá ($10.000) • Ingreso al Parque Nacional Natural Utría (Cobro de acuerdo con el factor personal):\na.	Pasajero nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 6 años hasta los 25 años) valor: $ 17.000.  \nb.	Adulto nacional o extranjero residente en Colombia o miembro de la CAN (Mayor de 25 años) valor: $ 25.500.\nc.	Extranjero no residente en Colombia ni miembro de la CAN - valor: $ 72.000.¿-Servicios no especificados en el plan.¿-Gastos por cancelación de vuelos.', NULL);
INSERT INTO `planes` (`id`, `pertenece`, `destino`, `nombrePrograma`, `hotel`, `plan`, `noches`, `baseComisionable`, `baseTiqueta`, `acomodacion`, `fechaBloqueo`, `vigenciaInicio`, `vigenciaFinal`, `incluye`, `noIncluye`, `notas`) VALUES
(2, 'Bogota', 'La Macarena', 'Caño Cristales', 'Casa Real*La Fuente*Punto Verde', 'PAE', '2 noches*3 noches*4 noches', '258600', '633500', 'Sencilla*doble*triple', NULL, NULL, NULL, NULL, NULL, NULL);


INSERT INTO `secuencia_cotizacion` (`id`, `ultimo_valor`) VALUES
(1, 0);


INSERT INTO `secuencia_cotizacion_c` (`id`, `ultimo_valor`) VALUES
(1, 0);


INSERT INTO `tiquete` (`id`, `salida`, `pertenece`, `neta`, `tasas`, `iva`, `total`) VALUES
(1, 'Bogotá', 'Bahía Solano', '702200', '26800', NULL, '729000');
INSERT INTO `tiquete` (`id`, `salida`, `pertenece`, `neta`, `tasas`, `iva`, `total`) VALUES
(2, 'Bogotá', 'La Macarena', '680000', '34500', NULL, '633500');


INSERT INTO `transportes` (`id`, `pertenece`, `destino`, `nombrePrograma`, `combus`, `tasa`, `iva`, `ta`, `ivaTa`, `otros`, `total`, `porcionTerrestreBaja`, `porcionTerrestreAlta`, `creadorPor`, `fechaCreacion`) VALUES
(1, 'Bogota', 'BAHÍA SOLANO', NULL, '120000', '28500', NULL, '75100', NULL, '300000', '523600', NULL, NULL, NULL, NULL);
INSERT INTO `transportes` (`id`, `pertenece`, `destino`, `nombrePrograma`, `combus`, `tasa`, `iva`, `ta`, `ivaTa`, `otros`, `total`, `porcionTerrestreBaja`, `porcionTerrestreAlta`, `creadorPor`, `fechaCreacion`) VALUES
(2, 'Bogota', 'BAHÍA SOLANO', NULL, '120000', '28500', NULL, '75100', NULL, '300000', '523600', NULL, NULL, NULL, NULL);
INSERT INTO `transportes` (`id`, `pertenece`, `destino`, `nombrePrograma`, `combus`, `tasa`, `iva`, `ta`, `ivaTa`, `otros`, `total`, `porcionTerrestreBaja`, `porcionTerrestreAlta`, `creadorPor`, `fechaCreacion`) VALUES
(3, 'Bogota', 'La Macarena', NULL, '150000', '33500', NULL, '75100', NULL, NULL, '258600', NULL, NULL, NULL, NULL);

INSERT INTO `usuarios` (`id`, `nombreCompleto`, `usuario`, `contrasena`, `activo`, `rol`, `zona`) VALUES
(1, 'Julian Torres', 'Jtorres', '$2b$10$hl2jEoMDPJFsFFSoSD9dGOfweBy2/ReLc.HKEim.HSQaMhSSz2XHa', 1, 'administrador', NULL);
INSERT INTO `usuarios` (`id`, `nombreCompleto`, `usuario`, `contrasena`, `activo`, `rol`, `zona`) VALUES
(7, 'Alfredo Gallego', 'Agallego', '$2b$10$V2PK34RyTQi28c/Sl0W2COZ7e/GhF61FtvMVNi.0y.gcxeyD6McdS', 1, 'administrador', '');
INSERT INTO `usuarios` (`id`, `nombreCompleto`, `usuario`, `contrasena`, `activo`, `rol`, `zona`) VALUES
(8, 'Alejandra Garzon', 'Agarzon', '$2b$10$JW7q885L7Ob/jya8k0JcJO4A4Qr/k6ltDBR5ExlU3tOhrG3wiiY2C', 1, 'administrador', '');
INSERT INTO `usuarios` (`id`, `nombreCompleto`, `usuario`, `contrasena`, `activo`, `rol`, `zona`) VALUES
(11, 'prueba', '123', '$2b$10$FHWJxD79/5cYobUktPrjYeWt9E.czLNLmgFyCByavLMTDJHBE92Rq', 1, 'Asesor', 'Zona 1'),
(12, 'Angela Zamora', 'Azamora', '$2b$10$Ua3bM640fhwgK5VFcc8ymekoMr9O3vbUESymHJGIiyEyLjblnfRAS', 1, 'Comercial 2', ''),
(13, 'prueba1', 'p1', '$2b$10$AAgMqcDxFXg8HlURlQe.geCVNJrn4rnaxzR5J9ZOTvC478AM.tZDG', 1, 'Comercial 1', '');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;