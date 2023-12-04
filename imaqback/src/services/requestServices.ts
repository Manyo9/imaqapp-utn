import mysqlConnection from '../connection/connection';
import { RentalDetailNewDTO, RentalNewDTO, RequestNewDTO, ServiceDetailNewDTO, ServicesNewDTO, SparePartDetailNewDTO, SparePartNewDTO } from '../types';
import crypto from 'crypto';
import * as rentalService from '../services/rentalServices';
import * as serviceService from '../services/serviceServices';
import * as sparePartsService from '../services/sparePartsService'

export const createRentalRequest = (request: RequestNewDTO): Promise<any> => {
    const token = crypto.randomUUID();

    const query = 'call spNuevaSolicitudAlquiler(?,?,?,?,?,?)';
    const param = [request.nombreSolicitante, request.razonSocial,
    request.telefonoContacto, request.emailContacto, request.comentario, token];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({response: response, token: token});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const createServiceRequest = (request: RequestNewDTO): Promise<any> => {
    const token = crypto.randomUUID();

    const query = 'call spNuevaSolicitudServicio(?,?,?,?,?,?)';
    const param = [request.nombreSolicitante, request.razonSocial,
    request.telefonoContacto, request.emailContacto, request.comentario, token];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({response: response, token: token});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const createOfferRequest = (request: RequestNewDTO): Promise<any> => {
    // esta crea la solicitud en sí.
    const token = crypto.randomUUID();

    const query = 'call spNuevaSolicitudOferta(?,?,?,?,?,?)';
    const param = [request.nombreSolicitante, request.razonSocial,
        request.telefonoContacto, request.emailContacto, request.comentario, token];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({response: response, token: token});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const createSparePartRequest = (request: RequestNewDTO): Promise<any> => {
    const token = crypto.randomUUID();

    const query = 'call spNuevaSolicitudRepuestos(?,?,?,?,?,?)';
    const param = [request.nombreSolicitante, request.razonSocial,
    request.telefonoContacto, request.emailContacto, request.comentario, token];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({response: response, token: token});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const createPurchaseRequest = (idSolicitud: number, idOferta: number): Promise<any> => {

    const query = 'call spNuevaSolicitudCompra(?,?)';
    const param = [idSolicitud, idOferta];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({response: response});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const newRentalRequest = async (request: RequestNewDTO, rental: RentalNewDTO, details: RentalDetailNewDTO[]): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            mysqlConnection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            mysqlConnection.beginTransaction((error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('Transaccion comenzada con éxito.');
                }
            });

            const firstResult = await createRentalRequest(request);
            const idsol = firstResult.response[0][0].lastId;

            if (!idsol) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada');
                    }
                });
                reject({message:"No se pudo crear la solicitud."});
                return;
            }

            rental.idSolicitud = idsol;
            const secondResult = await rentalService.newRental(rental);
            const idalq = secondResult[0][0].lastId;

            if (!idalq) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada.');
                    }
                });
                reject({message:"No se pudo crear el alquiler."});
                return;
            }

            for (const detail of details) {
                detail.idAlquiler = idalq;
                await rentalService.newRentalDetail(detail);
            }

            mysqlConnection.commit((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción commiteada.');
                }
            });
            resolve({message: 'Solicitud de alquiler creada con éxito', token: firstResult.token, id: idsol})

        } catch (error) {
            mysqlConnection.rollback((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción rollbackeada.');
                }
            });
            reject({message: error});
        }
    })
}

export const newOfferRequest = async (request: RequestNewDTO, idOferta: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            mysqlConnection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            mysqlConnection.beginTransaction((error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('Transaccion comenzada con éxito.');
                }
            });

            const firstResult = await createOfferRequest(request);
            const idsol = firstResult.response[0][0].lastId;

            if (!idsol) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada');
                    }
                });
                reject({message:"No se pudo crear la solicitud."});
                return;
            }

            const secondResult = await createPurchaseRequest(idsol, idOferta);

            mysqlConnection.commit((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción commiteada.');
                }
            });
            resolve({message: 'Solicitud de compra creada con éxito', token: firstResult.token, id: idsol})

        } catch (error) {
            mysqlConnection.rollback((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción rollbackeada.');
                }
            });
            reject({message: error});
        }
    })
}

