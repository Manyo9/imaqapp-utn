import express from 'express';
import * as productService from '../services/productServices'
import * as validator from '../services/validationServices';
import { ProductEditDTO, ProductNewDTO } from '../types';
import { Errors } from '../enums';

const { isManager } = require("../middlewares/auth")

const router = express.Router();

router.get('/', isManager, (req: any, res: any) => {
    if(!(req.query.deleted && validator.checkStringBoolean(req.query.deleted))){
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    productService.getAllProducts(req.query.deleted).catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/offerable', isManager, (req: any, res: any) => {

    productService.getOfferableProducts().catch((error) => {
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
    if (id) {
        productService.getById(id)
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
    const { idTipoProducto, nombre, descripcion, codigoParte, precio } = req.body;
    const product: ProductNewDTO = {
        idTipoProducto: idTipoProducto,
        nombre: nombre,
        descripcion: descripcion,
        codigoParte: codigoParte,
        precio: precio
    };
    productService.addProduct(product)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "message": "Producto creado con éxito" })
        })
})

router.put('/edit', isManager, (req: any, res: any) => {
    const { idProducto, idTipoProducto, nombre, descripcion, codigoParte, precio, activo } = req.body;
    const product: ProductEditDTO = {
        idProducto: idProducto,
        idTipoProducto: idTipoProducto,
        nombre: nombre,
        descripcion: descripcion,
        codigoParte: codigoParte,
        precio: precio,
        activo: activo
    };
    productService.editProduct(product)
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "message": "Producto editado con éxito" })
        });
});

router.delete('/:id', isManager, (req: any, res: any) => {
    productService.deleteProduct(req.params['id'])
        .catch((error) => {
            res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
            console.error(error);
        })
        .then((x) => {
            res.status(200).json({ "ok": true, "message": "Producto eliminado con éxito" })
        });
});


export default router;