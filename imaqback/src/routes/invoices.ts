import express from 'express';
import * as mailService from '../services/mailServices'
import * as validator from '../services/validationServices'
import * as invoiceService from '../services/invoiceServices'
import * as requestService from '../services/requestServices'
import { Errors } from '../enums';
import { InvoiceDetailNewDTO, InvoiceNewDTO } from '../types';

const { isManager } = require("../middlewares/auth")

const router = express.Router();

router.post('/new', isManager, async (req: any, res: any) => {
    if (!(req.body.invoice && req.body.details && req.body.idSolicitud)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    let invoice: InvoiceNewDTO;
    const idsol: number = parseInt(req.body.idSolicitud)

    if (!Array.isArray(req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    let details: InvoiceDetailNewDTO[]

    try {
        invoice = {
            idTipoPresupuesto: req.body.invoice.idTipoPresupuesto,
            razonSocial: req.body.invoice.razonSocial,
            cuit: req.body.invoice.cuit,
            direccion: req.body.invoice.direccion,
            nombreContacto: req.body.invoice.nombreContacto,
            fechaCreacion: new Date(req.body.invoice.fechaCreacion),
            observaciones: req.body.invoice.observaciones,
            diasValidez: req.body.invoice.diasValidez,
            porcentajeImpuestos: req.body.invoice.porcentajeImpuestos
        }

        details = req.body.details as InvoiceDetailNewDTO[];
    } catch {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    try {
        const result = await invoiceService.newInvoice(invoice, details, idsol);
        const request = await requestService.getById(idsol)
        mailService.newInvoiceMailToCustomer(result.token, request[0][0].emailContacto);
        res.status(200).json({ "ok": true, "message": result.message });
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/fill', isManager, async (req: any, res: any) => {
    const id: number = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        const request = await invoiceService.fillInvoiceByRequest(id);
        const details = await invoiceService.fillInvoiceDetailsByRequest(id)
        res.status(200).json({ "ok": true, "result": { request: request[0][0], details: details[0] } });
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/readbytoken', async (req: any, res: any) => {
    const token = req.query.token;

    if (!token) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.isValidUUID(token)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let idpre = await invoiceService.invoiceIdByToken(token);
        if(!idpre[0][0]){
            res.status(404).json({ "ok": false, "message": "No se encontró presupuesto con ese token."})
            return;
        }
        idpre = idpre[0][0].idPresupuesto;
        const invoice = await invoiceService.getInvoiceByID(idpre);
        const details = await invoiceService.getDetailsByID(idpre);
        res.status(200).json({ "ok": true, "result": { invoice: invoice[0][0], details: details[0] } })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/readbyid', isManager, async (req: any, res: any) => {
    const id = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        const invoice = await invoiceService.getInvoiceByID(id);
        const details = await invoiceService.getDetailsByID(id);
        res.status(200).json({ "ok": true, "result": { invoice: invoice[0][0], details: details[0] } })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/acceptBudget', async (req: any, res: any) => {
    const token: string = req.body.token;
    const accepted: string = req.body.accepted;

    if (!token || accepted === undefined || accepted === null) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.isValidUUID(token)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    const word = accepted == 'true' ? 'aceptado' : 'rechazado';

    try {
        let idpre = await invoiceService.invoiceIdByToken(token);
        if(!idpre[0][0]){
            res.status(404).json({ "ok": false, "message": "No se encontró presupuesto con ese token."})
            return;
        }
        idpre = idpre[0][0].idPresupuesto;
        let x = await invoiceService.acceptBudget(token, accepted);
        const { affectedRows } = x
        if (affectedRows > 0) {
            mailService.acceptedInvoiceMailToManager(word, idpre)
            res.status(200).json({ "ok": true, "message": "Se registró el cambio sobre el presupuesto." })
        } else {
            res.status(400).json({ "ok": false, "message": "El presupuesto ya fue aceptado o rechazado." })
        }
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

export default router;