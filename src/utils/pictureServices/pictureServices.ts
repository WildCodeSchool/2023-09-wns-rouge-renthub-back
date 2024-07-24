import express from 'express'
import multer from 'multer'
import path from 'path'
import fs, { promises as fsPromises } from 'fs'
import sharp from 'sharp'
import { copyFile } from '../copyFile'
import { v4 as uuidv4 } from 'uuid'
import { PictureService } from '../../services/Picture.service'
import { Picture } from '../../entities/Picture.entity'

const tempStoragePath = '/app/public/temp'
const finalStoragePath = '/app/public/images'
// fs.mkdirSync(finalStoragePath, { recursive: true })

// Temp storage for uploaded files
const tempStorage = multer.diskStorage({
  destination: (
    req: express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, tempStoragePath)
  },
  filename: (
    req: express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, file.originalname)
  },
})

export const uploadPicture = multer({ storage: tempStorage })

// Process the uploaded image
export const processImage = async (
  req: express.Request,
  res: express.Response
) => {
  if (req.file) {
    try {
      // recupere le chemin du fichier temporaire
      const tempFilePath = path.join(tempStoragePath, req.file.originalname)
      // recupere l'extension du fichier
      const ext = path.extname(req.file.originalname)
      // genere un nouveau nom de fichier
      const newFilename = `$${Date.now()}-${uuidv4()}${ext}`
      // recupere le chemin du fichier
      const finalFilePath = path.join(finalStoragePath, newFilename)
      const image = sharp(tempFilePath)
      const metadata = await image.metadata()

      if (
        (metadata.width && metadata.width > 1280) ||
        (metadata.height && metadata.height > 1280)
      ) {
        await image.resize(1280, 1280, { fit: 'contain' }).toFile(finalFilePath)
      } else {
        await copyFile(tempFilePath, finalFilePath)
      }

      // Delete the temp file
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath)
      }

      const picture = await new PictureService().createImage(
        newFilename,
        newFilename,
        newFilename,
        newFilename,
        newFilename
      )

      res.json({ pictureId: picture.id })
    } catch (error) {
      console.error('Error processing image:', error)
      res.status(500).send('Error processing image')
    }
  } else {
    res.status(400).send('No file was uploaded.')
  }
}

export async function deletePicture(
  pictureId: number
): Promise<Picture | null> {
  const picture = await Picture.findOneBy({ id: pictureId })

  if (picture) {
    try {
      await Picture.remove(picture)

      const filePath = path.join(
        __dirname,
        `../../public/images/${picture.name}`
      )
      await fsPromises.unlink(filePath)

      return picture
    } catch (error) {
      console.error('Error removing picture', error)
      throw new Error('Error removing picture')
    }
  } else {
    throw new Error('Picture not found')
  }
}
