import * as nodemailer from 'nodemailer'

export type EmailOptions = {
  from: string
  to: string
  replyTo?: string
  subject: string
  html: string
}

export const sendEmail = (emailOptions: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    // if there is no NODE_MAILER_SECURE env => true, if NODE_MAILER_SECURE === false => false
    secure:
      !process.env.NODE_MAILER_SECURE ||
      process.env.NODE_MAILER_SECURE === 'true'
        ? true
        : false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  })
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      emailOptions,
      (error: unknown, info: nodemailer.SentMessageInfo): void => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      }
    )
  })
}
