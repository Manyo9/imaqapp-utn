import { InvoiceDetailNewDTO, InvoiceNewDTO } from "../types";
import mysqlConnection from "../connection/connection";
import crypto from 'crypto';

export const createInvoice = (i: InvoiceNewDTO): Promise<any> => {

    const token = crypto.randomUUID();
    const query = 'call spNuevoPresupuesto(?,?,?,?,?,?,?,?,?,?)';
    const param = [i.idTipoPresupuesto, i.razonSocial, i.cuit,
        i.direccion, i.nombreContacto, i.fechaCreacion, i.observaciones,
        i.diasValidez, i.porcentajeImpuestos, token];

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
};

export const newInvoiceDetail = (detail: InvoiceDetailNewDTO): Promise<any> => {
    const query = 'call spNuevoDetallePresupuesto(?,?,?,?,?)';
    const param = [detail.idPresupuesto, detail.descripcion,
         detail.plazoEntrega, detail.cantidad, detail.precioUnitario];

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

export const linkInvoice = (idPresupuesto: number, idSolicitud: number): Promise<any> => {
    const query = 'call spAsociarPresupuesto(?,?)';
    const param = [idPresupuesto, idSolicitud];

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


export const newInvoice = async (invoice: InvoiceNewDTO, details: InvoiceDetailNewDTO[], idSolicitud: number): Promise<any> => {
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

            const firstResult = await createInvoice(invoice);
            const idpre = firstResult.response[0][0].lastId;

            if (!idpre) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada');
                    }
                });
                reject({message:"No se pudo crear el presupuesto."});
                return;
            }

            for (const detail of details) {
                detail.idPresupuesto = idpre;
                await newInvoiceDetail(detail);
            }

            const changed = await linkInvoice(idpre, idSolicitud)
            if(changed == 0){
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada');
                    }
                });
                reject({message:"No se pudo crear el presupuesto."});
                return;
            }

            mysqlConnection.commit((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción commiteada.');
                }
            });
            resolve({message: 'Presupuesto creado con éxito', token: firstResult.token})

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

export const fillInvoiceByRequest = (idSolicitud: number): Promise<any> => {
    const query = 'call spRellenarPresupuesto(?)';
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

export const fillInvoiceDetailsByRequest = (idSolicitud: number): Promise<any> => {
    const query = 'call spRellenarDetallesPresupuesto(?)';
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

export const invoiceIdByToken = (token: string): Promise<any> => {
    const query = 'call spPresupuestoIDPorToken(?)';
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
};

export const getInvoiceByID = (idPresupuesto: number): Promise<any> => {
    const query = 'call spPresupuestoPorID(?)';
    const param = [idPresupuesto];

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

export const getDetailsByID = (idPresupuesto: number): Promise<any> => {
    const query = 'call spDetallesPresupuestoPorID(?)';
    const param = [idPresupuesto];

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

export const acceptBudget = (token: string, accepted: string): Promise<any> => {
    const query = 'call spAceptarPresupuesto(?,?)';
    const param = [token, accepted == 'true' ? 1 : 0];

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