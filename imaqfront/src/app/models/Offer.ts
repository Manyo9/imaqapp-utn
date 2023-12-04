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
    fechaInicio: string,
    fechaFin: string,
    vendida: boolean
}

export type OfferListFrontDTO = Omit<Offer, 'fechaInicio' | 'vendida'>;
export type OfferEditDTO = Omit<Offer, 'vendida'>;
export type OfferNewDTO = Omit<Offer, 'idOferta' | 'vendida'>;
export type OfferShortDTO = Pick<Offer, 'nombre' | 'descripcion' | 'precio' | 'fechaFin'>

export interface OfferDetail {
    idDetalle: number,
    idProducto: number,
    idOferta: number,
    cantidad: number
}

export type OfferDetailNewDTO = Pick<OfferDetail, 'idProducto' | 'idOferta' | 'cantidad'>;
export type OfferDetailNewFrontDTO = Pick<OfferDetail, 'idProducto' | 'cantidad'>;

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

export type OfferDetailIDShortDTO = Pick<OfferDetailIDDTO, 'nombreProducto' | 'tipoProducto' | 'descripcionProducto' | 'codigoProducto'>