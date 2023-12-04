export interface Invoice {
    idPresupuesto: number;
    idTipoPresupuesto: number;
    tipoPresupuesto?: string;
    razonSocial: string;
    cuit: string;
    direccion: string;
    nombreContacto: string;
    fechaCreacion: string;
    observaciones?: string;
    diasValidez?: number;
    porcentajeImpuestos: number;
};

export type InvoiceNewDTO = Omit<Invoice, 'idPresupuesto' | 'tipoPresupuesto'>
export type InvoiceIDDTO = Omit<Invoice, 'idTipoPresupuesto'>

export interface InvoiceDetail {
    idDetalle: number;
    idPresupuesto: number;
    descripcion: string;
    plazoEntrega?: number;
    cantidad: number;
    precioUnitario: number;
};

export type InvoiceDetailNewDTO = Omit<InvoiceDetail, 'idDetalle'>
export type InvoiceDetailNewFrontDTO = Omit<InvoiceDetail, 'idDetalle' | 'idPresupuesto'>
export type InvoiceDetailIDDTO = Omit<InvoiceDetail, 'idDetalle' | 'idPresupuesto'>