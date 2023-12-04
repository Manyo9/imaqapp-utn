import mysqlConnection from '../connection/connection';
import { RentalDetailNewDTO, RentalNewDTO } from '../types';

export const newRental = (rental: RentalNewDTO): Promise<any> => {
    const query = 'call spNuevoAlquiler(?,?,?)';
    const param = [rental.idSolicitud, rental.fechaInicio, rental.fechaFin];

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

export const newRentalDetail = (rentalDetail: RentalDetailNewDTO): Promise<any> => {
    const query = 'call spNuevoDetalleAlquiler(?,?)';
    const param = [rentalDetail.idAlquiler, rentalDetail.idMaquinaAlq];

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

export const rentalByRequest = (idSolicitud: number): Promise<any> => {
    const query = 'call spAlquilerPorSolicitud(?)';
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

export const detailsByRentalID = (idAlquiler: number): Promise<any> => {
    const query = 'call spDetallesAlquilerPorID(?)';
    const param = [idAlquiler];

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