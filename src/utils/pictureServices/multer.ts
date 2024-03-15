import multer from 'multer'
import path from 'path'
import express from 'express'

const generateFileName = (
  req: express.Request,
  picture: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void
) => {
  const ext = path.extname(picture.originalname)
  const now = new Date()
  const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now
    .getHours()
    .toString()
    .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
    .getSeconds()
    .toString()
    .padStart(2, '0')}`
  const filename = `${req.body.title.toUpperCase()}_${timestamp}${ext}`
  const safeFilename = filename.replace(/\s+/g, '_')
  cb(null, safeFilename)
}

const createMulterStorage = (destinationPath: string) =>
  multer.diskStorage({
    destination: (
      req: express.Request,
      picture: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      cb(null, destinationPath)
    },
    filename: generateFileName,
  })

export const uploadPicture = multer({
  storage: createMulterStorage('./public/assets/images/pictures'),
})
