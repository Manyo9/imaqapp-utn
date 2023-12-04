import mysqlConnection from '../connection/connection';

const partOneRequestReport = (startDate: Date, endDate: Date): Promise<any> => {
    const query = 'CALL spGenerarReporteSolicitudes1(?,?)';
    const param = [startDate, endDate];

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

const partTwoRequestReport = (startDate: Date, endDate: Date): Promise<any> => {
    const query = 'CALL spGenerarReporteSolicitudes2(?,?)';
    const param = [startDate, endDate];

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

const partThreeRequestReport = (startDate: Date, endDate: Date): Promise<any> => {
    const query = 'CALL spGenerarReporteSolicitudes3(?,?)';
    const param = [startDate, endDate];

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

export const requestsByYear = (year: number): Promise<any> => {
    const query = 'CALL spCantidadSolicitudesPorAnio(?)';
    const param = [year];

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

export const generateRequestReport = (startDate: Date, endDate: Date): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const firstResult = await partOneRequestReport(startDate, endDate);
            const cantidadSolicitudes: number = firstResult[0][0].cantidadSolicitudes
            const secondResult = await partTwoRequestReport(startDate, endDate);
            const reporteTipos: number = secondResult[0];
            const thirdResult = await partThreeRequestReport(startDate, endDate);
            const reporteEstados: number = thirdResult[0];
            resolve({cantidadSolicitudes: cantidadSolicitudes, reporteTipos: reporteTipos, reporteEstados: reporteEstados})
        } catch (error) {
            reject(error);
        }
    })
};

export const generateSalesReport = (startDate: Date, endDate: Date): Promise<any> => {
    const query = 'CALL spGenerarReporteVentas1(?,?)';
    const param = [startDate, endDate];

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

export const salesByYear = (year: number): Promise<any> => {
    const query = 'CALL spGenerarReporteVentas2(?)';
    const param = [year];

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

export const getTopCustomers = (startDate: Date, endDate: Date): Promise<any> => {
    const query = 'CALL spGenerarReporteClientes1(?,?)';
    const param = [startDate, endDate];

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