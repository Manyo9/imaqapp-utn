export interface User {
    idUsuario: number,
    usuario: string,
    password: string,
    email: string,
    nombre: string,
    apellido: string,
    idRol: number,
    fechaAlta: Date,
    fechaBaja?: Date
    rol?: string
}

export type UserListDTO = Omit<User, 'password' | 'idRol' | 'fechaAlta'>
export type UserReadIDDTO = Omit<User, 'password'>
export type UserNewDTO = Omit<User, 'idUsuario' | 'idRol' | 'rol' | 'fechaAlta' | 'fechaBaja'>
export type UserEditDTO = Pick<User, 'idUsuario' | 'nombre' | 'apellido' | 'email'>

export interface Product {
    idProducto: number,
    idTipoProducto: number,
    tipoProducto?: string,
    nombre: string,
    descripcion?: string,
    precio: number,
    codigoParte?: string,
    activo: boolean
}

export type ProductListDTO = Omit<Product, 'idTipoProducto'>
export type ProductEditDTO = Omit<Product, 'tipoProducto'>
export type ProductNewDTO = Pick<Product, 'idTipoProducto' | 'nombre' | 'descripcion' | 'precio' | 'codigoParte'>

export interface Supplier {
    idProveedor: number,
    cuit: string,
    razonSocial: string,
    nombreContacto: string,
    calle: string,
    numCalle: number,
    observaciones: string,
    email: string,
    telefono: number,
    activo: boolean
}

export type SupplierListDTO = Omit<Supplier, 'calle' | 'numCalle' | 'observaciones'>
export type SupplierNewDTO = Omit<Supplier, 'idProveedor' | 'activo'>
export type SupplierEditDTO = Pick<Supplier, 'idProveedor' | 'cuit' | 'razonSocial' |
    'nombreContacto' | 'calle' | 'numCalle' | 'observaciones' | 'email' | 'telefono' | 'activo'>;

export interface TypeGeneric {
    idTipo: number,
    nombre: string
}

export interface StatusGeneric {
    idEstado: number,
    nombre: string
}

export interface Machine {
    idMaquinaAlq: number,
    idTipoMaquina: number,
    tipoMaquina?: string,
    marcaMaquina: string,
    modeloMaquina: string,
    serieMaquina: string,
    alturaTorre?: number,
    capacidadCarga: number
}

export type MachineNewDTO = Omit<Machine, 'idMaquinaAlq' | 'tipoMaquina'>
export type MachineEditDTO = Omit<Machine, 'tipoMaquina'>
export type MachineRentableDTO = Pick<Machine, 'idMaquinaAlq' | 'tipoMaquina' | 'alturaTorre' | 'capacidadCarga'>
export type MachineListDTO = Omit<Machine, 'idTipoMaquina'>

export interface RequestB {
    idSolicitud: number,
    idEstadoSolicitud: number,
    estadoSolicitud?: string,
    idTipoSolicitud: number,
    tipoSolicitud?: string,
    nombreSolicitante: string,
    razonSocial: string,
    telefonoContacto: string,
    emailContacto: string,
    comentario?: string,
    fechaSolicitud: Date,
    fechaAprobacion?: Date,
    tokenCancel: string
}

export type RequestNewDTO = Pick<RequestB, 'nombreSolicitante' | 'razonSocial' | 'telefonoContacto' |
    'emailContacto' | 'comentario' | 'tokenCancel'>;
export type RequestCancelDTO = Pick<RequestB, 'idSolicitud' | 'tokenCancel'>;
export type RequestStatusDTO = Pick<RequestB, 'idSolicitud' | 'idEstadoSolicitud'>;
export type RequestListDTO = Pick<RequestB, 'idSolicitud' | 'estadoSolicitud' | 'tipoSolicitud' | 'razonSocial' |
    'fechaSolicitud' | 'fechaAprobacion'>;
