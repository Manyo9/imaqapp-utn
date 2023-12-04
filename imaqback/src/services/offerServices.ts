import mysqlConnection from "../connection/connection";
import { OfferDetailNewDTO, OfferEditDTO, OfferNewDTO } from "../types";

export const createOffer = (offer: OfferNewDTO): Promise<any> => {
    const query = 'call spNuevaOferta(?,?,?,?,?)';
    const param = [offer.nombre, offer.descripcion, offer.precio,
                     offer.fechaInicio, offer.fechaFin];

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

export const newOfferDetail = (offerDetail: OfferDetailNewDTO): Promise<any> => {
    const query = 'call spNuevoDetalleOferta(?,?,?)';
    const param = [offerDetail.idOferta, offerDetail.idProducto, offerDetail.cantidad];

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

export const getAll = (vigentes: string): Promise<any> => {
    const query = 'call spListarOfertas(?)';
    const params = [vigentes == 'true' ? 1 : 0]

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, params, (error, response) => {
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

export const getCurrent = (): Promise<any> => {
    const query = 'call spListarOfertasVigentes()';

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, (error, response) => {
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

export const getById = (id: number): Promise<any> => {
    const query = 'call spOfertaPorID(?)';
    const params = [id];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, params, (error, response) => {
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

export const getByIdShort = (id: number): Promise<any> => {
    const query = 'call spOfertaReducidaPorID(?)';
    const params = [id];

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, params, (error, response) => {
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

export const editOffer = (offer: OfferEditDTO): Promise<any> => {
    const query = 'call spEditarOferta(?,?,?,?,?,?)'
    const param = [offer.idOferta, offer.nombre, offer.descripcion, offer.precio,
    offer.fechaInicio, offer.fechaFin]

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                    console.log(error);
                } else {
                    resolve(response);
                }
            });
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

export const sellOffer = (id: number): Promise<any> => {
    const query = 'call spMarcarOfertaVendida(?)'
    const param = [id]

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, param, (error, response) => {
                if (error) {
                    reject(error);
                    console.log(error);
                } else {
                    resolve(response);
                }
            });
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

export const markAsSold = (id: number): Promise<any> => {
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

            await sellOffer(id);

            mysqlConnection.commit((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción commiteada.');
                }
            });
            resolve({message: 'La oferta se marcó como vendida con éxito.'})
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

export const getAllDetails = (idOferta: number): Promise<any> => {
    const query = 'call spDetallesOfertaPorID(?)';
    const param = [idOferta];

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

export const getAllDetailsShort = (idOferta: number): Promise<any> => {
    const query = 'call spDetallesReducidosOfertaPorID(?)';
    const param = [idOferta];

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

export const newOffer = async (offer: OfferNewDTO, details: OfferDetailNewDTO[]): Promise<any> => {
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

            const firstResult = await createOffer(offer);
            const idof = firstResult[0][0].lastId;

            if (!idof) {
                mysqlConnection.rollback((e) => {
                    if (e) {
                        console.error(e);
                    } else {
                        console.log('Transacción rollbackeada');
                    }
                });
                reject("No se pudo crear la oferta.");
                return;
            }

            for (const detail of details) {
                detail.idOferta = idof;
                await newOfferDetail(detail);
            }

            mysqlConnection.commit((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción commiteada.');
                }
            });
            resolve('Exito al crear la oferta.')
            
        } catch (error) {
            mysqlConnection.rollback((e) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log('Transacción rollbackeada.');
                }
            });
            reject(error);
        }
    })
}

export const cancelOffer = (idOferta: number): Promise<any> => {
    const query = 'CALL spCancelarOferta (?)';
    const param = [idOferta];

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

export const getPurchaseByRequest = (idSolicitud: number): Promise<any> => {
    const query = 'CALL spSolicitudCompraPorIDSolicitud(?)';
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