import { Express, Request, Response } from 'express'
import { verifyRecaptchaToken } from './utils/reCaptcha'
import { sendContactEmail } from './utils/mailServices/contactEmail'
import {
  processImage,
  uploadPicture,
} from './utils/pictureServices/pictureServices'
import { checkUserRights } from './auth'

export function initializeRoute(app: Express) {
  app.post(
    '/api/images',
    checkUserRights,
    uploadPicture.single('file'),
    async (req: Request, res: Response) => {
      await processImage(req, res)
    }
  )

  // Send contact email
  app.post('/sendcontactemail', verifyRecaptchaToken, sendContactEmail)
}
