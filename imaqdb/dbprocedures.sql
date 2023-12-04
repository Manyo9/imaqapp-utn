USE imaqtest;

DELIMITER //

## Usuarios

CREATE PROCEDURE spNuevoUsuarioInterno(
IN pusuario VARCHAR(64),
IN phash CHAR(97),
IN pemail VARCHAR(64),
IN pnombre VARCHAR(64),
IN papellido VARCHAR(64)
)
BEGIN
	DECLARE idGer SMALLINT DEFAULT NULL;
	SELECT idRol into idGer from Roles
    WHERE nombre = 'MANAGER';
	INSERT INTO Usuarios(usuario, password, email, nombre,
    apellido, idRol, fechaAlta, fechaBaja)
    values (pusuario, phash, pemail, pnombre, papellido, idGer, NOW(), null);
END//

CREATE PROCEDURE spListarUsuarios(
    IN deleted BIT
)
BEGIN
    IF deleted = 0 THEN
        SELECT idUsuario, usuario, email, r.nombre as rol,
        u.nombre, apellido, fechaBaja
        FROM Usuarios u
        JOIN Roles r ON u.idRol = r.idRol
        WHERE fechaBaja IS NULL;
    ELSE
        SELECT idUsuario, usuario, email, r.nombre as rol,
        u.nombre, apellido, fechaBaja
        FROM Usuarios u
        JOIN Roles r ON u.idRol = r.idRol;
    END IF;
END//

CREATE PROCEDURE spUsuarioPorID(
	IN pid INT
)
BEGIN
	SELECT idUsuario, usuario, email, r.nombre as rol,
    u.idRol, u.nombre, apellido, fechaAlta, fechaBaja
    FROM Usuarios u JOIN Roles r ON u.idRol = r.idRol
    WHERE idUsuario = pid;
END//

CREATE PROCEDURE spUsuarioPorUsername(
	IN puser VARCHAR(64)
)
BEGIN
	SELECT idUsuario, usuario, email, r.nombre as rol,
    u.idRol, u.nombre, apellido, fechaAlta, fechaBaja
    FROM Usuarios u JOIN Roles r ON u.idRol = r.idRol
    WHERE usuario = puser;
END//

CREATE PROCEDURE spModificarUsuario(
	IN pid INT,
    IN pnombre VARCHAR(64),
    IN papellido VARCHAR(64),
    IN pemail VARCHAR(64)
)
BEGIN
	UPDATE Usuarios
    SET nombre = pnombre, apellido = papellido, email = pemail
    WHERE idUsuario = pid;
END//

CREATE PROCEDURE spTraerHash(
	IN pid INT
)
BEGIN
    SELECT password FROM Usuarios WHERE idUsuario = pid;
END//

CREATE PROCEDURE spTraerHashLogin(
	IN puser VARCHAR(64)
)
BEGIN
    SELECT password FROM Usuarios WHERE usuario = puser;
END//

CREATE PROCEDURE spCambiarContraseña(
	IN pid INT,
    IN newpassword CHAR(97)
)
BEGIN
	UPDATE Usuarios
    SET password = newpassword
    WHERE idUsuario = pid;
END//

CREATE PROCEDURE spDarDeBajaUsuario(
	IN pid INT,
	OUT changed TINYINT
)
BEGIN
	SELECT COUNT(idUsuario) INTO @count FROM Usuarios u where u.idUsuario = pid and u.fechaBaja IS NULL;
    IF (@count = 1) THEN
	BEGIN
		UPDATE usuarios set fechaBaja = NOW() where idUsuario = pid;
		SET changed = 1;
    END;
    ELSE SET changed = 0;
    END IF;
    SELECT changed;
END//

## Productos

CREATE PROCEDURE spNuevoProducto(
	IN pidtp TINYINT,
    IN pnombre VARCHAR(64),
    IN pdescripcion VARCHAR(256),
    IN pcodigoParte VARCHAR(20),
    IN pprecio DECIMAL(12,2)
)
BEGIN
	INSERT INTO ProductosOferta (idTipoProducto, nombre, descripcion, precio, codigoParte, activo)
    VALUES (pidtp, pnombre, pdescripcion, pprecio, pcodigoParte, 1);
END//

CREATE PROCEDURE spListarProductos(
    IN deleted BIT
)
BEGIN
    IF deleted = 1 THEN
        SELECT idProducto, tp.nombre AS tipoProducto, p.nombre, descripcion, precio, codigoParte, activo
        FROM productosoferta p
        JOIN tiposproducto tp ON p.idTipoProducto = tp.idTipo;
    ELSE
        SELECT idProducto, tp.nombre AS tipoProducto, p.nombre, descripcion, precio, codigoParte, activo
        FROM productosoferta p
        JOIN tiposproducto tp ON p.idTipoProducto = tp.idTipo
        WHERE activo = 1;
    END IF;
END//

CREATE PROCEDURE spListarProductosOfertables()
BEGIN
        SELECT idProducto, tp.nombre AS tipoProducto, p.nombre, descripcion, precio, codigoParte, activo
        FROM productosoferta p
        JOIN tiposproducto tp ON p.idTipoProducto = tp.idTipo
        WHERE activo = 1
        AND idProducto NOT IN (
        SELECT DISTINCT do1.idProducto FROM Ofertas o1 JOIN DetallesOferta do1 ON o1.idOferta = do1.idOferta
        WHERE (o1.fechaInicio < NOW() AND o1.fechaFin > NOW()) AND o1.vendida = 0
        );
END//

CREATE PROCEDURE spProductoPorID(
	IN pid INT
)
BEGIN
	SELECT idProducto, idTipoProducto, tp.nombre AS tipoProducto,
    p.nombre, descripcion, precio, codigoParte, activo
    FROM productosoferta p JOIN tiposproducto tp ON p.idTipoProducto = tp.idTipo
    WHERE idProducto = pid;
END//

CREATE PROCEDURE spEditarProducto(
	IN pid INT,
    IN pidtp TINYINT, 
    IN pnombre VARCHAR(64),
    IN pdescripcion VARCHAR(64),
    IN pcodigoParte VARCHAR(20),
    IN pprecio VARCHAR(256),
    IN pactivo BIT
)
BEGIN
	UPDATE ProductosOferta
    SET nombre = pnombre,
    idTipoProducto = pidtp,
    descripcion = pdescripcion,
    codigoParte = pcodigoParte,
    precio = pprecio,
    activo = pactivo
    WHERE idProducto = pid;
END//

CREATE PROCEDURE spEliminarProducto(
	IN pid INT
)
BEGIN
	UPDATE ProductosOferta
    SET activo = 0
    WHERE idProducto = pid;
