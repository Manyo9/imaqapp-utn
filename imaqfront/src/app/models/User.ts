export interface User {
    idUsuario: number,
    usuario: string,
    password: string,
    email: string,
    nombre: string,
    apellido: string,
    idRol: number,
    fechaAlta: Date,
    fechaBaja?: Date
    rol?: string
}

export type UserListDTO = Omit<User, 'password' | 'idRol' | 'fechaAlta'>
export type UserReadIDDTO = Omit<User, 'password'>
export type UserNewDTO = Omit<User, 'idUsuario' | 'idRol' | 'rol' | 'fechaAlta' | 'fechaBaja'>
export type UserEditDTO = Pick<User, 'idUsuario' | 'nombre' | 'apellido' | 'email'>
export type UserLoginDTO = Pick<User, 'usuario' | 'password'>
export type UserProfileDTO = Pick<User, 'idUsuario' | 'usuario' | 'rol' | 'nombre' | 'apellido' >