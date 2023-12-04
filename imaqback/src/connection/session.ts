import mysqlConnection from "./connection";
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 1000 * 60 * 60 * 2,
}, mysqlConnection)  

export default sessionStore;
