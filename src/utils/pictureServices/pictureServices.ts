import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { copyFile } from '../copyFile'
import { v4 as uuidv4 } from 'uuid'

// folder tmp for temporary storage
const tempStoragePath = './public/assets/temp'
const finalStoragePath = './public/assets/images'

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
      const newFilename = `$${Date.now()}-${uuidv4()}.${ext}`
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

      res.json({ filename: newFilename })
      // creer picture
      // récupérer l'id et le retourner
      // associer avec product reference
    } catch (error) {
      console.error('Error processing image:', error)
      res.status(500).send('Error processing image')
    }
  } else {
    res.status(400).send('No file was uploaded.')
  }
}
