import mysqlConnection from '../connection/connection';
import { ServiceDetailNewDTO, ServicesNewDTO } from '../types';

export const newService = (service: ServicesNewDTO): Promise<any> => {
    const query = 'call spNuevoServicio(?,?)';
    const param = [service.idTipoServicio, service.idSolicitud];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const newServiceDetail = (sd: ServiceDetailNewDTO): Promise<any> => {
    const query = 'call spNuevoDetalleServicio(?,?,?,?,?,?)';
    const param = [sd.idServicio, sd.idTipoMaquina, sd.marcaMaquina,
         sd.modeloMaquina, sd.serieMaquina, sd.cantidadMaquinas];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const serviceByRequest = (idSolicitud: number): Promise<any> => {
    const query = 'call spServicioPorSolicitud(?)';
    const param = [idSolicitud];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const detailsByServiceID = (idServicio: number): Promise<any> => {
    const query = 'call spDetallesServicioPorID(?)';
    const param = [idServicio];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};