END//

## Proveedores

CREATE PROCEDURE spNuevoProveedor(
	pcuit CHAR(11),
    prazonSocial VARCHAR(64),
    pnombreContacto VARCHAR(64),
    pcalle VARCHAR(64),
    pnumCalle MEDIUMINT,
    pobservaciones VARCHAR(256),
    pemail VARCHAR(64),
    ptelefono VARCHAR(15)
)
BEGIN
	INSERT INTO Proveedores (cuit, razonSocial, nombreContacto, calle, numCalle, observaciones, email, telefono, activo)
    VALUES (pcuit, prazonSocial, pnombreContacto, pcalle, pnumCalle, pobservaciones, pemail, ptelefono, 1);
END//

CREATE PROCEDURE spListarProveedores(
    IN deleted BIT
)
BEGIN
    IF deleted = 1 THEN
        SELECT idProveedor, cuit, razonSocial, nombreContacto, email, telefono, activo
        FROM Proveedores;
    ELSE
        SELECT idProveedor, cuit, razonSocial, nombreContacto, email, telefono, activo
        FROM Proveedores
        WHERE activo = 1;
    END IF;
END//

CREATE PROCEDURE spProveedorPorID(
	IN pid INT
)
BEGIN
	SELECT idProveedor, cuit, razonSocial, nombreContacto,
	calle, numCalle, observaciones, email, telefono, activo
    FROM Proveedores
    WHERE idProveedor = pid;
END//

CREATE PROCEDURE spEliminarProveedor(
	IN pid INT
)
BEGIN
	UPDATE Proveedores
    SET activo = 0
    WHERE idProveedor = pid;
END//

CREATE PROCEDURE spEditarProveedor(
	IN pid INT,
	IN pcuit CHAR(11),
    IN prazonSocial VARCHAR(64),
    IN pnombreContacto VARCHAR(64),
    IN pcalle VARCHAR(64),
    IN pnumCalle MEDIUMINT,
    IN pobservaciones VARCHAR(256),
    IN pemail VARCHAR(64),
    IN ptelefono VARCHAR(15),
    IN pactivo BIT
)
BEGIN
	UPDATE Proveedores
    SET cuit = pcuit, razonSocial = prazonSocial, nombreContacto = pnombreContacto,
	calle = pcalle, numCalle = pnumCalle, observaciones = pobservaciones,
    email = pemail, telefono = ptelefono, activo = pactivo
    WHERE idProveedor = pid;
END//

## Maquinas alquiler

CREATE PROCEDURE spNuevaMaquina(
	IN pidTipoMaquina TINYINT UNSIGNED, 
    IN pmarcaMaquina VARCHAR(32), 
    IN pmodeloMaquina VARCHAR(64), 
    IN pserieMaquina VARCHAR(20), 
    IN palturaTorre SMALLINT UNSIGNED,
    IN pcapacidadCarga MEDIUMINT UNSIGNED
)
BEGIN
	INSERT INTO MaquinasAlquiladas (idTipoMaquina, marcaMaquina, modeloMaquina, serieMaquina, alturaTorre, capacidadCarga)
    VALUES (pidTipoMaquina, pmarcaMaquina, pmodeloMaquina, pserieMaquina, palturaTorre, pcapacidadCarga);
END//

CREATE PROCEDURE spListarMaquinas()
BEGIN
	SELECT idMaquinaAlq, t.nombre AS tipoMaquina, marcaMaquina, modeloMaquina, serieMaquina, alturaTorre, capacidadCarga
    FROM MaquinasAlquiladas ma JOIN TiposMaquina t ON ma.idTipoMaquina = t.idTipo;
END//

CREATE PROCEDURE spListarMaquinasAlquilables(
    IN pfechaInicio CHAR(24),
    IN pfechaFin CHAR(24)
)
BEGIN
	DECLARE fechaInicioParam DATE;
    DECLARE fechaFinParam DATE;
    SET fechaInicioParam = CAST(pfechaInicio AS DATE);
    SET fechaFinParam = CAST(pfechaFin AS DATE);
	SELECT maq.idMaquinaAlq, tm.nombre as tipoMaquina,
	maq.alturaTorre, maq.capacidadCarga
    FROM MaquinasAlquiladas maq
    JOIN TiposMaquina tm ON tm.idTipo = maq.idTipoMaquina
    WHERE maq.idMaquinaAlq NOT IN (
        SELECT det.idMaquinaAlq
        FROM DetallesAlquiler det
        INNER JOIN Alquileres alq ON det.idAlquiler = alq.idAlquiler
        WHERE (alq.fechaInicio > fechaInicioParam AND alq.fechaInicio <= fechaFinParam)
            OR (alq.fechaFin >= fechaInicioParam AND alq.fechaFin < fechaFinParam)
            OR (fechaInicioParam > alq.fechaInicio AND fechaInicioParam <= alq.fechaFin)
            OR (fechaFinParam >= alq.fechaInicio AND fechaFinParam < alq.fechaFin)
    );
END //

CREATE PROCEDURE spMaquinaPorID(
	IN pid INT
)
BEGIN
	SELECT idMaquinaAlq, idTipoMaquina, t.nombre as tipoMaquina,
	marcaMaquina, modeloMaquina, serieMaquina, alturaTorre, capacidadCarga
    FROM MaquinasAlquiladas ma JOIN TiposMaquina t
    ON ma.idTipoMaquina = t.idTipo
    WHERE idMaquinaAlq = pid;
END//

CREATE PROCEDURE spEliminarMaquina(
	pid INT
)
BEGIN
	DELETE FROM MaquinasAlquiladas
    WHERE pid = idMaquinaAlq;
END//

CREATE PROCEDURE spEditarMaquina(
	id INT,
    idtm TINYINT,
    marca VARCHAR(32),
    modelo VARCHAR(64),
    serie VARCHAR(20),
    altura SMALLINT UNSIGNED,
    capacidad MEDIUMINT UNSIGNED
)
BEGIN
	UPDATE MaquinasAlquiladas
	SET idTipoMaquina = idtm, marcaMaquina = marca, modeloMaquina = modelo,
    serieMaquina = serie, alturaTorre = altura, capacidadCarga = capacidad
    WHERE idMaquinaAlq = id;
END//

## Solicitudes

