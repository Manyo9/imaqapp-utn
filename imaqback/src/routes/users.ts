import express from 'express';
import argon2 from 'argon2';
import * as userService from '../services/userServices'
import * as validator from '../services/validationServices';
import { UserEditDTO, UserNewDTO } from '../types';
import { Errors } from '../enums';
const { isAdmin } = require("../middlewares/auth")

const router = express.Router();

router.get('/', isAdmin, (req: any, res: any) => {

    if (!(req.query.deleted && validator.checkStringBoolean(req.query.deleted))) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    userService.getAllUsers(req.query.deleted).catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/readbyid', isAdmin, (req: any, res: any) => {
    const id: number = parseInt(req.query.id)
    if (id) {
        userService.getById(id)
            .catch((error) => {
                res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
                console.error(error);
            })
            .then((x) => {
                x = x[0];
                res.status(200).json({ "ok": true, "result": x })
            })
    } else {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
    }
});

router.get('/whoami', (req: any, res: any) => {
    if (!req.session.userInfo) {
        res.status(401).json({ "ok": false, "message": "Usted no ha iniciado sesión aún." });
        return;
    }

    res.status(200).json({
        "ok": true, "result":
        {
            idUsuario: req.session.userInfo.idUsuario,
            usuario: req.session.userInfo.usuario,
            rol: req.session.userInfo.rol,
            nombre: req.session.userInfo.nombre,
            apellido: req.session.userInfo.apellido
        }
    })
});

router.post('/login', async (req: any, res: any) => {
    if (!(req.body.usuario && req.body.password)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    const usuario: string = req.body.usuario;
    let passwordAttempt: string = req.body.password;

    userService.getHashbyUser(usuario)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
            return;
        })
        .then(async (x) => {

            x = x[0][0];
            if (!x) {
                res.status(403).json({ "ok": false, "message": Errors.INCORRECT_USER_OR_PASSWORD });
                return;
            }

            const { password } = x;
            const ok: boolean = await argon2.verify(password, passwordAttempt);
            if (!ok) {
                res.status(403).json({ "ok": false, "message": Errors.INCORRECT_USER_OR_PASSWORD })
                return;
            }

            userService.getByUsername(usuario)
                .catch((error) => {
                    res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
                    console.error(error);
                })
                .then((x) => {
                    const user = x[0][0];
                    res.status(200).json({ "ok": true, "message": "Login exitoso." })
                    req.session.userInfo = user;
                    req.session.save();

                })
        });
})

router.post('/logout', (req: any, res: any) => {
    if (!req.session.userInfo) {
        res.status(401).json({ "ok": false, "message": "Usted no ha iniciado sesión aún." });
        return;
    }

    try {
        req.session.destroy();
        res.status(200).json({ "ok": true, "message": "Cerró sesión exitosamente" })
    }
    catch(error) {
        res.status(500).json({ "ok": false, "message": "Ocurrió un error inesperado" })
        console.log(error)
    }
});

router.post('/newManager', isAdmin, async (req: any, res: any) => {
    let { usuario, password, email, nombre, apellido } = req.body;
    password = await argon2.hash(password);
    const user: UserNewDTO = {
        usuario: usuario,
        password: password,
        email: email,
        nombre: nombre,
        apellido: apellido
    };
    userService.addUser(user)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "message": "Usuario gerente creado con éxito." })
        })
})

router.put('/edit', isAdmin, (req: any, res: any) => {
    const { idUsuario, nombre, apellido, email } = req.body;
    const user: UserEditDTO = {
        idUsuario: idUsuario,
        nombre: nombre,
        apellido: apellido,
        email: email
    };
    userService.editUser(user)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": "Usuario editado con éxito." })
        })
})

router.post('/changePasswordInternal', isAdmin, (req: any, res: any) => {
    let { idUsuario, oldPassword, newPassword } = req.body;
    if (!(idUsuario && oldPassword && newPassword)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }
    userService.getHash(idUsuario)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
            return;
        })
        .then(async (x) => {
            x = x[0][0];
            const { password } = x;
            const correctPassword: Boolean = await argon2.verify(password, oldPassword);
            if (!correctPassword) {
                res.status(403).json({ "ok": false, "message": "Contraseña incorrecta." });
                return;
            }
            newPassword = await argon2.hash(newPassword);
            userService.changePassword(idUsuario, newPassword)
                .catch((e) => {
                    res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
                    console.error(e);
                    return;
                })
                .then(() => {
                    res.status(200).json({ "ok": true, "message": "Se cambió la contraseña con éxito." })
                }
                );
        })
})

router.post('/changePasswordSelf', (req: any, res: any) => {
    let { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!req.session.userInfo) {
        res.status(401).json({ "ok": false, "message": "Usted no ha iniciado sesión aún." });
        return;
    }

    const idUsuario: number = req.session.userInfo.idUsuario;
    userService.getHash(idUsuario)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
            return;
        })
        .then(async (x) => {
            x = x[0][0];
            const { password } = x;
            const correctPassword: Boolean = await argon2.verify(password, oldPassword);
            if (!correctPassword) {
                res.status(403).json({ "ok": false, "message": "Contraseña incorrecta." });
                return;
            }
            newPassword = await argon2.hash(newPassword);
            userService.changePassword(idUsuario, newPassword)
                .catch((e) => {
                    res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
                    console.error(e);
                    return;
                })
                .then(() => {
                    res.status(200).json({ "ok": true, "message": "Se cambió la contraseña con éxito." })
                }
                );
        })
})

router.delete('/:id', isAdmin, (req: any, res: any) => {
    userService.deleteUser(req.params['id'])
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            const { changed } = x[0][0];
            if (changed === 1) {
                res.status(200).json({ "ok": true, "message": "Usuario eliminado con éxito" })
            } else {
                res.status(500).json({ "ok": false, "message": "El usuario no existe o ya está dado de baja." })
            }
        })
})

export default router;