export type RequestIDDTO = Omit<RequestB, 'idTipoSolicitud' | 'tokenCancel'>;

export interface Rental {
    idAlquiler: number,
    idSolicitud: number,
    idPresupuesto?: number,
    fechaInicio: Date,
    fechaFin: Date
}

export type RentalNewDTO = Pick<Rental, 'idSolicitud' | 'fechaInicio' | 'fechaFin'>


export interface RentalDetail {
    idDetalle: number,
    idAlquiler: number,
    idMaquinaAlq: number,
    subtotal?: number
}

export type RentalDetailNewDTO = Pick<RentalDetail, 'idAlquiler' | 'idMaquinaAlq'>

export interface PurchaseRequest {
    idSolicitudCompra: number,
    idSolicitud: number,
    idOferta: number,
    idPresupuesto?: number
}

export type PurchaseRequestNewDTO = Pick<PurchaseRequest, 'idSolicitud' | 'idOferta'>;
export type PurchaseRequestIDDTO = Omit<PurchaseRequest, 'idSolicitud'>;

export interface Offer {
    idOferta: number,
    nombre: string,
    descripcion?: string,
    precio: number,
    fechaInicio: Date,
    fechaFin: Date,
    vendida: boolean
}

export type OfferNewDTO = Omit<Offer, 'idOferta' | 'vendida'>;
export type OfferEditDTO = Omit<Offer, 'vendida'>;

export interface OfferDetail {
    idDetalle: number,
    idProducto: number,
    idOferta: number,
    cantidad: number
}

export type OfferDetailNewDTO = Pick<OfferDetail, 'idProducto' | 'idOferta' | 'cantidad'>;

export interface OfferDetailIDDTO {
    idDetalle: number,
    idProducto: number,
    tipoProducto: string,
    nombreProducto: string,
    descripcionProducto: string,
    codigoProducto: string,
    precioUnitario: number,
    cantidad: number
}

export interface Service {
    idServicio: number,
    idPresupuesto?: number,
    idSolicitud: number,
    idTipoServicio: number,
    tipoServicio?: string
}

export type ServicesNewDTO = Pick<Service, 'idTipoServicio' | 'idSolicitud'>

export interface ServiceDetail {
    idDetalle: number,
    idServicio: number,
    idTipoMaquina: number,
    tipoMaquina?: string,
    marcaMaquina: string,
    modeloMaquina: string,
    serieMaquina: string,
    cantidadMaquinas: number
}

export type ServiceDetailNewDTO = Omit<ServiceDetail, 'idDetalle' | 'tipoMaquina'>
export type ServiceDetailNewFrontDTO = Omit<ServiceDetail, 'idDetalle' | 'idServicio' | 'tipoMaquina'>

export interface SparePartR {
    idSolicitudRepuesto: number,
    idSolicitud: number,
    idPresupuesto?: number
}

export type SparePartNewDTO = Pick<SparePartR, 'idSolicitud'>

export interface SparePartDetail {
    idDetalle: number,
    idSolicitudRepuesto: number,
    marca: string,
    modelo: string,
    serie: string,
    codigoRepuesto?: string,
    cantidad: number,
    descripcionRepuesto: string
};

export type SparePartDetailNewDTO = Omit<SparePartDetail, 'idDetalle'>;

export interface Invoice {
    idPresupuesto: number;
    idTipoPresupuesto: number;
    razonSocial: string;
    cuit: string;
    direccion: string;
    nombreContacto: string;
    fechaCreacion: Date;
    observaciones?: string;
    diasValidez?: number;
    porcentajeImpuestos: number;
};

export type InvoiceNewDTO = Omit<Invoice, 'idPresupuesto'>

export interface InvoiceDetail {
    idDetalle: number;
    idPresupuesto: number;
    descripcion: string;
    plazoEntrega?: number;
    cantidad: number;
    precioUnitario: number;
};

export type InvoiceDetailNewDTO = Omit<InvoiceDetail, 'idDetalle'>