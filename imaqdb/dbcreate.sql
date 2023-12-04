CREATE DATABASE imaqtest;

USE imaqtest;

CREATE TABLE Roles(
	idRol SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(32),
    PRIMARY KEY (idRol)
);

CREATE TABLE Usuarios(
	idUsuario INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    usuario VARCHAR(64) NOT NULL UNIQUE,
    password CHAR(97) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    nombre VARCHAR(64) NOT NULL,
    apellido VARCHAR(64) NOT NULL,
    idRol SMALLINT UNSIGNED NOT NULL,
    fechaAlta DATETIME NOT NULL,
    fechaBaja DATETIME,
    PRIMARY KEY (idUsuario),
    FOREIGN KEY (idRol) REFERENCES Roles(idRol)
);

CREATE TABLE TiposServicio(
	idTipo TINYINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(32) NOT NULL,
    PRIMARY KEY (idTipo)
);

CREATE TABLE TiposPresupuesto(
	idTipo TINYINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(32) NOT NULL,
    PRIMARY KEY (idTipo)
);

CREATE TABLE TiposProducto(
	idTipo TINYINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(32) NOT NULL,
    PRIMARY KEY (idTipo)
);

CREATE TABLE TiposSolicitud(
	idTipo TINYINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(32) NOT NULL,
    PRIMARY KEY (idTipo)
);

CREATE TABLE EstadosSolicitud(
	idEstado TINYINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(32) NOT NULL,
    PRIMARY KEY (idEstado)
);

CREATE TABLE TiposMaquina(
	idTipo TINYINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(32) NOT NULL,
    PRIMARY KEY (idTipo)
);

CREATE TABLE Proveedores(
	idProveedor INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    cuit CHAR(11) NOT NULL,
    razonSocial VARCHAR(64) NOT NULL,
    nombreContacto VARCHAR(64),
    calle VARCHAR(64),
    numCalle MEDIUMINT UNSIGNED,
    observaciones VARCHAR(256),
    email VARCHAR(64),
    telefono VARCHAR(15),
    activo BIT NOT NULL,
    PRIMARY KEY (idProveedor)
);

CREATE TABLE Solicitudes(
	idSolicitud INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idEstadoSolicitud TINYINT UNSIGNED NOT NULL,
    idTipoSolicitud TINYINT UNSIGNED NOT NULL,
    nombreSolicitante VARCHAR(64) NOT NULL,
    razonSocial VARCHAR(64) NOT NULL,
    telefonoContacto VARCHAR(15) NOT NULL,
    emailContacto VARCHAR(64) NOT NULL,
    comentario VARCHAR(512),
    fechaSolicitud DATETIME NOT NULL,
	fechaAprobacion DATETIME,
    tokenCancel CHAR(36) NOT NULL,
    PRIMARY KEY (idSolicitud),
    FOREIGN KEY (idEstadoSolicitud) REFERENCES EstadosSolicitud(idEstado),
    FOREIGN KEY (idTipoSolicitud) REFERENCES TiposSolicitud(idTipo)
);

CREATE TABLE Presupuestos(
	idPresupuesto INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idTipoPresupuesto TINYINT UNSIGNED NOT NULL,
    razonSocial VARCHAR(64) NOT NULL,
    cuit CHAR(11) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    nombreContacto VARCHAR(64) NOT NULL,
    fechaCreacion DATE NOT NULL,
    observaciones VARCHAR(512),
    diasValidez SMALLINT UNSIGNED,
    porcentajeImpuestos DECIMAL(3,1) NOT NULL,
    token CHAR(36) NOT NULL,
    PRIMARY KEY (idPresupuesto),
    FOREIGN KEY (idTipoPresupuesto) REFERENCES TiposPresupuesto(idTipo)
);

CREATE TABLE DetallesPresupuesto(
	idDetalle INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idPresupuesto INT UNSIGNED NOT NULL,
    descripcion VARCHAR(512) NOT NULL,
    plazoEntrega SMALLINT UNSIGNED,
    cantidad SMALLINT UNSIGNED NOT NULL,
    precioUnitario DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (idDetalle),
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuestos(idPresupuesto)
);

CREATE TABLE SolicitudesRepuesto(
	idSolicitudRepuesto INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idSolicitud INT UNSIGNED NOT NULL,
    idPresupuesto INT UNSIGNED,
    PRIMARY KEY (idSolicitudRepuesto),
    FOREIGN KEY (idSolicitud) REFERENCES Solicitudes(idSolicitud),
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuestos(idPresupuesto)
);