CREATE PROCEDURE spNuevaSolicitudAlquiler(
    IN nombre VARCHAR(64),
    IN razon VARCHAR(64),
    IN telefono VARCHAR(15),
    IN email VARCHAR(64),
    IN comm VARCHAR(512),
    IN token CHAR(36)
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
    DECLARE idE TINYINT DEFAULT NULL;
    DECLARE idT TINYINT DEFAULT NULL;
	SELECT idEstado INTO idE FROM EstadosSolicitud es
    WHERE es.nombre = 'NUEVA';
    SELECT idTipo INTO idT FROM TiposSolicitud ts
    WHERE ts.nombre = 'ALQUILER';
	INSERT INTO Solicitudes (idEstadoSolicitud, idTipoSolicitud, nombreSolicitante, razonSocial,
    telefonoContacto, emailContacto, comentario, fechaSolicitud, fechaAprobacion, tokenCancel)
    VALUES (idE, idT, nombre, razon, telefono, email, comm, now(), null, token);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevaSolicitudOferta(
    IN nombre VARCHAR(64),
    IN razon VARCHAR(64),
    IN telefono VARCHAR(15),
    IN email VARCHAR(64),
    IN comm VARCHAR(512),
    IN token CHAR(36)
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
    DECLARE idE TINYINT DEFAULT NULL;
    DECLARE idT TINYINT DEFAULT NULL;
	SELECT idEstado INTO idE FROM EstadosSolicitud es
    WHERE es.nombre = 'NUEVA';
    SELECT idTipo INTO idT FROM TiposSolicitud ts
    WHERE ts.nombre = 'OFERTA';
	INSERT INTO Solicitudes (idEstadoSolicitud, idTipoSolicitud, nombreSolicitante, razonSocial,
    telefonoContacto, emailContacto, comentario, fechaSolicitud, fechaAprobacion, tokenCancel)
    VALUES (idE, idT, nombre, razon, telefono, email, comm, now(), null, token);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevaSolicitudRepuestos(
    IN nombre VARCHAR(64),
    IN razon VARCHAR(64),
    IN telefono VARCHAR(15),
    IN email VARCHAR(64),
    IN comm VARCHAR(512),
    IN token CHAR(36)
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
    DECLARE idE TINYINT DEFAULT NULL;
    DECLARE idT TINYINT DEFAULT NULL;
	SELECT idEstado INTO idE FROM EstadosSolicitud es
    WHERE es.nombre = 'NUEVA';
    SELECT idTipo INTO idT FROM TiposSolicitud ts
    WHERE ts.nombre = 'REPUESTOS';
	INSERT INTO Solicitudes (idEstadoSolicitud, idTipoSolicitud, nombreSolicitante, razonSocial,
    telefonoContacto, emailContacto, comentario, fechaSolicitud, fechaAprobacion, tokenCancel)
    VALUES (idE, idT, nombre, razon, telefono, email, comm, now(), null, token);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevaSolicitudServicio(
    IN nombre VARCHAR(64),
    IN razon VARCHAR(64),
    IN telefono VARCHAR(15),
    IN email VARCHAR(64),
    IN comm VARCHAR(512),
    IN token CHAR(36)
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
    DECLARE idE TINYINT DEFAULT NULL;
    DECLARE idT TINYINT DEFAULT NULL;
	SELECT idEstado INTO idE FROM EstadosSolicitud es
    WHERE es.nombre = 'NUEVA';
    SELECT idTipo INTO idT FROM TiposSolicitud ts
    WHERE ts.nombre = 'SERVICIO';
	INSERT INTO Solicitudes (idEstadoSolicitud, idTipoSolicitud, nombreSolicitante, razonSocial,
    telefonoContacto, emailContacto, comentario, fechaSolicitud, fechaAprobacion, tokenCancel)
    VALUES (idE, idT, nombre, razon, telefono, email, comm, now(), null, token);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spCancelarSolicitudToken(
	IN token CHAR(36)
)
BEGIN
	DECLARE idEsNueva TINYINT DEFAULT 0;
    DECLARE idEsSoli TINYINT DEFAULT NULL;
    DECLARE idEsCancel TINYINT DEFAULT NULL;
    DECLARE changed BIT DEFAULT 0;
    
    SELECT idEstado INTO idEsNueva FROM EstadosSolicitud es
    WHERE es.nombre = 'NUEVA';
    
	SELECT idEstado INTO idEsCancel FROM EstadosSolicitud
    WHERE nombre = 'CANCELADA';
    
    SELECT idEstadoSolicitud INTO idEsSoli FROM Solicitudes WHERE tokenCancel = token;
    
    IF idEsNueva = idEsSoli THEN
		UPDATE Solicitudes
		SET idEstadoSolicitud = idEsCancel
		WHERE tokenCancel = token;
        SET changed = 1;
	ELSE
		SET changed = 0;
	END IF;
    SELECT changed;
END//

CREATE PROCEDURE spSolicitudPorToken(
	IN token CHAR(36)
)
BEGIN
	SELECT s.idSolicitud, es.nombre as estadoSolicitud, ts.nombre as tipoSolicitud,
    s.nombreSolicitante, s.razonSocial
    FROM Solicitudes s
    JOIN EstadosSolicitud es ON s.idEstadoSolicitud = es.idEstado
    JOIN TiposSolicitud ts ON s.idTipoSolicitud = ts.idTipo
    WHERE tokenCancel = token;
END//

CREATE PROCEDURE spActualizarEstado(
	IN ids INT UNSIGNED,
    IN ide TINYINT UNSIGNED
)
BEGIN
	UPDATE Solicitudes
    SET idEstadoSolicitud = ide
    WHERE idSolicitud = ids;
END//

CREATE PROCEDURE spSolicitudPorID(
	IN id INT UNSIGNED
)
BEGIN
	SELECT s.idSolicitud, es.nombre as estadoSolicitud, ts.nombre as tipoSolicitud,
    s.nombreSolicitante, s.razonSocial, s.telefonoContacto, s.emailContacto, s.comentario,
    s.fechaSolicitud, s.fechaAprobacion
    FROM Solicitudes s
    JOIN EstadosSolicitud es ON s.idEstadoSolicitud = es.idEstado
    JOIN TiposSolicitud ts ON s.idTipoSolicitud = ts.idTipo
    WHERE idSolicitud = id;
END//

## Alquileres

CREATE PROCEDURE spNuevoAlquiler(
	IN ids INT,
    IN fInicio CHAR(24),
    IN fFin CHAR(24)
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
	INSERT INTO Alquileres (idSolicitud, idPresupuesto, fechaInicio, fechaFin)
    VALUES (ids, null, CAST(fInicio AS DATE), CAST(fFin AS DATE));
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevoDetalleAlquiler(
	IN ida INT UNSIGNED,
    IN idm INT UNSIGNED
)
BEGIN
	INSERT INTO DetallesAlquiler (idAlquiler, idMaquinaAlq, subtotal)
    VALUES (ida, idm, 0);
END//

CREATE PROCEDURE spAlquilerPorSolicitud(
	IN idSoli INT UNSIGNED
)
BEGIN
	SELECT idAlquiler, idPresupuesto, fechaInicio, fechaFin
    FROM Alquileres
    WHERE idSolicitud = idSoli;
END//

CREATE PROCEDURE spDetallesAlquilerPorID(
	IN idAlquiler INT UNSIGNED
)
BEGIN
	SELECT da.idDetalle, da.idMaquinaAlq, ma.marcaMaquina, ma.serieMaquina,
    ma.modeloMaquina, ma.alturaTorre, ma.capacidadCarga, da.subtotal
    FROM DetallesAlquiler da
    JOIN MaquinasAlquiladas ma ON da.idMaquinaAlq = ma.idMaquinaAlq
    WHERE da.idAlquiler = idAlquiler;
END//

## Ofertas

CREATE PROCEDURE spNuevaOferta(
	IN pnombre VARCHAR(64),
    IN pdescripcion VARCHAR(256),
    IN pprecio DECIMAL(12,2),
    IN fInicio CHAR(24),
    IN fFin CHAR(24)
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
	INSERT INTO Ofertas (nombre, descripcion, precio, fechaInicio, fechaFin, vendida)
    VALUES (pnombre, pdescripcion, pprecio,  CAST(fInicio AS DATE), CAST(fFin AS DATE), false);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevoDetalleOferta(
	IN ido INT UNSIGNED,
    IN idp INT UNSIGNED,
    IN pcantidad SMALLINT UNSIGNED
)
BEGIN
	INSERT INTO DetallesOferta (idProducto, idOferta, cantidad)
    VALUES (idp, ido, pcantidad);
END//

CREATE PROCEDURE spDetallesOfertaPorID(
	IN ido INT UNSIGNED
)
BEGIN
	SELECT d.idDetalle,
    po.idProducto,
    tp.nombre as tipoProducto, 
    po.nombre as nombreProducto,
    po.descripcion as descripcionProducto,
    po.codigoParte as codigoProducto,
    po.precio as precioUnitario,
    d.cantidad
    FROM DetallesOferta d
    JOIN ProductosOferta po ON d.idProducto = po.idProducto
    JOIN TiposProducto tp ON po.idTipoProducto = tp.idTipo
    WHERE d.idOferta = ido;
END//

CREATE PROCEDURE spDetallesReducidosOfertaPorID(
	IN ido INT UNSIGNED
)
BEGIN
	SELECT 
    po.nombre as nombreProducto,
    tp.nombre as tipoProducto,
    po.descripcion as descripcionProducto,
    po.codigoParte as codigoProducto
    FROM DetallesOferta d
    JOIN ProductosOferta po ON d.idProducto = po.idProducto
    JOIN TiposProducto tp ON po.idTipoProducto = tp.idTipo
    WHERE d.idOferta = ido;
END//

CREATE PROCEDURE spListarOfertas(
	IN vigente BIT
)
BEGIN
    IF vigente = 0 THEN
		SELECT idOferta, nombre, descripcion, precio, fechaInicio, fechaFin, vendida
		FROM Ofertas;
    ELSE
		SELECT idOferta, nombre, descripcion, precio, fechaInicio, fechaFin, vendida
		FROM Ofertas
        WHERE (fechaInicio < NOW() AND fechaFin > NOW()) AND vendida = 0;
    END IF;
END//

CREATE PROCEDURE spListarOfertasVigentes()
BEGIN
	SELECT idOferta, nombre, descripcion, precio, fechaFin
	FROM Ofertas
	WHERE (fechaInicio < NOW() AND fechaFin > NOW()) AND vendida = 0;
END//

CREATE PROCEDURE spCancelarOferta(
	IN id INT UNSIGNED
)
BEGIN
	DECLARE currentDateTime DATETIME;
	DECLARE changed BIT;
	
	SET currentDateTime = NOW();
	IF (SELECT fechaFin FROM Ofertas WHERE idOferta = id AND vendida = 0) > currentDateTime THEN
		UPDATE Ofertas
		SET fechaFin = currentDateTime
		WHERE idOferta = id;
		SET changed = 1;
	ELSE
		SET changed = 0;
	END IF;
	SELECT changed;
END//

CREATE PROCEDURE spEditarOferta(
	IN ido INT UNSIGNED,
	IN nombreParam VARCHAR(64),
    IN descripcionParam VARCHAR(256),
    IN precioParam DECIMAL(12,2),
	IN fInicio CHAR(24),
	IN fFin CHAR(24)
)
BEGIN
	UPDATE Ofertas
    SET nombre = nombreParam, descripcion = descripcionParam,
    precio = precioParam, fechaInicio = CAST(fInicio AS DATE),
    fechaFin = CAST(fFin AS DATE)
    WHERE idOferta = ido;
END//

DELIMITER //

CREATE PROCEDURE spMarcarOfertaVendida(
	IN ido INT UNSIGNED
)
BEGIN
	UPDATE Ofertas
    SET vendida = 1
    WHERE idOferta = ido;
    
	UPDATE ProductosOferta
    SET activo = 0
    WHERE idProducto IN
	(SELECT idProducto FROM imaqtest.ofertas o 
	JOIN imaqtest.detallesoferta dof ON o.idOferta = dof.idOferta
	WHERE o.idOferta = ido);
END//

CREATE PROCEDURE spOfertaPorID(
	IN ido INT UNSIGNED
)
BEGIN
	SELECT nombre, descripcion, precio, fechaInicio, fechaFin, vendida
    FROM Ofertas WHERE idOferta = ido;
END//

CREATE PROCEDURE spOfertaReducidaPorID(
	IN ido INT UNSIGNED
)
BEGIN
	SELECT nombre, descripcion, precio, fechaFin
    FROM Ofertas WHERE idOferta = ido;
END//


## Solicitudes Compra

CREATE PROCEDURE spNuevaSolicitudCompra(
    idSoli INT UNSIGNED,
    idOf INT UNSIGNED
)
BEGIN
	INSERT INTO SolicitudesCompra (idSolicitud, idOferta)
    VALUES (idSoli, idOf);
END//

CREATE PROCEDURE spSolicitudCompraPorIDSolicitud(
	IN idSoli INT UNSIGNED
)
BEGIN
	SELECT idSolicitudCompra, idPresupuesto, idOferta
    FROM SolicitudesCompra
    WHERE idSolicitud = idSoli;
END//

## Servicios 

CREATE PROCEDURE spNuevoServicio(
    idTipoServ TINYINT UNSIGNED,
    idSoli INT UNSIGNED
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
	INSERT INTO Servicios (idSolicitud, idTipoServicio)
    VALUES (idSoli, idTipoServ);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevoDetalleServicio(
	IN idServ INT UNSIGNED,
    IN idTipoMaq TINYINT UNSIGNED,
    IN marca VARCHAR(32),
    IN modelo VARCHAR(64),
    IN serie VARCHAR(20),
    IN cantidad MEDIUMINT UNSIGNED
)
BEGIN
	INSERT INTO DetallesServicio (idServicio, idTipoMaquina, marcaMaquina, modeloMaquina, serieMaquina, cantidadMaquinas)
    VALUES (idServ, idTipoMaq, marca, modelo, serie, cantidad);
END//

CREATE PROCEDURE spServicioPorSolicitud(
	IN idSoli INT UNSIGNED
)
BEGIN
	SELECT s.idServicio, s.idPresupuesto, ts.nombre as tipoServicio
    FROM Servicios s
    JOIN TiposServicio ts ON s.idTipoServicio = ts.idTipo
    WHERE idSolicitud = idSoli;
END//

CREATE PROCEDURE spDetallesServicioPorID(
	IN idServ INT UNSIGNED
)
BEGIN
	SELECT ds.idDetalle, tm.nombre as tipoMaquina, ds.marcaMaquina, ds.modeloMaquina,
    ds.serieMaquina, ds.cantidadMaquinas
    FROM DetallesServicio ds
    JOIN TiposMaquina tm ON ds.idTipoMaquina = tm.idTipo
    WHERE ds.idServicio = idServ;
END//

## Repuestos

CREATE PROCEDURE spCrearSolicitudRepuesto(
    idSoli INT UNSIGNED
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
	INSERT INTO SolicitudesRepuesto (idSolicitud)
    VALUES (idSoli);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevoDetalleRepuesto(
    IN idSoliRep INT UNSIGNED,
    IN marcaParam VARCHAR(32),
    IN modeloParam VARCHAR(64),
    IN serieParam VARCHAR(20),
    IN codigoParam VARCHAR(20),
    IN cantidadParam SMALLINT UNSIGNED,
    IN descripcionParam VARCHAR(64)
)
BEGIN
    INSERT INTO DetallesRepuesto (idSolicitudRepuesto, marca, modelo, serie, codigoRepuesto, cantidad, descripcionRepuesto)
    VALUES (idSoliRep, marcaParam, modeloParam, serieParam, codigoParam, cantidadParam, descripcionParam);
END //

CREATE PROCEDURE spRepuestosPorSolicitud(
	IN idSoli INT UNSIGNED
)
BEGIN
	SELECT sr.idSolicitudRepuesto, sr.idPresupuesto
    FROM SolicitudesRepuesto sr
    WHERE sr.idSolicitud = idSoli;
END//

CREATE PROCEDURE spDetallesRepuestoPorID(
	IN idsr INT UNSIGNED
)
BEGIN
	SELECT dr.idDetalle, dr.marca, dr.modelo, dr.serie,
    dr.codigoRepuesto, dr.cantidad, dr.descripcionRepuesto
    FROM DetallesRepuesto dr
    WHERE dr.idSolicitudRepuesto = idsr;
END//

## Presupuestos

CREATE PROCEDURE spNuevoPresupuesto(
	IN idTipoPresupuestoParam TINYINT UNSIGNED,
	IN razonSocialParam VARCHAR(64),
	IN cuitParam CHAR(11),
	IN direccionParam VARCHAR(64),
	IN nombreContactoParam VARCHAR(64),
	IN fechaCreacionParam CHAR(24),
	IN observacionesParam VARCHAR(512),
	IN diasValidezParam SMALLINT UNSIGNED,
	IN porcentajeImpuestosParam DECIMAL(3,1),
    IN tokenParam CHAR(36)
)
BEGIN
	DECLARE lastId INT DEFAULT NULL;
	INSERT INTO Presupuestos (idTipoPresupuesto, razonSocial, cuit,
    direccion, nombreContacto, fechaCreacion, observaciones,
    diasValidez, porcentajeImpuestos, token)
    VALUES (idTipoPresupuestoParam, razonSocialParam, cuitParam,
    direccionParam, nombreContactoParam, CAST(fechaCreacionParam AS Date), observacionesParam,
    diasValidezParam, porcentajeImpuestosParam, tokenParam);
	SET lastId = LAST_INSERT_ID();
    SELECT lastId;
END//

CREATE PROCEDURE spNuevoDetallePresupuesto(
    IN idPresupuestoParam INT UNSIGNED,
    IN descripcionParam VARCHAR(512),
    IN plazoEntregaParam SMALLINT UNSIGNED,
    IN cantidadParam SMALLINT UNSIGNED,
    IN precioUnitarioParam DECIMAL(12,2)
)
BEGIN
    INSERT INTO DetallesPresupuesto (idPresupuesto, descripcion, plazoEntrega, cantidad, precioUnitario)
    VALUES (idPresupuestoParam, descripcionParam, plazoEntregaParam, cantidadParam, precioUnitarioParam);
END //

CREATE PROCEDURE spAsociarPresupuesto(
	IN idpre INT UNSIGNED,
    IN idsoli INT UNSIGNED
)
BEGIN
    DECLARE idts TINYINT UNSIGNED;
    DECLARE changed BIT DEFAULT 0;
    DECLARE ides TINYINT UNSIGNED DEFAULT 2;
    
    # 1 = ALQUILER
    # 2 = OFERTA
    # 3 = REPUESTOS
    # 4 = SERVICIO
    
    SELECT idEstado INTO ides FROM EstadosSolicitud WHERE nombre = 'PRESUPUESTADA';
    
    IF EXISTS (SELECT 1 FROM Solicitudes WHERE idSolicitud = idsoli) THEN
		SELECT idTipoSolicitud INTO idts FROM Solicitudes WHERE idSolicitud = idsoli;
        UPDATE Solicitudes SET fechaAprobacion = NOW(), idEstadoSolicitud = ides WHERE idSolicitud = idsoli; 
    ELSE
		SET idts = 0;
    END IF;
    
    IF idts = 1 THEN
        UPDATE Alquileres SET idPresupuesto = idpre WHERE idSolicitud = idsoli;
        SET changed = 1;
    ELSEIF idts = 2 THEN
        UPDATE SolicitudesCompra SET idPresupuesto = idpre WHERE idSolicitud = idsoli;
        SET changed = 1;
    ELSEIF idts = 3 THEN
        UPDATE SolicitudesRepuesto SET idPresupuesto = idpre WHERE idSolicitud = idsoli;
        SET changed = 1;
    ELSEIF idts = 4 THEN
        UPDATE Servicios SET idPresupuesto = idpre WHERE idSolicitud = idsoli;
        SET changed = 1;
    ELSE
        SET changed = 0;
    END IF;
    SELECT changed;
END //

CREATE PROCEDURE spAceptarPresupuesto(
	IN tokenParam CHAR(36),
    IN accepted BIT
)
BEGIN
	# Reamar con id presupuesto como parametro
    DECLARE idpresu INT UNSIGNED DEFAULT 0; # id del presupuesto encontrado
    DECLARE tipoPresupuesto TINYINT UNSIGNED DEFAULT 0; # id del tipo del presupuesto encontrado
    DECLARE idSoli TINYINT UNSIGNED DEFAULT 0; # id de la solicitud con ese presupuesto
    
    DECLARE presupuestada TINYINT UNSIGNED DEFAULT 0; # id del estado "presupuestada" de una solicitud
    DECLARE nuevoEstado TINYINT UNSIGNED DEFAULT 0; # id estado a aplicar
    
    SELECT idEstado INTO presupuestada FROM EstadosSolicitud WHERE nombre = 'PRESUPUESTADA';
    
    IF accepted = 1 THEN
		SELECT idEstado INTO nuevoEstado FROM EstadosSolicitud WHERE nombre = 'PRESUPUESTO ACEPTADO';
    ELSE
		SELECT idEstado INTO nuevoEstado FROM EstadosSolicitud WHERE nombre = 'PRESUPUESTO RECHAZADO';
    END IF;
    
    IF EXISTS (SELECT 1 FROM Presupuestos WHERE token = tokenParam) THEN
		SELECT idPresupuesto INTO idpresu FROM Presupuestos WHERE token = tokenParam;
        SELECT idTipoPresupuesto INTO tipoPresupuesto FROM Presupuestos WHERE token = tokenParam;
        
		IF tipoPresupuesto = 1 THEN
			SELECT so.idSolicitud INTO idSoli FROM Solicitudes so
			JOIN Alquileres al ON so.idSolicitud = al.idSolicitud
			WHERE al.idPresupuesto = idpresu;
		ELSEIF tipoPresupuesto = 2 THEN
			SELECT so.idSolicitud INTO idSoli FROM Solicitudes so
			JOIN SolicitudesCompra sc ON so.idSolicitud = sc.idSolicitud
			WHERE sc.idPresupuesto = idpresu;
		ELSEIF tipoPresupuesto = 3 THEN
			SELECT so.idSolicitud INTO idSoli FROM Solicitudes so
			JOIN SolicitudesRepuesto sr ON so.idSolicitud = sr.idSolicitud
			WHERE sr.idPresupuesto = idpresu;
		ELSEIF tipoPresupuesto = 4 THEN
			SELECT so.idSolicitud INTO idSoli FROM Solicitudes so
			JOIN Servicios sv ON so.idSolicitud = sv.idSolicitud
			WHERE sv.idPresupuesto = idpresu;
		END IF;
			UPDATE Solicitudes SET idEstadoSolicitud = nuevoEstado
            WHERE idSolicitud = idSoli AND idEstadoSolicitud = presupuestada;
	END IF;
END//

CREATE PROCEDURE spRellenarPresupuesto(
	IN idsoli INT UNSIGNED
)
BEGIN
	DECLARE idts TINYINT UNSIGNED DEFAULT 0;
    IF EXISTS (SELECT 1 FROM Solicitudes WHERE idSolicitud = idsoli) THEN
		SELECT idTipoSolicitud INTO idts FROM Solicitudes WHERE idSolicitud = idsoli;
	ELSE
		SET idts = 0;
	END IF;
    
    # 1 = ALQUILER
    # 2 = OFERTA
    # 3 = REPUESTOS
    # 4 = SERVICIO
    
	IF idts = 1 THEN
        SELECT s.nombreSolicitante as nombreContacto, s.idTipoSolicitud as idTipoPresupuesto, s.razonSocial,
        a.idPresupuesto
        FROM Solicitudes s
        JOIN Alquileres a ON a.idSolicitud = s.idSolicitud
        WHERE s.idSolicitud = idsoli;
    ELSEIF idts = 2 THEN
        SELECT s.nombreSolicitante as nombreContacto, s.idTipoSolicitud as idTipoPresupuesto, s.razonSocial,
        sc.idPresupuesto
        FROM Solicitudes s
        JOIN SolicitudesCompra sc ON sc.idSolicitud = s.idSolicitud
        WHERE s.idSolicitud = idsoli;
    ELSEIF idts = 3 THEN
        SELECT s.nombreSolicitante as nombreContacto, s.idTipoSolicitud as idTipoPresupuesto, s.razonSocial,
        sr.idPresupuesto
        FROM Solicitudes s
        JOIN SolicitudesRepuesto sr ON sr.idSolicitud = s.idSolicitud
        WHERE s.idSolicitud = idsoli;
    ELSEIF idts = 4 THEN
        SELECT s.nombreSolicitante as nombreContacto, s.idTipoSolicitud as idTipoPresupuesto, s.razonSocial,
        sv.idPresupuesto
        FROM Solicitudes s
        JOIN Servicios sv ON sv.idSolicitud = s.idSolicitud
        WHERE s.idSolicitud = idsoli;
    END IF;
END//

CREATE PROCEDURE spRellenarDetallesPresupuesto(
    IN idsoli INT UNSIGNED
)
BEGIN
    # 1 = ALQUILER
    # 2 = OFERTA
    # 3 = REPUESTOS
    # 4 = SERVICIO
    
	DECLARE idts TINYINT UNSIGNED DEFAULT 0;
    IF EXISTS (SELECT 1 FROM Solicitudes WHERE idSolicitud = idsoli) THEN
		SELECT idTipoSolicitud INTO idts FROM Solicitudes WHERE idSolicitud = idsoli;
	ELSE
		SET idts = 0;
	END IF;
    
	IF idts = 1 THEN
        SELECT 1 as cantidad, CONCAT(tm.nombre,' ',ma.marcaMaquina,' ',ma.modeloMaquina,' - Serie: ',ma.serieMaquina) as descripcion, 0 as precioUnitario
        FROM Solicitudes so
        JOIN Alquileres al ON al.idSolicitud = so.idSolicitud
        JOIN DetallesAlquiler da ON da.idAlquiler = al.idAlquiler
        JOIN MaquinasAlquiladas ma ON da.idMaquinaAlq = ma.idMaquinaAlq
        JOIN TiposMaquina tm ON ma.idTipoMaquina = tm.idTipo
        WHERE so.idSolicitud = idsoli;
    ELSEIF idts = 2 THEN
        SELECT 1 as cantidad, CONCAT('Oferta "',o.nombre,'"') as descripcion, precio as precioUnitario
        FROM Solicitudes so
		JOIN SolicitudesCompra sc ON so.idSolicitud = sc.idSolicitud
        JOIN Ofertas o ON sc.idOferta = o.idOferta
        WHERE so.idSolicitud = idsoli
        UNION
        SELECT 1 as cantidad, CONCAT(po.nombre,' Cod: ',po.codigoParte) as descripcion, 0 as precioUnitario
        FROM Solicitudes so
		JOIN SolicitudesCompra sc ON so.idSolicitud = sc.idSolicitud
        JOIN Ofertas o ON sc.idOferta = o.idOferta
        JOIN DetallesOferta d ON d.idOferta = o.idOferta
        JOIN ProductosOferta po ON d.idProducto = po.idProducto
        WHERE so.idSolicitud = idsoli;
    ELSEIF idts = 3 THEN
        SELECT dr.cantidad, CONCAT(dr.descripcionRepuesto,' "',dr.marca,' ',dr.modelo,'" Serie: ',dr.serie,' Codigo: ',dr.codigoRepuesto) as descripcion, 0 as precioUnitario
        FROM Solicitudes so
		JOIN SolicitudesRepuesto sr ON so.idSolicitud = sr.idSolicitud
        JOIN DetallesRepuesto dr ON dr.idSolicitudRepuesto = sr.idSolicitudRepuesto
        WHERE so.idSolicitud = idsoli;
    ELSEIF idts = 4 THEN
        SELECT ds.cantidadMaquinas as cantidad, CONCAT(tm.nombre,' "',ds.marcaMaquina,' ',ds.modeloMaquina,'" - Serie: ',ds.serieMaquina) as descripcion, 0 as precioUnitario
        FROM Solicitudes so
		JOIN Servicios sv ON sv.idSolicitud = so.idSolicitud
        JOIN DetallesServicio ds ON ds.idServicio = sv.idServicio
        JOIN TiposMaquina tm ON ds.idTipoMaquina = tm.idTipo
        WHERE so.idSolicitud = idsoli;
    END IF;
END//

CREATE PROCEDURE spPresupuestoIDPorToken(
	IN tokenParam CHAR(36)
)
BEGIN
	SELECT idPresupuesto FROM Presupuestos WHERE token = tokenParam;
END//

CREATE PROCEDURE spPresupuestoPorID(
	IN idpr INT UNSIGNED
)
BEGIN
    SELECT p.idPresupuesto, tp.nombre AS tipoPresupuesto, p.razonSocial,
    p.cuit, p.direccion, p.nombreContacto, p.fechaCreacion, p.observaciones,
    p.diasValidez, p.porcentajeImpuestos
    FROM Presupuestos p
    INNER JOIN TiposPresupuesto tp ON p.idTipoPresupuesto = tp.idTipo
    WHERE p.idPresupuesto = idpr;
END//

CREATE PROCEDURE spDetallesPresupuestoPorID(
	IN idpr INT UNSIGNED
)
BEGIN
    SELECT dp.idDetalle, dp.descripcion, dp.plazoEntrega, dp.cantidad, dp.precioUnitario
    FROM DetallesPresupuesto dp
    WHERE dp.idPresupuesto = idpr;
END//

## Reportes

CREATE PROCEDURE spGenerarReporteSolicitudes1(
    IN fInicio CHAR(24),
    IN fFinal CHAR(24)
)
BEGIN
		SELECT COUNT(idSolicitud) as cantidadSolicitudes
		FROM Solicitudes sol
        WHERE sol.fechaSolicitud >= CAST(fInicio AS DATE)
        AND sol.fechaSolicitud <= CAST(fFinal AS DATE);
END //

CREATE PROCEDURE spGenerarReporteSolicitudes2(
    IN fInicio CHAR(24),
    IN fFinal CHAR(24)
)
BEGIN
	SELECT COUNT(idTipoSolicitud) AS cantidadPorTipo, tipo.nombre AS tipoSolicitud
	FROM Solicitudes sol
	INNER JOIN TiposSolicitud tipo ON sol.idTipoSolicitud = tipo.idTipo
	WHERE sol.fechaSolicitud >= CAST(fInicio AS DATE)
	AND sol.fechaSolicitud <= CAST(fFinal AS DATE)
	GROUP BY tipo.nombre;
END //

CREATE PROCEDURE spGenerarReporteSolicitudes3(
    IN fInicio CHAR(24),
    IN fFinal CHAR(24)
)
BEGIN
	SELECT COUNT(idEstadoSolicitud) AS cantidadPorEstado, estado.nombre AS estadoSolicitud
	FROM Solicitudes sol
	INNER JOIN EstadosSolicitud estado ON sol.idEstadoSolicitud = estado.idEstado
	WHERE sol.fechaSolicitud >= CAST(fInicio AS DATE)
	AND sol.fechaSolicitud <= CAST(fFinal AS DATE)
	GROUP BY estadoSolicitud;
END //

CREATE PROCEDURE spGenerarReporteClientes1(
    IN fInicio CHAR(24),
    IN fFinal CHAR(24)
)
BEGIN
	SELECT COUNT(UPPER(razonSocial)) as cantidad, UPPER(razonSocial) AS razonSocial
	FROM Solicitudes sol
	WHERE sol.fechaSolicitud >= CAST(fInicio AS DATE)
	AND sol.fechaSolicitud <= CAST(fFinal AS DATE)
	GROUP BY razonSocial
	ORDER BY cantidad DESC
	LIMIT 10;
END //

CREATE PROCEDURE spCantidadSolicitudesPorAnio(
    IN anio SMALLINT UNSIGNED
)
BEGIN
    SELECT MONTH(fechaSolicitud) AS mes, COUNT(idSolicitud) AS cantidad
    FROM Solicitudes
    WHERE YEAR(fechaSolicitud) = anio
    GROUP BY mes;
END //

CREATE PROCEDURE spGenerarReporteVentas1(
    IN fInicio CHAR(24),
    IN fFinal CHAR(24)
)
BEGIN
	SET @randomNumber = FLOOR(1 + RAND() * 16777215);
    SET @tableName = CONCAT('temp_',@randomNumber);

	SET @create_query = CONCAT('CREATE TEMPORARY TABLE ', @tableName,'
	AS
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, al.idPresupuesto FROM Solicitudes so
	JOIN Alquileres al on al.idSolicitud = so.idSolicitud
	WHERE so.fechaSolicitud >= CAST(\'',fInicio,'\' AS DATE) AND so.fechaSolicitud <= CAST(\'',fFinal,'\' AS DATE)
	UNION
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, sv.idPresupuesto FROM Solicitudes so
	JOIN Servicios sv on sv.idSolicitud = so.idSolicitud
	WHERE so.fechaSolicitud >= CAST(\'',fInicio,'\' AS DATE) AND so.fechaSolicitud <= CAST(\'',fFinal,'\' AS DATE)
	UNION
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, sc.idPresupuesto FROM Solicitudes so
	JOIN SolicitudesCompra sc on sc.idSolicitud = so.idSolicitud
	WHERE so.fechaSolicitud >= CAST(\'',fInicio,'\' AS DATE) AND so.fechaSolicitud <= CAST(\'',fFinal,'\' AS DATE)
	UNION
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, sr.idPresupuesto FROM Solicitudes so
	JOIN SolicitudesRepuesto sr on sr.idSolicitud = so.idSolicitud
	WHERE so.fechaSolicitud >= CAST(\'',fInicio,'\' AS DATE) AND so.fechaSolicitud <= CAST(\'',fFinal,'\' AS DATE);');
	PREPARE create_table_stmt FROM @create_query;
    EXECUTE create_table_stmt;
    DEALLOCATE PREPARE create_table_stmt;

	SET @select_query = CONCAT('SELECT es.nombre as estado, ROUND(SUM(cantidad*precioUnitario*(1+(porcentajeImpuestos/100))),2) as total
	FROM ',@tableName,' tt
	JOIN presupuestos p ON tt.idPresupuesto = p.idPresupuesto
	JOIN detallespresupuesto dp on dp.idPresupuesto = tt.idPresupuesto
	JOIN estadosSolicitud es ON tt.idEstadoSolicitud = es.idEstado
	WHERE tt.idPresupuesto IS NOT NULL
	GROUP BY estado;');
	PREPARE select_stmt FROM @select_query;
    EXECUTE select_stmt;
    DEALLOCATE PREPARE select_stmt;
    
	SET @drop_table_query = CONCAT('DROP TABLE IF EXISTS ', @tableName);
	PREPARE drop_table_stmt FROM @drop_table_query;
	EXECUTE drop_table_stmt;
	DEALLOCATE PREPARE drop_table_stmt;
END//

CREATE PROCEDURE spGenerarReporteVentas2(
    IN anio SMALLINT UNSIGNED
)
BEGIN
	SET @randomNumber = FLOOR(1 + RAND() * 16777215);
    SET @tableName = CONCAT('temp_',@randomNumber);

	SET @create_query = CONCAT('CREATE TEMPORARY TABLE ', @tableName,'
	AS
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, al.idPresupuesto, so.fechaSolicitud FROM Solicitudes so
	JOIN Alquileres al on al.idSolicitud = so.idSolicitud
	WHERE year(so.fechaSolicitud) = ',anio,'
	UNION
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, sv.idPresupuesto, so.fechaSolicitud FROM Solicitudes so
	JOIN Servicios sv on sv.idSolicitud = so.idSolicitud
	WHERE year(so.fechaSolicitud) = ',anio,'
	UNION
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, sc.idPresupuesto, so.fechaSolicitud FROM Solicitudes so
	JOIN SolicitudesCompra sc on sc.idSolicitud = so.idSolicitud
	WHERE year(so.fechaSolicitud) = ',anio,'
	UNION
	SELECT ALL so.idSolicitud, so.idEstadoSolicitud, sr.idPresupuesto, so.fechaSolicitud FROM Solicitudes so
	JOIN SolicitudesRepuesto sr on sr.idSolicitud = so.idSolicitud
	WHERE year(so.fechaSolicitud) = ',anio,';');
    PREPARE create_table_stmt FROM @create_query;
    EXECUTE create_table_stmt;
    DEALLOCATE PREPARE create_table_stmt;

	SET @select_query = CONCAT('SELECT month(fechaSolicitud) as mes,
	COUNT(distinct tt.idPresupuesto) as cantidad,
	ROUND(SUM(cantidad*precioUnitario*(1+(porcentajeImpuestos/100))) / COUNT(distinct tt.idPresupuesto),2) as promedio,
	ROUND(SUM(cantidad*precioUnitario*(1+(porcentajeImpuestos/100))),2) as total
	FROM ',@tableName,' tt
	JOIN presupuestos p ON tt.idPresupuesto = p.idPresupuesto
	JOIN detallespresupuesto dp on dp.idPresupuesto = tt.idPresupuesto
	JOIN estadosSolicitud es ON tt.idEstadoSolicitud = es.idEstado
	WHERE tt.idPresupuesto IS NOT NULL AND es.nombre =  \'COMPLETADA\'
	GROUP BY MONTH(fechaSolicitud);');
	PREPARE select_stmt FROM @select_query;
    EXECUTE select_stmt;
    DEALLOCATE PREPARE select_stmt;
    
    SET @drop_table_query = CONCAT('DROP TABLE IF EXISTS ', @tableName);
	PREPARE drop_table_stmt FROM @drop_table_query;
	EXECUTE drop_table_stmt;
	DEALLOCATE PREPARE drop_table_stmt;
END//

## Tipos

CREATE PROCEDURE spTiposMaquina()
BEGIN
	select idTipo, nombre from TiposMaquina;
END//

CREATE PROCEDURE spTiposPresupuesto()
BEGIN
	select idTipo, nombre from TiposPresupuesto;
END//

CREATE PROCEDURE spTiposProducto()
BEGIN
	select idTipo, nombre from TiposProducto;
END//

CREATE PROCEDURE spTiposServicio()
BEGIN
	select idTipo, nombre from TiposServicio;
END//

CREATE PROCEDURE spTiposSolicitud()
BEGIN
	select idTipo, nombre from TiposSolicitud;
END//

## Estados

CREATE PROCEDURE spEstadosSolicitud()
BEGIN
	select idEstado, nombre from EstadosSolicitud;
END//

## Sessions

CREATE PROCEDURE spLimpiarExpiradas()
BEGIN
	DELETE FROM sessions WHERE from_unixtime(expires) < NOW();
END//
DELIMITER ;