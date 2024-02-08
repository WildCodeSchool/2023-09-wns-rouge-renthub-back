import { Request, Response } from 'express'
import { sendEmail, EmailOptions } from './nodeMailer'
import { EmailTemplateParams, createEmailTemplate } from './emailTemplate'

export const sendContactEmail = (req: Request, res: Response) => {
  const { formDetails } = req.body

  const emailParams1: EmailTemplateParams = {
    content: ` <div class="header">
    Bonjour,
  </div>
  <div class="content">
    <p>Nous avons bien reçu votre message. Notre équipe s'engage à y répondre au plus vite.</p>
    <p>Votre message :</p>
    <p>${formDetails.message}</p>
  </div>
  <div class="footer">
  Si vous n'avez pas fait de demande d'information auprès de RentHub, veuillez ignorer cet email.
  </div>
  `,
    title: 'Votre message à RentHub',
  }

  const emailHtml1 = createEmailTemplate(emailParams1)

  const mailOptions1: EmailOptions = {
    from: process.env.MAIL_USER || 'contact@renthub.shop',
    to: formDetails.email,
    subject: 'Votre message à RentHub',
    html: emailHtml1,
  }

  const emailParams2: EmailTemplateParams = {
    content: ` <div class="header">
    Nouveau message reçu :
  </div>
  <div class="content">
    <p>Nom : ${
      formDetails.lastName ? formDetails.lastName : 'Non communiqué'
    }</p>
    <p>Prénom : ${
      formDetails.firstName ? formDetails.firstName : 'Non communiqué'
    }</p>
    <p>Email : ${formDetails.email}</p>
    <p>Téléphone : ${
      formDetails.phoneNumber ? formDetails.phoneNumber : 'Non communiqué'
    }</p>
    <p>Message : ${formDetails.message}</p>
  </div>`,
    title: 'Nouveau message client reçu',
  }

  const emailHtml2 = createEmailTemplate(emailParams2)

  const mailOptions2: EmailOptions = {
    from: process.env.MAIL_USER || 'contact@renthub.shop',
    to: process.env.MAIL_USER || 'contact@renthub.shop',
    replyTo: formDetails.email,
    subject: "Vous avez un nouveau message d'un client",
    html: emailHtml2,
  }

  Promise.all([sendEmail(mailOptions1), sendEmail(mailOptions2)])
    .then(() => {
      res.status(200).send('Emails envoyés avec succès')
    })
    .catch(() => {
      res.status(500).send("Une erreur s'est produite")
    })
}
