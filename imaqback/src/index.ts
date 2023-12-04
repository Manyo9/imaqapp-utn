import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import sessionStore from './connection/session';
import crypto from 'crypto';

import userRouter from './routes/users';
import productRouter from './routes/products';
import supplierRouter from './routes/suppliers';
import typeRouter from './routes/types';
import machineRouter from './routes/machines';
import requestRouter from './routes/requests';
import offerRouter from './routes/offers';
import reportRouter from './routes/reports';
import invoiceRouter from './routes/invoices';

const app = express();
dotenv.config();

app.use(express.json()); // para transformar el body a json
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET!,
    name: 'sessid',
    genid: () => crypto.randomUUID(),
    cookie: {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 4
    },
    saveUninitialized: true,
    resave: false,
    store: sessionStore
}))

const PORT = 3000;

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/types', typeRouter);
app.use('/api/machines', machineRouter);
app.use('/api/requests', requestRouter);
app.use('/api/offers', offerRouter);
app.use('/api/reports', reportRouter);
app.use('/api/invoices', invoiceRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})