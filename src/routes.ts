import multer from 'multer'
import { Express } from 'express'
// import sharp from 'sharp'
// import mime from 'mime'
import axios from 'axios'
import { verifyRecaptchaToken } from './utils/reCaptcha'
import { sendContactEmail } from './utils/mailServices/contactEmail'
import { uploadPicture } from './utils/pictureServices/multer'
import { createImage } from './utils/pictureServices/pictureServices'
import { PictureService } from './services/Picture.service'

export function initializeRoute(app: Express) {
  const upload = multer({ dest: '/app/uploads/' })
  //const storage = multer.memoryStorage()
  //const upload = multer({ storage: storage })

  // ---API REST in express first --------------------------//
  app.post('/api/images', upload.single('file'), async (req, res) => {
    console.info('uploading images', req.file)
    if (!req.file) {
      res.status(400).send('No file was uploaded.')
      return
    }

    if (req.file && req.file.mimetype.startsWith('image/')) {
      //const extension = req.file.fieldname.split('.').pop() //mime.extension(req.file.mimetype)
      // const filename = `${Date.now()}-${Math.log(Math.random() * 8999) + 1000}.${extension}`
      //   await sharp(req.file.buffer)
      //     .resize(2000, 2000, { fit: 'contain' })
      //     .toFile(`/app/uploads/${filename}`)

      const servicePicture = new PictureService()
      const newPicture = await servicePicture.createImage(
        req.get('host') || 'http://localhost:5000',
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.path
      )
      console.log('newPicture', newPicture)
      res.json({ message: true })
    } else {
      res.json({ message: false })
    }
  })

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

  app.post(
    '/public/assets/images/default',
    uploadPicture.single('file'),
    async (req, res) => {
      if (req.file) {
        try {
          const picture = await createImage(req.file.filename)
          res.json(picture)
        } catch (error) {
          res.status(500).send('Error saving picture')
        }
      } else {
        res.status(400).send('No file was uploaded.')
      }
    }
  )
  // Api search adress.gouv//
  app.get('/search-address', async (req, res) => {
    try {
      const query = req.query.q
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=city=${query}&limit=5`
      )
      res.json(response.data)
    } catch (error) {
      console.error("Erreur lors de la requête à l'API:", error)
      res.status(500).send('Erreur interne du serveur')
    }
  })

  // Send contact email
  app.post('/sendcontactemail', verifyRecaptchaToken, sendContactEmail)
  //-----------------------------------------//
}
