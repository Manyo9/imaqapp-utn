enum ErrorStrings {
    DB_ERROR = 'Ocurrió un error en la base de datos',
    PARAM_ERROR = 'Hay un error en alguno de los parámetros. Revise e intente nuevamente.',
    PERMISSION_ERROR = 'Usted no tiene los permisos necesarios para este recurso.',
    INCORRECT_USER_OR_PASSWORD = 'Nombre de usuario y/o contraseña incorrectos.'
}

export const Errors = Object.freeze(ErrorStrings);