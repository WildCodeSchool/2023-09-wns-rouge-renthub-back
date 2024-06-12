import { Picture } from '../../entities/Picture.entity'
import path from 'path'
import { promises as fsPromises } from 'fs'

export async function createImage(filename: string): Promise<Picture> {
  const picture = new Picture()
  picture.name = filename
  await picture.save()
  return picture
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
        `../../public/assets/images/pictures/${picture.name}`
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
