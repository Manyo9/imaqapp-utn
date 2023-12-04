import express from 'express';
import * as offerService from '../services/offerServices'
import * as validator from '../services/validationServices'
import { Errors } from '../enums';
import { OfferDetailNewDTO, OfferEditDTO, OfferNewDTO } from '../types';

const { isManager } = require("../middlewares/auth")

const router = express.Router();

router.get('/', isManager, async (req: any, res: any) => {
    if (!(req.query.vigentes && validator.checkStringBoolean(req.query.vigentes))) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    try {
        let x = await offerService.getAll(req.query.vigentes)
        x = x[0];
        res.status(200).json({ "ok": true, "result": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/readbyid', isManager, async (req: any, res: any) => {
    const id: number = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let x = await offerService.getById(id);
        x = x[0][0];
        res.status(200).json({ "ok": true, "result": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/readshortbyid', async (req: any, res: any) => {
    const id: number = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let x = await offerService.getByIdShort(id);
        x = x[0][0];
        res.status(200).json({ "ok": true, "result": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/available', async (req: any, res: any) => {
    try {
        let x = await offerService.getCurrent()
        x = x[0];
        res.status(200).json({ "ok": true, "result": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/new', isManager, async (req: any, res: any) => {
    if (!(req.body.offer && req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    let offer: OfferNewDTO = { nombre: '', descripcion: '', precio: 0, fechaInicio: new Date(), fechaFin: new Date() }
    let details: OfferDetailNewDTO[];

    if (!validator.validateObjectKeys(offer, req.body.offer)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateArray(req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        offer = {
            nombre: req.body.offer.nombre,
            descripcion: req.body.offer.descripcion,
            precio: req.body.offer.precio,
            fechaInicio: new Date(req.body.offer.fechaInicio),
            fechaFin: new Date(req.body.offer.fechaFin)
        };


        details = req.body.details as OfferDetailNewDTO[]

    } catch (error) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    try {
        let x = await offerService.newOffer(offer, details);
        res.status(200).json({ "ok": true, "message": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/details', isManager, async (req: any, res: any) => {
    const id: number = parseInt(req.query.id)
    if (!id) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let x = await offerService.getAllDetails(id)
        x = x[0];
        res.status(200).json({ "ok": true, "result": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/shortdetails', async (req: any, res: any) => {
    const id: number = parseInt(req.query.id)
    if (!id) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let x = await offerService.getAllDetailsShort(id)
        x = x[0];
        res.status(200).json({ "ok": true, "result": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/cancel', isManager, async (req: any, res: any) => {
    const id: number = parseInt(req.body.idOferta)
    if (!id) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        const x = await offerService.cancelOffer(id)
        const changed = x[0][0].changed;
        let message: string;
        let ok: boolean;
        if (changed) {
            ok = true;
            message = 'Se canceló la oferta con éxito.';
        } else {
            ok = false;
            message = 'La oferta ya estaba cancelada o ya terminó.';
        }
        res.status(200).json({ "ok": ok, "message": message })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/markSold', isManager, async (req: any, res: any) => {
    const id: number = parseInt(req.body.idOferta)
    if (!id) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        const result = await offerService.markAsSold(id);
        res.status(200).json({ "ok": true, "message": result.message });
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.put('/edit', isManager, async (req: any, res: any) => {
    const id: number = parseInt(req.body.idOferta);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    const { idOferta, nombre, descripcion, precio, fechaInicio, fechaFin} = req.body

    const offer: OfferEditDTO = {
        idOferta: idOferta,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
    }
    try {
        await offerService.editOffer(offer);
        res.status(200).json({ "ok": true, "message": "Se editó la oferta con éxito" })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

export default router;