import express from 'express';
import * as reportService from '../services/reportServices'
import * as validator from '../services/validationServices'
import { Errors } from '../enums';

const router = express.Router();
const { isManager } = require("../middlewares/auth")

router.get('/request', isManager, async (req: any, res: any) => {

    let { startdate, enddate } = req.query;

    if (!startdate || !enddate) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    startdate = new Date(startdate);
    enddate = new Date(enddate);

    try {
        const result = await reportService.generateRequestReport(startdate, enddate);
        res.status(200).json({ "ok": true, "result": result })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/requestByYear', isManager, async (req: any, res: any) => {

    const year = parseInt(req.query.year);

    if (!year || isNaN(year)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        const result = await reportService.requestsByYear(year);
        res.status(200).json({ "ok": true, "result": result[0] })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/sales', isManager, async (req: any, res: any) => {

    let { startdate, enddate } = req.query;

    if (!startdate || !enddate) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    startdate = new Date(startdate);
    enddate = new Date(enddate);

    try {
        const result = await reportService.generateSalesReport(startdate, enddate);
        res.status(200).json({ "ok": true, "result": result[0] })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/salesByYear', isManager, async (req: any, res: any) => {

    const year = parseInt(req.query.year);

    if (!year || isNaN(year)) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    try {
        const result = await reportService.salesByYear(year);
        res.status(200).json({ "ok": true, "result": result[0] })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

router.get('/topCustomers', isManager, async (req: any, res: any) => {

    let { startdate, enddate } = req.query;

    if (!startdate || !enddate) {
        res.status(400).json({ "ok": false, "message": Errors.PARAM_ERROR })
        return;
    }

    startdate = new Date(startdate);
    enddate = new Date(enddate);

    try {
        const result = await reportService.getTopCustomers(startdate, enddate);
        res.status(200).json({ "ok": true, "result": result[0] })
    } catch (error) {
        res.status(500).json({ "ok": false, "message": Errors.DB_ERROR });
        console.error(error);
    }
});

export default router;