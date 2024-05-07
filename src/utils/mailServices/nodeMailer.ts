import * as nodemailer from 'nodemailer'

export type EmailOptions = {
  from: string
  to: string
  replyTo?: string
  subject: string
  html: string
}

export const sendEmail = (emailOptions: EmailOptions) => {
  console.log("totoototototo => ");
  console.log("process.env.MAIL_HOST => ",process.env.MAIL_HOST);
  console.log("process.env.MAIL_PORT => ",process.env.MAIL_PORT);
  console.log("process.env.MAIL_USER => ",process.env.MAIL_USER);
  console.log("process.env.MAIL_PASSWORD => ",process.env.MAIL_PASSWORD);
  
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
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
