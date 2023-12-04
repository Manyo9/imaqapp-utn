import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter: Transporter = nodemailer.createTransport({

  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_OUT_PORT!),
  secure: true,
  requireTLS: true,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
  },
  tls: {
      minVersion: 'TLSv1',
      rejectUnauthorized: false,
  },
});

export default transporter;
