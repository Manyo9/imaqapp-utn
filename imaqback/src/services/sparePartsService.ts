import mysqlConnection from '../connection/connection';
import { SparePartDetailNewDTO, SparePartNewDTO } from '../types';

export const createSparePartRequestObject = (spr: SparePartNewDTO): Promise<any> => {
    const query = 'call spCrearSolicitudRepuesto(?)';
    const param = [spr.idSolicitud];

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

export const newSparePartDetail = (spd:SparePartDetailNewDTO): Promise<any> => {
    const query = 'call spNuevoDetalleRepuesto(?,?,?,?,?,?,?)';
    const param = [spd.idSolicitudRepuesto, spd.marca, spd.modelo, spd.serie,
        spd.codigoRepuesto, spd.cantidad, spd.descripcionRepuesto];

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

export const sparePartRequestByRequest = (idSolicitud: number): Promise<any> => {
    const query = 'call spRepuestosPorSolicitud(?)';
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

export const detailsBySparePartRequestID = (idSolicitudRepuesto: number): Promise<any> => {
    const query = 'call spDetallesRepuestoPorID(?)';
    const param = [idSolicitudRepuesto];

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