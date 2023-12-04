import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT!),
    typeCast: function castField(field, useDefaultTypeCasting) {
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            return (bytes[0] === 1)
    }   
    return(useDefaultTypeCasting());}
});

mysqlConnection.connect(err => {
    if(err){
        console.log('Database error: ', err);
    } else {
        console.log('Database connection successful.')
    }
});

export default mysqlConnection;