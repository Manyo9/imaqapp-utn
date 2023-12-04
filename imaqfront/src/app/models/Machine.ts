export interface Machine {
    idMaquinaAlq: number,
    idTipoMaquina: number,
    tipoMaquina?: string,
    marcaMaquina: string,
    modeloMaquina: string,
    serieMaquina: string,
    alturaTorre: number,
    capacidadCarga: number
}

export type MachineNewDTO = Omit<Machine, 'idMaquinaAlq' | 'tipoMaquina' >
export type MachineEditDTO = Omit<Machine, 'tipoMaquina'>
export type MachineRentableDTO = Pick<Machine, 'idMaquinaAlq' | 'tipoMaquina' | 'alturaTorre' | 'capacidadCarga'>
export type MachineListDTO = Omit<Machine, 'idTipoMaquina'>