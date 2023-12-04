export interface Service {
    idServicio: number,
    idPresupuesto?: number,
    idSolicitud: number,
    idTipoServicio: number
    tipoServicio?: string
}

export type ServicesNewDTO = Pick<Service, 'idTipoServicio' | 'idSolicitud'>;
export type ServicesNewFrontDTO = Pick<Service, 'idTipoServicio'>;
export type ServicesIDDTO = Pick<Service, 'idServicio' | 'idPresupuesto' | 'tipoServicio'>;

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
export type ServiceDetailIDDTO = Pick<ServiceDetail, 'idDetalle' | 'tipoMaquina' | 'marcaMaquina' | 'modeloMaquina' |
                                                    'serieMaquina' | 'cantidadMaquinas'>