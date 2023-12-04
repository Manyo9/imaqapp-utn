import mysqlConnection from '../connection/connection';

export const getMachineTypes = (): Promise<any> => {
    const query = 'call spTiposMaquina()'

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

export const getBudgetTypes = (): Promise<any> => {
    const query = 'call spTiposPresupuesto()'

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

export const getProductTypes = (): Promise<any> => {
    const query = 'call spTiposProducto()'

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

export const getServiceTypes = (): Promise<any> => {
    const query = 'call spTiposServicio()'

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

export const getRequestTypes = (): Promise<any> => {
    const query = 'call spTiposSolicitud()'

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

export const getRequestStatuses = (): Promise<any> => {
    const query = 'call spEstadosSolicitud()'

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