import mysqlConnection from "../connection/connection";
import { SupplierEditDTO, SupplierNewDTO } from "../types";

export const addSupplier = (supplier: SupplierNewDTO): Promise<any> => {
    const query = 'call spNuevoProveedor(?,?,?,?,?,?,?,?)'
    const param = [supplier.cuit, supplier.razonSocial, supplier.nombreContacto, supplier.calle,
    supplier.numCalle, supplier.observaciones, supplier.email, supplier.telefono]

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

export const getAllSuppliers = (deleted: string): Promise<any> => {
    const query = 'CALL spListarProveedores(?)'
    const params = [deleted == 'true' ? 1 : 0]

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, params, (error, response) => {
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

export const getById = (id: number): Promise<any> => {
    const query = 'call spProveedorPorID(?)';
    const param = [id];

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

export const editSupplier = (supplier: SupplierEditDTO): Promise<any> => {
    const query = 'call spEditarProveedor(?,?,?,?,?,?,?,?,?,?)';
    const param = [supplier.idProveedor, supplier.cuit, supplier.razonSocial,
    supplier.nombreContacto, supplier.calle, supplier.numCalle,
    supplier.observaciones, supplier.email, supplier.telefono, supplier.activo];

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

export const deleteSupplier = (id: number): Promise<any> => {
    const query = 'call spEliminarProveedor(?)';
    const param = [id];

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