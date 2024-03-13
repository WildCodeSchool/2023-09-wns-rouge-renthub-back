import { Category } from './../entities/Category'
import { Picture, PictureCreateInput } from '../entities/Picture'
import { Repository } from 'typeorm'
import { validate } from 'class-validator'
import { dataSource } from '../datasource'

export class PictureService {
  db: Repository<Picture>

  constructor() {
    this.db = dataSource.getRepository(Picture)
  }

  async list() {
    const listPicture = this.db.find({ relations: ['category'] })
    return listPicture
  }

  async find(id: number) {
    const picture = await this.db.findOne({
      where: { id },
      relations: ['category'],
    })
    if (!picture) {
      throw new Error('Picture not found')
    }

    return picture
  }

  async createOnCategory(
    pictureInput: PictureCreateInput,
    idCategory: number,
    userId: number
  ) {
    const errors = await validate(pictureInput)

    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }

    const CategoryExist = await dataSource.getRepository(Category).findOne({
      where: { id: idCategory },
    })
    console.log('c----------', CategoryExist)
    if (!CategoryExist) {
      throw new Error('Category not found')
    }

    const newPicture = this.db.create({
      ...pictureInput,
      createdBy: userId,
      category: CategoryExist,
    })
    await this.db.save(newPicture)
    return newPicture
  }

  async updateOnCategory(
    pictureInput: PictureCreateInput,
    idCategory: number,
    userId: number
  ) {
    const errors = await validate(pictureInput)

    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }

    const CategoryExist = await dataSource.getRepository(Category).findOne({
      where: { id: idCategory },
    })
    console.log('c----------', CategoryExist)
    if (!CategoryExist) {
      throw new Error('Category not found')
    }

    const newPicture = this.db.create({
      ...pictureInput,
      createdBy: userId,
      category: CategoryExist,
    })
    await this.db.save(newPicture)
    return newPicture
  }
  // async function createImage(filename: string) {
  //   const newPicture = this.db.create(pictureInput)
  //   picture.filename = filename
  //   await picture.save()
  //   return picture
  // }
  async delete(id: number) {
    const picture = await this.find(id) // Ensure picture exists
    await this.db.remove(picture)
  }
}
