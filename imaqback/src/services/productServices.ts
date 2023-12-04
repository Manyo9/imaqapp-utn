import mysqlConnection from '../connection/connection';
import { ProductEditDTO, ProductNewDTO } from '../types';

export const addProduct = (product: ProductNewDTO): Promise<any> => {
    const query = 'call spNuevoProducto(?,?,?,?,?)'
    const param = [product.idTipoProducto, product.nombre,
    product.descripcion, product.codigoParte, product.precio]

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

export const getAllProducts = (deleted: string): Promise<any> => {
    const query = 'call spListarProductos(?)'
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

export const getOfferableProducts = (): Promise<any> => {
    const query = 'call spListarProductosOfertables()'

    return new Promise((resolve, reject) => {
        try {
            mysqlConnection.query(query, (error, response) => {
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
    const query = 'call spProductoPorID(?)'
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
}

export const editProduct = (product: ProductEditDTO): Promise<any> => {
    const query = 'call spEditarProducto(?,?,?,?,?,?,?)'
    const param = [product.idProducto, product.idTipoProducto,
    product.nombre, product.descripcion, product.codigoParte, product.precio, product.activo]

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

export const deleteProduct = (id: number): Promise<any> => {
    const query = 'call spEliminarProducto(?)'
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