CREATE TABLE DetallesRepuesto(
	idDetalle INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idSolicitudRepuesto INT UNSIGNED NOT NULL,
	marca VARCHAR(32) NOT NULL,
    modelo VARCHAR(64) NOT NULL,
    serie VARCHAR(20) NOT NULL,
    codigoRepuesto VARCHAR(20),
    cantidad SMALLINT UNSIGNED NOT NULL,
    descripcionRepuesto VARCHAR(64) NOT NULL,
    PRIMARY KEY (idDetalle),
    FOREIGN KEY (idSolicitudRepuesto) REFERENCES SolicitudesRepuesto(idSolicitudRepuesto)
);

CREATE TABLE ProductosOferta(
	idProducto INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idTipoProducto TINYINT UNSIGNED NOT NULL,
	nombre VARCHAR(64) NOT NULL,
    descripcion VARCHAR(256),
    precio DECIMAL(12,2) NOT NULL,
    codigoParte VARCHAR(20),
    activo BIT NOT NULL,
    PRIMARY KEY (idProducto),
    FOREIGN KEY (idTipoProducto) REFERENCES TiposProducto(idTipo)
);

CREATE TABLE Ofertas(
	idOferta INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(64) NOT NULL,
    descripcion VARCHAR(256),
    precio DECIMAL(12,2) NOT NULL,
	fechaInicio DATETIME NOT NULL,
	fechaFin DATETIME NOT NULL,
    vendida BIT NOT NULL,
    PRIMARY KEY (idOferta)
);

CREATE TABLE SolicitudesCompra(
	idSolicitudCompra INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idSolicitud INT UNSIGNED NOT NULL,
    idOferta INT UNSIGNED NOT NULL,
	idPresupuesto INT UNSIGNED,
    PRIMARY KEY (idSolicitudCompra),
    FOREIGN KEY (idOferta) REFERENCES Ofertas(idOferta),
    FOREIGN KEY (idSolicitud) REFERENCES Solicitudes(idSolicitud),
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuestos(idPresupuesto)
);

CREATE TABLE DetallesOferta(
	idDetalle INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idProducto INT UNSIGNED NOT NULL,
	idOferta INT UNSIGNED NOT NULL,
    cantidad SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (idDetalle),
    FOREIGN KEY (idProducto) REFERENCES ProductosOferta(idProducto),
    FOREIGN KEY (idOferta) REFERENCES Ofertas(idOferta)
);

CREATE TABLE Servicios(
	idServicio INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
	idPresupuesto INT UNSIGNED,
    idSolicitud INT UNSIGNED NOT NULL,
    idTipoServicio TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (idServicio),
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuestos(idPresupuesto),
    FOREIGN KEY (idSolicitud) REFERENCES Solicitudes(idSolicitud),
    FOREIGN KEY (idTipoServicio) REFERENCES TiposServicio(idTipo)
);

CREATE TABLE DetallesServicio(
	idDetalle INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idServicio INT UNSIGNED NOT NULL,
	idTipoMaquina TINYINT UNSIGNED NOT NULL,
	marcaMaquina VARCHAR(32) NOT NULL,
    modeloMaquina VARCHAR(64) NOT NULL,
    serieMaquina VARCHAR(20) NOT NULL,
    cantidadMaquinas MEDIUMINT UNSIGNED NOT NULL,
    PRIMARY KEY (idDetalle),
    FOREIGN KEY (idServicio) REFERENCES Servicios(idServicio),
    FOREIGN KEY (idTipoMaquina) REFERENCES TiposMaquina(idTipo)
);

CREATE TABLE MaquinasAlquiladas(
	idMaquinaAlq INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idTipoMaquina TINYINT UNSIGNED NOT NULL,
	marcaMaquina VARCHAR(32) NOT NULL,
    modeloMaquina VARCHAR(64) NOT NULL,
    serieMaquina VARCHAR(20) NOT NULL,
    alturaTorre SMALLINT UNSIGNED,
    capacidadCarga MEDIUMINT UNSIGNED NOT NULL,
    PRIMARY KEY (idMaquinaAlq),
    FOREIGN KEY (idTipoMaquina) REFERENCES TiposMaquina(idTipo)
);

CREATE TABLE Alquileres(
	idAlquiler INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idSolicitud INT UNSIGNED NOT NULL,
	idPresupuesto INT UNSIGNED,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    PRIMARY KEY (idAlquiler),
    FOREIGN KEY (idSolicitud) REFERENCES Solicitudes(idSolicitud),
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuestos(idPresupuesto)
);

CREATE TABLE DetallesAlquiler(
	idDetalle INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    idAlquiler INT UNSIGNED NOT NULL,
	idMaquinaAlq INT UNSIGNED NOT NULL,
    subtotal DECIMAL(12,2),
    PRIMARY KEY (idDetalle),
    FOREIGN KEY (idAlquiler) REFERENCES Alquileres(idAlquiler),
    FOREIGN KEY (idMaquinaAlq) REFERENCES MaquinasAlquiladas(idMaquinaAlq)
);

## Sesiones

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB;