USE imaqtest;

INSERT INTO Roles (nombre) VALUES ('ADMIN');
INSERT INTO Roles (nombre) VALUES ('MANAGER');

INSERT INTO Usuarios (usuario, password, email, nombre, apellido, idRol, fechaAlta) VALUES
('manyo', '$argon2id$v=19$m=65536,t=3,p=4$G0v9hCZRdKcR/p46t60ygQ$B2xor0W9i46DkYA8ydbDkVUNvvIW0Ev7npYbTMVHlH8',
'manyo@imaq.com', 'Agustin', 'Manyo', 1, NOW());

INSERT INTO TiposProducto (nombre) VALUES ('Equipo Usado');
INSERT INTO TiposProducto (nombre) VALUES ('Reparaciones y recambios');
INSERT INTO TiposProducto (nombre) VALUES ('Repuestos nuevos');
INSERT INTO TiposProducto (nombre) VALUES ('Repuestos usados');
INSERT INTO TiposProducto (nombre) VALUES ('Otros');

INSERT INTO TiposMaquina (nombre) VALUE ('Autoelevador combustion');
INSERT INTO TiposMaquina (nombre) VALUE ('Autoelevador electrico');
INSERT INTO TiposMaquina (nombre) VALUE ('Apiladora');
INSERT INTO TiposMaquina (nombre) VALUE ('Transportadora de carga');
INSERT INTO TiposMaquina (nombre) VALUE ('Reflex'); 

INSERT INTO TiposPresupuesto (nombre) VALUE ('ALQUILER');
INSERT INTO TiposPresupuesto (nombre) VALUE ('OFERTA');
INSERT INTO TiposPresupuesto (nombre) VALUE ('REPUESTOS');
INSERT INTO TiposPresupuesto (nombre) VALUE ('SERVICIO');

INSERT INTO TiposSolicitud (nombre) VALUE ('ALQUILER');
INSERT INTO TiposSolicitud (nombre) VALUE ('OFERTA');
INSERT INTO TiposSolicitud (nombre) VALUE ('REPUESTOS');
INSERT INTO TiposSolicitud (nombre) VALUE ('SERVICIO');

INSERT INTO TiposServicio (nombre) VALUE ('CORRECTIVO');
INSERT INTO TiposServicio (nombre) VALUE ('PREVENTIVO');

INSERT INTO EstadosSolicitud (nombre) VALUE ('NUEVA');
INSERT INTO EstadosSolicitud (nombre) VALUE ('PRESUPUESTADA');
INSERT INTO EstadosSolicitud (nombre) VALUE ('PRESUPUESTO ACEPTADO');
INSERT INTO EstadosSolicitud (nombre) VALUE ('PRESUPUESTO RECHAZADO');
INSERT INTO EstadosSolicitud (nombre) VALUE ('EN PROGRESO');
INSERT INTO EstadosSolicitud (nombre) VALUE ('COMPLETADA');
INSERT INTO EstadosSolicitud (nombre) VALUE ('CANCELADA');

call spNuevoProveedor('30234280907', 'Autoelevadores S.A.', 'Juan García', 'Av. Colón', 1080, 
'Muy buenos precios.', 'juangarcia83@gmail.com', '35138912045');
call spNuevoProveedor('33817062931', 'LiftMax Componentes', 'Mariano Rodríguez', 'San Martín', 2265, 
'Excelente variedad de componentes disponibles.', 'mrodriguez_22@hotmail.com', '35146738192');
call spNuevoProveedor('30157438292', 'Repuestos Alta Gracia', 'Santiago López', 'Av. Hipólito Yrigoyen', 1463, 
'Entrega rápida y eficiente de repuestos.', 'santiagolopez@gmail.com', '35154159387');
call spNuevoProveedor('34492607833', 'Repuestos y Accesorios MaquiPro', 'Lucía Fernández', 'Buenos Aires', 160, 
'Muy buena atención.', 'luciaf97@hotmail.com', '35167264059');
call spNuevoProveedor('30368509427', 'Makima S.A.', 'Martín González', 'Av. Vélez Sársfield', 2884, 
'', 'martingonzalez_22@gmail.com', '35155421763');
call spNuevoProveedor('33205738498', 'Innovia Repuestos', 'Valentina Martínez', 'Rivadavia', 1232, 
'', 'vmartinez@hotmail.com', '35143895674');
call spNuevoProveedor('30841906376', 'Distribuidora Premium', 'Facundo Morales', 'Pasaje Sucre', 335, 
'', 'facumorales@gmail.com', '35162079168');
call spNuevoProveedor('34632175894', 'Proveedor Andino', 'Camilo Silva', 'Av. Castro Barros', 3200, 
'Llamar solo por la mañana', 'csilva76@hotmail.com', '35146582431');
call spNuevoProveedor('33743290153', 'Piezas360', 'Agustín Pérez', 'General Paz', 720, 
'Gran disponibilidad de repuestos.', 'agustinperez@gmail.com', '35151746398');
call spNuevoProveedor('30926518741', 'Repuestos Córdoba S.A', 'Juan Romero', 'Pasaje Belgrano', 200, 
'Disponibles de lunes a miercoles.', 'jmromero@hotmail.com', '35139324865');

call spEliminarProveedor(3);

call spNuevoProducto(3, 'Batería PowerBoost', 'Batería de alto rendimiento para autoelevadores eléctricos.', 'BTEL-PB001', 15000.0);
call spNuevoProducto(4, 'Controlador SmartDrive', 'Controlador electrónico avanzado para autoelevadores eléctricos.', 'CTEL-SD002', 8500.0);
call spNuevoProducto(4, 'Motor T-2', 'Motor de tracción potente y eficiente para autoelevadores eléctricos.', 'MTEL-DM001', 12700.0);

