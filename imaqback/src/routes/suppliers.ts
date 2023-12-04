import express from 'express';
import * as supplierService from '../services/supplierServices';
import * as validator from '../services/validationServices';
import { SupplierEditDTO, SupplierListDTO, SupplierNewDTO } from '../types';
import { Errors } from '../enums';
const { isManager } = require("../middlewares/auth")

const router = express.Router();


router.get('/', isManager, (req: any, res: any) => {

    if(!(req.query.deleted && validator.checkStringBoolean(req.query.deleted))){
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }
    
    supplierService.getAllSuppliers(req.query.deleted).catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0] as SupplierListDTO;
            res.status(200).json({ "ok": true, "result": x })
        });
});

router.get('/readbyid', isManager, (req: any, res: any) => {
    const id: number = parseInt(req.query.id)
    if (id) {
        supplierService.getById(id)
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

router.post('/new', isManager, (req: any, res: any) => {
    const { cuit, razonSocial, nombreContacto, calle,
        numCalle, observaciones, email, telefono } = req.body;
    const supplier: SupplierNewDTO = {
        cuit: cuit,
        razonSocial: razonSocial,
        nombreContacto: nombreContacto,
        calle: calle,
        numCalle: numCalle,
        observaciones: observaciones,
        email: email,
        telefono: telefono
    };
    supplierService.addSupplier(supplier)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": "Proveedor creado con éxito." })
        });
});

router.put('/edit', isManager, (req: any, res: any) => {
    const { idProveedor, cuit, razonSocial, nombreContacto, calle,
        numCalle, observaciones, email, telefono, activo } = req.body;
    const supplier: SupplierEditDTO = {
        idProveedor: idProveedor,
        cuit: cuit,
        razonSocial: razonSocial,
        nombreContacto: nombreContacto,
        calle: calle,
        numCalle: numCalle,
        observaciones: observaciones,
        email: email,
        telefono: telefono,
        activo: activo
    };
    supplierService.editSupplier(supplier)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "message": "Proveedor editado con éxito." })
        });
});

router.delete('/:id', isManager, (req: any, res: any) => {
    supplierService.deleteSupplier(req.params['id'])
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            res.status(200).json({ "ok": true, "message": "Proveedor eliminado con éxito" })
        });
});


export default router;