import jwt from "jsonwebtoken";
import { sendEmail, EmailOptions } from "./nodeMailer";

export const sendVerificationEmail = async (
  userEmail: string,
  userNickName: string
) => {
  const token = jwt.sign(
    { email: userEmail, nickName: userNickName },
    process.env.JWT_VERIFY_EMAIL_SECRET_KEY || "",
    { expiresIn: "12h" }
  );

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const emailOptions: EmailOptions = {
    from: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    to: userEmail || "contact@tgc.megakrash.com",
    subject: "Finalisez votre inscription sur The Good Cookie",
    html: `<!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Confirmation d'email</title>
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
          Bonjour ${userNickName}
        </div>
        <div class="content">
          <p>Cliquez sur le bouton ci-dessous pour valider votre inscription et rejoindre notre communauté !</p>
          <a href="${verificationLink}" class="button">Vérifiez votre email</a>
        </div>
        <div class="footer">
          Si vous n'avez pas demandé cette inscription, veuillez ignorer cet email.
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    const info = await sendEmail(emailOptions);
    return info;
  } catch (error) {
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendConfirmationEmail = async (
  userEmail: string,
  userNickName: string
) => {
  const frontLink = `${process.env.FRONTEND_URL}/connexion`;

  const emailOptions: EmailOptions = {
    from: process.env.MAIL_USER || "contact@tgc.megakrash.com",
    to: userEmail || "contact@tgc.megakrash.com",
    subject: "Bienvenue sur The Good Cookie !",
    html: `<!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Confirmation d'email</title>
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
          Bonjour ${userNickName}
        </div>
        <div class="content">
          <p>Votre email est vérifié et votre compte crée !</p>
          <p>Ne perdez pas un seul instant et postez une annonce directement en cliquant sur le lien ci-dessous :</p>
          <a href="${frontLink}" class="button">Créer une annonce</a>
        </div>
        <div class="footer">
          Si vous n'avez pas demandé cette inscription, veuillez ignorer cet email.
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    const info = await sendEmail(emailOptions);
    return info;
  } catch (error) {
    throw new Error(`Error sending verification email: ${error}`);
  }
};