call spNuevoProducto(3, 'Filtro de aire CF', 'Filtro de aire de alta eficiencia para autoelevadores a combustión.', 'AFC-CLF001', 1800);
call spNuevoProducto(4, 'Bujía de Ignición', 'Bujía de encendido de alto rendimiento para autoelevadores a combustión.', 'ACC-IGN002', 600.0);
call spNuevoProducto(3, 'Correa PowerDrive', 'Correa de transmisión duradera para autoelevadores a combustión.', 'BTC-PDV001', 1200.0);

call spNuevoProducto(1, 'Apiladora MaxLoad 2.0', 'Apiladora eléctrica de alta capacidad con elevación de hasta 2,000 kg. Ideal para el manejo eficiente de cargas pesadas en almacenes y depósitos.', 'API-MX20', 150000.0);
call spNuevoProducto(2, 'Apiladora Compacta 500', 'Apiladora compacta y versátil con capacidad de carga de hasta 500 kg. Perfecta para operaciones de apilamiento y transporte en espacios reducidos.', 'API-CMP500', 75000.0);

call spNuevoProducto(1, 'Transportadora HeavyHauler', 'Transportadora de carga robusta y resistente, diseñada para transportar cargas pesadas en entornos industriales. Capacidad de carga de hasta 10 toneladas.', 'TRC-HH10T', 350000.0);
call spNuevoProducto(5, 'Transportadora FlexiCargo', 'Transportadora de carga versátil y ajustable, ideal para el transporte de cargas de diferentes tamaños y formas en almacenes y centros de distribución. Capacidad de carga de hasta 5 toneladas.', 'TRC-FC5T', 200000.0);

call spEliminarProducto(2);

CALL spNuevaMaquina(1, 'Clark', 'C25L', 'C000003', 4000, 2500);
CALL spNuevaMaquina(1, 'Caterpillar', 'GC35K', 'CAT00005', 5000, 2800);
CALL spNuevaMaquina(1, 'Yale', 'GLC050', 'Y000007', 4800, 2600);

CALL spNuevaMaquina(2, 'Toyota', '8FBE15', 'E000001', 4500, 1500);
CALL spNuevaMaquina(2, 'Clark', 'TMX15', 'C000003', 4000, 1600);
CALL spNuevaMaquina(2, 'Mitsubishi', 'FB16NT', 'M000004', 4200, 1800);

CALL spNuevaMaquina(3, 'Linde', 'L10AS', 'L000007', 4800, 2200);
CALL spNuevaMaquina(3, 'BT', 'SWE 080 L', 'BT000008', 4100, 2000);
CALL spNuevaMaquina(3, 'Cesab', 'P113', 'C000009', 4300, 1800);

CALL spNuevaMaquina(4, 'Jungheinrich', 'DFG 425', 'J000004', 6500, 5500);
CALL spNuevaMaquina(4, 'Crown', 'RC5500', 'CR00005', 6000, 7500);
CALL spNuevaMaquina(4, 'Yale', 'GLP80VX', 'Y000006', 5800, 8000);

CALL spNuevaMaquina(5, 'Toyota', '8FBMT18', 'T000001', 4000, 1800);
CALL spNuevaMaquina(5, 'BT', 'RR B2', 'B000002', 3500, 2000);
CALL spNuevaMaquina(5, 'Reflex', 'R70', 'R000003', 3800, 1900);

--
-- Dumping data for table `ofertas`
--

LOCK TABLES `ofertas` WRITE;
/*!40000 ALTER TABLE `ofertas` DISABLE KEYS */;
INSERT INTO `ofertas` VALUES (1,'¡Imperdible! Transportadora Heavy Hauler + Batería de regalo','¡Oferta imperdible! Transportadora HeavyHauler - TRC-HH10T + Batería PowerBoost - BTEL-PB001\n¡Potencia tus operaciones de transporte con este combo perfecto!',340000.00,'2023-01-01 00:00:00','2023-12-31 00:00:00',_binary '\0'),(2,'Repuestos para tu vehículo: Bujía de Ignición y Filtro de aire','Potencia el rendimiento de tu vehículo con estos repuestos de calidad. La Bujía de Ignición - ACC-IGN002 brinda una chispa confiable, mientras que el Filtro de aire CF - AFC-CLF001 garantiza un suministro limpio de aire.',2300.00,'2023-01-01 00:00:00','2023-12-31 00:00:00',_binary '\0'),(3,'Combo de repuestos','¡Repuestos de calidad para tu vehículo! Motor T-2 usado - MTEL-DM001 y Correa PowerDrive nueva - BTC-PDV001. Potencia y rendimiento garantizados. ¡Aprovecha esta oferta y mejora tu vehículo hoy mismo!',13000.00,'2023-01-01 00:00:00','2023-12-31 00:00:00',_binary '\0');
/*!40000 ALTER TABLE `ofertas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `detallesoferta`
--

LOCK TABLES `detallesoferta` WRITE;
/*!40000 ALTER TABLE `detallesoferta` DISABLE KEYS */;
INSERT INTO `detallesoferta` VALUES (1,9,1,1),(2,1,1,1),(3,5,2,1),(4,4,2,1),(5,3,3,1),(6,6,3,1);
/*!40000 ALTER TABLE `detallesoferta` ENABLE KEYS */;
UNLOCK TABLES;
