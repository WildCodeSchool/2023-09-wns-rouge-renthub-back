import { Picture, PictureCreateInput } from './../entities/Picture'
import { Repository } from 'typeorm'
import { validate } from 'class-validator'
import { dataSource } from '../datasource'

export class PictureService {
  db: Repository<Picture>

  constructor() {
    this.db = dataSource.getRepository(Picture)
  }

  async list() {
    const listPicture = this.db.find()
    return listPicture
  }

  async find(id: number) {
    const picture = await this.db.findOne({ where: { id } })
    if (!picture) {
      throw new Error('Picture not found')
    }
    return picture
  }

  async create(pictureInput: PictureCreateInput) {
    const errors = await validate(pictureInput)

    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }

    const newPicture = this.db.create(pictureInput)
    await this.db.save(newPicture)
    return newPicture
  }

  async delete(id: number) {
    const picture = await this.find(id) // Ensure picture exists
    await this.db.remove(picture)
  }
}
