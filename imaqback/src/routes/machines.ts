import express from 'express';
import * as machineService from '../services/machineServices'
import { MachineEditDTO, MachineNewDTO } from '../types';
import { Errors } from '../enums';

const { isManager } = require("../middlewares/auth")

const router = express.Router();

router.get('/', isManager, (req: any, res: any) => {
    machineService.getAllMachines().catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/readbyid', isManager, (req: any, res: any) => {
    const id: number = parseInt(req.query.id)
    if (!id) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }
    machineService.getById(id)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.post('/new', isManager, (req: any, res: any) => {
    const { idTipoMaquina, marcaMaquina, modeloMaquina,
        serieMaquina, alturaTorre, capacidadCarga } = req.body;
    const machine: MachineNewDTO = {
        idTipoMaquina: idTipoMaquina,
        marcaMaquina: marcaMaquina,
        modeloMaquina: modeloMaquina,
        serieMaquina: serieMaquina,
        alturaTorre: alturaTorre,
        capacidadCarga: capacidadCarga
    };
    machineService.addMachine(machine)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "message": "Máquina creada con éxito" })
        })
})

router.put('/edit', isManager, (req: any, res: any) => {
    const { idMaquinaAlq, idTipoMaquina, marcaMaquina,
        modeloMaquina, serieMaquina, alturaTorre, capacidadCarga } = req.body;
    const machine: MachineEditDTO = {
        idMaquinaAlq: idMaquinaAlq,
        idTipoMaquina: idTipoMaquina,
        marcaMaquina: marcaMaquina,
        modeloMaquina: modeloMaquina,
        serieMaquina: serieMaquina,
        alturaTorre: alturaTorre,
        capacidadCarga: capacidadCarga
    };
    machineService.editMachine(machine)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "message": "Máquina editada con éxito" })
        });
});

router.delete('/:id', isManager, (req: any, res: any) => {
    machineService.deleteMachine(req.params['id'])
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            res.status(200).json({ "ok": true, "message": "Máquina eliminada con éxito" })
        });
});

router.get('/available', (req: any, res: any) => {

    if (!(req.query.startdate && req.query.enddate)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    machineService.getAvailableMachines(new Date(req.query.startdate), new Date(req.query.enddate))
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        });

});


export default router;