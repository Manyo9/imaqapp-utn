import mysqlConnection from "../connection/connection";
import { MachineEditDTO, MachineNewDTO } from "../types";

export const addMachine = (machine: MachineNewDTO): Promise<any> => {
    const query = 'call spNuevaMaquina(?,?,?,?,?,?)'
    const param = [machine.idTipoMaquina, machine.marcaMaquina, machine.modeloMaquina,
    machine.serieMaquina, machine.alturaTorre, machine.capacidadCarga]

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

export const getAllMachines = (): Promise<any> => {
    const query = 'call spListarMaquinas()'

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
    const query = 'call spMaquinaPorID(?)'
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

export const editMachine = (machine: MachineEditDTO): Promise<any> => {
    const query = 'call spEditarMaquina(?,?,?,?,?,?,?)'
    const param = [machine.idMaquinaAlq, machine.idTipoMaquina, machine.marcaMaquina,
    machine.modeloMaquina, machine.serieMaquina, machine.alturaTorre, machine.capacidadCarga]

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

export const deleteMachine = (id: number): Promise<any> => {
    const query = 'call spEliminarMaquina(?)'
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

export const getAvailableMachines = (startDate: Date, endDate: Date): Promise<any> => {
    const query = 'call spListarMaquinasAlquilables(?,?)'
    const param = [startDate, endDate]

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