export const newServiceRequest = async (request: RequestNewDTO, service: ServicesNewDTO, details: ServiceDetailNewDTO[]): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            mysqlConnection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            mysqlConnection.beginTransaction((error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('Transaccion comenzada con éxito.');
                }
            });

            const firstResult = await createServiceRequest(request);
            const idsol = firstResult.response[0][0].lastId;

            if (!idsol) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada');
                    }
                });
                reject({message:"No se pudo crear la solicitud."});
                return;
            }

            service.idSolicitud = idsol;
            const secondResult = await serviceService.newService(service);
            const idserv = secondResult[0][0].lastId;

            if (!idserv) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada.');
                    }
                });
                reject({message:"No se pudo crear el alquiler."});
                return;
            }

            for (const detail of details) {
                detail.idServicio = idserv;
                await serviceService.newServiceDetail(detail);
            }

            mysqlConnection.commit((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción commiteada.');
                }
            });
            resolve({message: 'Solicitud de servicio creada con éxito', token: firstResult.token, id: idsol})

        } catch (error) {
            mysqlConnection.rollback((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción rollbackeada.');
                }
            });
            reject({message: error});
        }
    })
}

export const newSparePartRequest = async (request: RequestNewDTO, details: SparePartDetailNewDTO[]): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            mysqlConnection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            mysqlConnection.beginTransaction((error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('Transaccion comenzada con éxito.');
                }
            });

            const firstResult = await createSparePartRequest(request);
            const idsol = firstResult.response[0][0].lastId;

            if (!idsol) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada');
                    }
                });
                reject({message:"No se pudo crear la solicitud."});
                return;
            }

            let spr: SparePartNewDTO = {idSolicitud: idsol}
            const secondResult = await sparePartsService.createSparePartRequestObject(spr);
            const idsr = secondResult[0][0].lastId;

            if (!idsr) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada.');
                    }
                });
                reject({message:"No se pudo crear el alquiler."});
                return;
            }

            for (const detail of details) {
                detail.idSolicitudRepuesto = idsr;
                await sparePartsService.newSparePartDetail(detail);
            }

            mysqlConnection.commit((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción commiteada.');
                }
            });
            resolve({message: 'Solicitud de servicio creada con éxito', token: firstResult.token, id: idsol})

        } catch (error) {
            mysqlConnection.rollback((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción rollbackeada.');
                }
            });
            reject({message: error});
        }
    })
}

export const getAllFiltered = (page: number, idEstadoSolicitud?: number,
    idTipoSolicitud?: number, razonSocial?: string, ): Promise<any> => {
    return new Promise((resolve, reject) => {
        const filters = [];
        const values = [];

        let query = `
          SELECT s.idSolicitud, es.nombre AS estadoSolicitud, ts.nombre AS tipoSolicitud,
          s.razonSocial, s.fechaSolicitud, s.fechaAprobacion
          FROM Solicitudes s
          JOIN EstadosSolicitud es ON es.idEstado = s.idEstadoSolicitud
          JOIN TiposSolicitud ts ON ts.idTipo = s.idTipoSolicitud
        `;

        if (idEstadoSolicitud !== undefined && idEstadoSolicitud !== 0) {
            filters.push('s.idEstadoSolicitud = ?');
            values.push(idEstadoSolicitud);
        }

        if (idTipoSolicitud !== undefined && idTipoSolicitud !== 0) {
            filters.push('s.idTipoSolicitud = ?');
            values.push(idTipoSolicitud);
        }

        if (razonSocial !== undefined && razonSocial !== '') {
            filters.push('s.razonSocial LIKE ?');
            values.push(`${razonSocial}%`);
        }

        if (filters.length > 0) {
            query += ' WHERE ' + filters.join(' AND ');
        }

        query += ' ORDER BY s.fechaSolicitud DESC LIMIT ?, ?';

        const limit = 10;
        const offset = (page - 1) * limit;
        values.push(offset, limit);

        mysqlConnection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export const getById = (id: number): Promise<any> => {

    const query = 'call spSolicitudPorID(?)';
    const param = [id];

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
}

export const getByToken = (token: string): Promise<any> => {

    const query = 'call spSolicitudPorToken(?)';
    const param = [token];

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
}

export const cancelRequest = (token: string): Promise<any> => {

    const query = 'call spCancelarSolicitudToken(?)';
    const param = [token];

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
}

export const updateStatus = (idSolicitud: number, idEstado: number): Promise<any> => {

    const query = 'call spActualizarEstado(?,?)';
    const param = [idSolicitud, idEstado];

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
}