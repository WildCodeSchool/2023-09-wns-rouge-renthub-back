import axios from 'axios'
import { Request, Response, NextFunction } from 'express'

export const verifyRecaptchaToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    )
    if (response.data.success) {
      next()
    } else {
      res.status(500).send('reCAPTCHA verification failed')
    }
  } catch (error) {
    res.status(500).send('Error verifying reCAPTCHA')
  }
}

module.exports = {
  verifyRecaptchaToken,
}
