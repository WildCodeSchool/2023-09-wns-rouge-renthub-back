import { Request, Response } from "express";
import { sendEmail, EmailOptions } from "./nodeMailer";

export const sendContactEmail = (req: Request, res: Response) => {
  const { formDetails } = req.body;

  const mailOptions1: EmailOptions = {
    from: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    to: formDetails.email,
    subject: "Votre message à The Good Cookie",
    html: `<!DOCTYPE html>
      <html lang="fr">
      <head>
      <meta charset="UTF-8">
      <title>Votre email à The Good Cookie</title>
      <style>
        body {
          font-family: Helvetica, Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          font-size: 24px;
          color: #343a40;
          padding-bottom: 10px;
          border-bottom: 3px solid #e89116;
          text-align: center;
        }
        .content {
          padding: 20px 0;
          text-align: center;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          background-color: #e89116;
          color: #fff;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #343a40;
        }
      </style>
    </head>
      <body>
      <div class="container">
      <div class="header">
        Bonjour,
      </div>
      <div class="content">
        <p>Nous avons bien reçu votre message. Notre équipe s'engage à y répondre au plus vite.</p>
        <p>Voici un récapitulatif de votre message :</p>
        <p>${formDetails.message}</p>
      </div>
      <div class="footer">
        Si vous n'avez pas envoyé d'email de contact à The Good Cookie, veuillez ignorer cet email.
      </div>
    </div>
      </body>
      </html>
      `,
  };

  const mailOptions2: EmailOptions = {
    from: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    to: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    replyTo: formDetails.email,
    subject: "Vous avez un nouveau message d'un client",
    html: `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Nouveau message reçu :</title>
      </head>
      <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom 1px solid #eee">
            <p>Nom : ${formDetails.lastName}</p>
            <p>Prénom : ${formDetails.firstName}</p>
            <p>Email : ${formDetails.email}</p>
            <p>Téléphone : ${formDetails.phoneNumber}</p>
            <p>Message : ${formDetails.message}</p>
          </div>
        </div>
      </body>
      </html>
      `,
  };

  Promise.all([sendEmail(mailOptions1), sendEmail(mailOptions2)])
    .then(() => {
      res.status(200).send("Emails envoyés avec succès");
    })
    .catch(() => {
      res.status(500).send("Une erreur s'est produite");
    });
};
