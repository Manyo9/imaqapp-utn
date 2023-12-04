import transporter from "../connection/nodemailer";

import dotenv from 'dotenv';
import { RequestNewDTO } from "../types";

dotenv.config();

export const testMail = (): boolean => {

  const mailOptions = {

    from: process.env.SMTP_USER,
    to: process.env.SMTP_TEST_USER,
    subject: 'E-mail de prueba',
    text: 'Este es un email de prueba'
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  })
  return false;
}

export const newRequestMailToCustomer = (token: string, mailAddress: string): boolean => {
  if (mailAddress === 'test@test.com') {
    return true;
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_TEST_USER,
    // to: mailAddress,
    subject: 'Solicitud creada con éxito',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
      <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Notificación de solicitud</h2>
        <p>Estimado(a) cliente:</p>
        <p>Le informamos que su solicitud ha sido creada con éxito.</p>
    
        <p>Si usted desea cancelar su solicitud, puede hacerlo aquí.</p>
        <a href="http://localhost:4200/cancelarSolicitud/${token}">Acceder a la solicitud</a>
        <p>También puede observar el estado de la solicitud en ese mismo sitio.</p>
    
        <p>Si tiene alguna pregunta o necesita más información, no dude en contactarnos.</p>
    
        <p>INTER-MAQ Servicios Industriales</p>
      </div></body></html>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  })
  return false;
}

export const newRequestMailToManager = (id: number, reqtype: string, request: RequestNewDTO): boolean => {

  let comm: string;
  if (request.comentario == undefined || request.comentario == null) {
    comm = 'N/A';
  } else {
    comm = request.comentario;
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_TEST_USER,
    subject: `Nuevo ${reqtype}`,
    text: `Se creó una nueva solicitud de ${reqtype}. Revisar la solicitud con ID #${id}.\n
  Solicitante: ${request.nombreSolicitante}, Razón Social: ${request.razonSocial}.\n
  Teléfono de contacto: ${request.telefonoContacto}. Comentario: ${comm}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  })
  return false;
}

export const newInvoiceMailToCustomer = (token: string, mailAddress: string): boolean => {
  if (mailAddress === 'test@test.com') {
    return true;
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_TEST_USER,
    // to: mailAddress,
    subject: 'Nuevo presupuesto',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
      <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Notificación de presupuesto</h2>
        <p>Estimado(a) cliente:</p>
        <p>Le informamos que su solicitud ha sido presupuestada.</p>
    
        <p>Para visualizar el presupuesto, ingrese al siguiente enlace.</p>
        <a href="http://localhost:4200/verPresupuesto/${token}">Acceder al presupuesto</a>
        <p>También podrá aceptar o rechazar el presupuesto en ese mismo sitio.</p>
    
        <p>Si tiene alguna pregunta o necesita más información, no dude en contactarnos.</p>
    
        <p>INTER-MAQ Servicios Industriales</p>
      </div></body></html>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  })
  return false;
}

export const acceptedInvoiceMailToManager = (accepted: string, idPresupuesto: number): boolean => {

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_TEST_USER,
    subject: `Presupuesto ${accepted}`,
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
      <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Notificación de presupuesto</h2>
        <p>El presupuesto con ID ${idPresupuesto} fue ${accepted}.</p>
      </div></body></html>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  })
  return false;
}