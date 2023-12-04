export interface SparePartR {
    idSolicitudRepuesto: number,
    idSolicitud: number,
    idPresupuesto?: number
}

export type SparePartNewDTO = Pick<SparePartR, 'idSolicitud'>
export type SparePartIDDTO = Omit<SparePartR, 'idSolicitud'>

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
export type SparePartDetailNewFrontDTO = Omit<SparePartDetail, 'idDetalle' | 'idSolicitudRepuesto'>;
export type SparePartDetailIDDTO = Omit<SparePartDetail, 'idSolicitudRepuesto'>;