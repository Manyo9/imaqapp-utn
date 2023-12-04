import express from 'express';
import * as requestService from '../services/requestServices'
import * as validator from '../services/validationServices'
import * as mailService from '../services/mailServices'

import * as rentalService from '../services/rentalServices'
import * as offerService from '../services/offerServices'
import * as serviceService from '../services/serviceServices'
import * as sPartService from '../services/sparePartsService'

import { Errors } from '../enums';
import { RentalDetailNewDTO, RentalNewDTO, RequestNewDTO, ServiceDetailNewDTO, ServicesNewDTO, SparePartDetailNewDTO } from '../types';

const { isManager } = require("../middlewares/auth")

const router = express.Router();

router.post('/rentals/new', async (req: any, res: any) => {
    if (!(req.body.request && req.body.rental && req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    req.body.request.tokenCancel = '';
    req.body.rental.idSolicitud = 0;

    let request: RequestNewDTO = {
        nombreSolicitante: "",
        razonSocial: "",
        telefonoContacto: "",
        emailContacto: "",
        comentario: "",
        tokenCancel: ""
    };

    let rental: RentalNewDTO = {
        idSolicitud: 0,
        fechaInicio: new Date(),
        fechaFin: new Date()
    };

    if (!Array.isArray(req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateObjectKeys(request, req.body.request)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateObjectKeys(rental, req.body.rental)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateEmail(req.body.request.emailContacto)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    let details: RentalDetailNewDTO[]

    try {
        request = {
            nombreSolicitante: req.body.request.nombreSolicitante,
            razonSocial: req.body.request.razonSocial,
            telefonoContacto: req.body.request.telefonoContacto,
            emailContacto: req.body.request.emailContacto,
            comentario: req.body.request.comentario,
            tokenCancel: ''
        }
        rental = {
            idSolicitud: req.body.rental.idSolicitud,
            fechaInicio: new Date(req.body.rental.fechaInicio),
            fechaFin: new Date(req.body.rental.fechaFin)
        };

        details = req.body.details as RentalDetailNewDTO[];
    } catch {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    try {
        const result = await requestService.newRentalRequest(request, rental, details);
        mailService.newRequestMailToCustomer(result.token, request.emailContacto);
        mailService.newRequestMailToManager(result.id, 'Alquiler', request);
        res.status(200).json({ "ok": true, "message": result.message });
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/purchases/new', async (req: any, res: any) => {
    if (!(req.body.request && req.body.idOferta)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    req.body.request.tokenCancel = '';

    let request: RequestNewDTO = {
        nombreSolicitante: "",
        razonSocial: "",
        telefonoContacto: "",
        emailContacto: "",
        comentario: "",
        tokenCancel: ""
    };

    if (!validator.validateObjectKeys(request, req.body.request)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateEmail(req.body.request.emailContacto)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    const idOferta = parseInt(req.body.idOferta);

    if (!idOferta || isNaN(idOferta)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        request = {
            nombreSolicitante: req.body.request.nombreSolicitante,
            razonSocial: req.body.request.razonSocial,
            telefonoContacto: req.body.request.telefonoContacto,
            emailContacto: req.body.request.emailContacto,
            comentario: req.body.request.comentario,
            tokenCancel: ''
        }

    } catch {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    try {
        const result = await requestService.newOfferRequest(request, idOferta);
        mailService.newRequestMailToCustomer(result.token, request.emailContacto);
        mailService.newRequestMailToManager(result.id, 'Oferta', request);
        res.status(200).json({ "ok": true, "message": result.message });
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/services/new', async (req: any, res: any) => {
    if (!(req.body.request && req.body.service && req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    req.body.request.tokenCancel = '';
    req.body.service.idSolicitud = 0;

    let request: RequestNewDTO = {
        nombreSolicitante: "",
        razonSocial: "",
        telefonoContacto: "",
        emailContacto: "",
        comentario: "",
        tokenCancel: ""
    };

    let service: ServicesNewDTO = {
        idSolicitud: 0,
        idTipoServicio: 0
    };

    if (!Array.isArray(req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateObjectKeys(request, req.body.request)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateObjectKeys(service, req.body.service)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateEmail(req.body.request.emailContacto)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    let details: ServiceDetailNewDTO[]

    try {
        request = {
            nombreSolicitante: req.body.request.nombreSolicitante,
            razonSocial: req.body.request.razonSocial,
            telefonoContacto: req.body.request.telefonoContacto,
            emailContacto: req.body.request.emailContacto,
            comentario: req.body.request.comentario,
            tokenCancel: ''
        }
        service = {
            idSolicitud: req.body.service.idSolicitud,
            idTipoServicio: req.body.service.idTipoServicio
        };

        details = req.body.details as ServiceDetailNewDTO[];
    } catch {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    try {
        const result = await requestService.newServiceRequest(request, service, details);
        mailService.newRequestMailToCustomer(result.token, request.emailContacto);
        mailService.newRequestMailToManager(result.id, 'Servicio', request);
        res.status(200).json({ "ok": true, "message": result.message });
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/spareparts/new', async (req: any, res: any) => {
    if (!(req.body.request && req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    req.body.request.tokenCancel = '';

    let request: RequestNewDTO = {
        nombreSolicitante: "",
        razonSocial: "",
        telefonoContacto: "",
        emailContacto: "",
        comentario: "",
        tokenCancel: ""
    };

    if (!Array.isArray(req.body.details)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateObjectKeys(request, req.body.request)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.validateEmail(req.body.request.emailContacto)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    let details: SparePartDetailNewDTO[]

    try {
        request = {
            nombreSolicitante: req.body.request.nombreSolicitante,
            razonSocial: req.body.request.razonSocial,
            telefonoContacto: req.body.request.telefonoContacto,
            emailContacto: req.body.request.emailContacto,
            comentario: req.body.request.comentario,
            tokenCancel: ''
        }

        details = req.body.details as SparePartDetailNewDTO[];
    } catch {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
        return;
    }

    try {
        const result = await requestService.newSparePartRequest(request, details);
        mailService.newRequestMailToCustomer(result.token, request.emailContacto);
        mailService.newRequestMailToManager(result.id, 'solicitud de repuesto', request);
        res.status(200).json({ "ok": true, "message": result.message });
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/', isManager, async (req: any, res: any) => {

    const page: number = parseInt(req.query.page);
    const idestado: number | undefined = req.query.idestado !== undefined
        ? validator.validateStringNumber(req.query.idestado)
        : undefined;
    const idtipo: number | undefined = req.query.idtipo !== undefined
        ? validator.validateStringNumber(req.query.idtipo)
        : undefined;
    const razonsocial: string | undefined = req.query.razonsocial !== undefined
        ? req.query.razonsocial.trim()
        : undefined;

    if (!page || isNaN(page)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        const result = await requestService.getAllFiltered(page, idestado, idtipo, razonsocial);
        res.status(200).json({ "ok": true, "result": result })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/rentals', isManager, async (req: any, res: any) => {

    const id: number = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let request = await requestService.getById(id);
        request = request[0][0];
        let rental = await rentalService.rentalByRequest(id);
        rental = rental[0][0];
        let details = await rentalService.detailsByRentalID(rental.idAlquiler);
        details = details[0];
        res.status(200).json({ "ok": true, "result": { request: request, rental: rental, details: details } })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/purchases', isManager, async (req: any, res: any) => {

    const id: number = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let request = await requestService.getById(id);
        request = request[0][0];
        let purchaseReq = await offerService.getPurchaseByRequest(id);
        purchaseReq = purchaseReq[0][0];
        let offer = await offerService.getById(purchaseReq.idOferta);
        offer = offer[0][0];
        res.status(200).json({ "ok": true, "result": { request: request, purchaseReq: purchaseReq, offer: offer } })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/services', isManager, async (req: any, res: any) => {

    const id: number = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let request = await requestService.getById(id);
        request = request[0][0];
        let service = await serviceService.serviceByRequest(id);
        service = service[0][0];
        let details = await serviceService.detailsByServiceID(service.idServicio);
        details = details[0];
        res.status(200).json({ "ok": true, "result": { request: request, service: service, details: details } })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/spareparts', isManager, async (req: any, res: any) => {

    const id: number = parseInt(req.query.id);

    if (!id || isNaN(id)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let request = await requestService.getById(id);
        request = request[0][0];
        let spRequest = await sPartService.sparePartRequestByRequest(id);
        spRequest = spRequest[0][0];
        let details = await sPartService.detailsBySparePartRequestID(spRequest.idSolicitudRepuesto);
        details = details[0];
        res.status(200).json({ "ok": true, "result": { request: request, spRequest: spRequest, details: details } })
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
        let x = await requestService.getByToken(token);
        x = x[0][0];
        res.status(200).json({ "ok": true, "result": x })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.put('/updateStatus', isManager, async (req: any, res: any) => {
    const { idSolicitud, idEstadoSolicitud } = req.body;

    if (typeof idSolicitud == undefined || typeof idEstadoSolicitud == undefined) {
      return res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
    }
  
    if (isNaN(idSolicitud) || isNaN(idEstadoSolicitud)) {
      return res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR });
    }

    try {
        let x = await requestService.updateStatus(idSolicitud, idEstadoSolicitud);
        res.status(200).json({ "ok": true, "message": 'Estado cambiado con éxito.' })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.post('/cancelbytoken', async (req: any, res: any) => {
    const token = req.body.token;

    if (!token) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    if (!validator.isValidUUID(token)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        let x = await requestService.cancelRequest(token);
        const changed = x[0][0].changed;
        let message: string;
        let ok: boolean;
        if (changed) {
            ok = true;
            message = 'Se canceló la solicitud con éxito.';
        } else {
            ok = false;
            message = 'Sólo es posible cancelar solicitudes en estado "Nueva". Póngase en contacto con nosotros.';
        }
        res.status(200).json({ "ok": ok, "message": message })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

export default router;