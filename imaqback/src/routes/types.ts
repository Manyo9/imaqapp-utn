import express from 'express';
import * as typeService from '../services/typeServices';
import { Errors } from '../enums';
const { isManager } = require("../middlewares/auth")

const router = express.Router();

router.get('/budget', isManager, (req: any, res: any) => {
    typeService.getBudgetTypes().catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/machine', (req: any, res: any) => {
    typeService.getMachineTypes().catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/product', isManager, (req: any, res: any) => {
    typeService.getProductTypes().catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/request', isManager, (req: any, res: any) => {
    typeService.getRequestTypes().catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/service', (req: any, res: any) => {
    typeService.getServiceTypes().catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});

router.get('/requestStatuses', isManager, (req: any, res: any) => {
    typeService.getRequestStatuses().catch((error) => {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    })
        .then((x) => {
            x = x[0];
            res.status(200).json({ "ok": true, "result": x })
        })
});


export default router;