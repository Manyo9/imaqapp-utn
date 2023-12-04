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
export type RequestNewFrontDTO = Pick<RequestB, 'nombreSolicitante' | 'razonSocial' | 'telefonoContacto' |
    'emailContacto' | 'comentario'>;
export type RequestCancelDTO = Pick<RequestB, 'idSolicitud' | 'tokenCancel'>;
export type RequestStatusDTO = Pick<RequestB, 'idSolicitud' | 'idEstadoSolicitud'>;
export type RequestListDTO = Pick<RequestB, 'idSolicitud' | 'estadoSolicitud' | 'tipoSolicitud' | 'razonSocial' |
    'fechaSolicitud' | 'fechaAprobacion'>;
export type RequestIDDTO = Omit<RequestB, 'idTipoSolicitud' | 'tokenCancel'>;
export type RequestTokenDTO = Pick<RequestB, 'idSolicitud' | 'estadoSolicitud' | 'tipoSolicitud' | 'nombreSolicitante' | 'razonSocial'>