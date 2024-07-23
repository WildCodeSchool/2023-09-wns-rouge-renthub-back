import { Express, Request, Response } from 'express'
import { verifyRecaptchaToken } from './utils/reCaptcha'
import { sendContactEmail } from './utils/mailServices/contactEmail'
import {
  processImage,
  uploadPicture,
} from './utils/pictureServices/pictureServices'
import { PictureService } from './services/Picture.service'
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

  app.get('/api/images/:imageId', async (req, res) => {
    if (!req.params.imageId) {
      return res.status(400).send('No imageId was provided.')
    }
    const servicePicture = new PictureService()
    const categoryOnPicture = false
    try {
      const picture = await servicePicture.find(
        +req.params.imageId,
        categoryOnPicture
      )
      if (picture) {
        res.sendFile(picture.path)
      } else {
        res.status(404).json({ message: 'No picture found' })
      }
    } catch (error: any) {
      if (error.message.includes(`not found`)) {
        return res.status(404).json({ message: 'No picture found' })
      }
      console.error('Error while getting picture', error)
      res.status(500).send('Error while getting picture')
    }
  })

  // Send contact email
  app.post('/sendcontactemail', verifyRecaptchaToken, sendContactEmail)
}
