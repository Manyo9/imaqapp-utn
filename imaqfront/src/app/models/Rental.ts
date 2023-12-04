export interface Rental {
    idAlquiler: number,
    idSolicitud: number,
    idPresupuesto?: number,
    fechaInicio: string,
    fechaFin: string
}

export type RentalNewDTO = Pick<Rental, 'idSolicitud' | 'fechaInicio' | 'fechaFin'>
export type RentalNewFrontDTO = Pick<Rental, 'fechaInicio' | 'fechaFin'>
export type RentalIDDTO = Omit<Rental, 'idSolicitud'>

export interface RentalDetail {
    idDetalle: number,
    idAlquiler: number,
    idMaquinaAlq: number,
    subtotal?: number
}

export type RentalDetailNewDTO = Pick<RentalDetail, 'idAlquiler' | 'idMaquinaAlq'>
export type RentalDetailNewFrontDTO = Pick<RentalDetail, 'idMaquinaAlq'>

export interface RentalDetailIDDTO {
    idDetalle: number,
    idMaquinaAlq: number,
    marcaMaquina: string,
    modeloMaquina: string,
    serieMaquina: string,
    alturaTorre: number,
    capacidadCarga: number,
    subtotal: number
}