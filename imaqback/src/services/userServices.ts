import mysqlConnection from '../connection/connection';
import { UserEditDTO, UserNewDTO } from '../types';

export const addUser = (user: UserNewDTO): Promise<any> => {
    const query = 'call spNuevoUsuarioInterno(?,?,?,?,?)'
    const param = [user.usuario, user.password, user.email, user.nombre, user.apellido]

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

export const getHash = (id: number): Promise<any> => {
    const query = 'call spTraerHash(?)';
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

export const getHashbyUser = (username: string): Promise<any> => {
    const query = 'call spTraerHashLogin(?)';
    const param = [username];

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

export const changePassword = (id: number, newPassword: string): Promise<any> => {
    const query = 'call spCambiarContraseña(?,?)';
    const param = [id, newPassword];

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

export const getAllUsers = (deleted: string): Promise<any> => {
    const query = 'call spListarUsuarios(?)';
    const params = [deleted == 'true' ? 1 : 0];

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
    const query = 'call spUsuarioPorID(?)';
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

export const getByUsername = (username: string): Promise<any> => {
    const query = 'call spUsuarioPorUsername(?)';
    const param = [username];

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

export const editUser = (user: UserEditDTO): Promise<any> => {
    const query = 'call spModificarUsuario(?,?,?,?)';
    const param = [user.idUsuario, user.nombre, user.apellido, user.email];

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

export const deleteUser = (id: number): Promise<any> => {
    const query = 'call spDarDeBajaUsuario(?,@changed)';
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