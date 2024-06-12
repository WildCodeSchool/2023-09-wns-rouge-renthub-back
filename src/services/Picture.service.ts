import { Category } from '../entities/Category.entity'
import { Picture, PictureCreateInput, PictureUpdate } from '../entities/Picture.entity'
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

  async find(id: number, includeCategory: boolean = true) {
    const relations: string[] = []

    if (includeCategory) {
      relations.push('category')
    }

    const picture = await this.db.findOne({
      where: { id },
      relations,
    })

    if (!picture) {
      throw new Error(`Picture with ${id} not found`)
    }
    return picture
  }

  async createImage(
    domain: string,
    filename: string,
    name: string,
    mimetype: string,
    path: string
  ) {
    try {
      const picture = this.db.create({
        name,
        mimetype,
        path,
        urlHD: ` http://${domain}/uploads/${filename}`,
        urlMiniature: ` http://${domain}/uploads/${filename}`,
        createdBy: 1,
      })

      const pictureSave = await picture.save()
      return pictureSave
    } catch (error) {
      throw new Error('Error creating picture')
    }
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
    if (!CategoryExist) {
      throw new Error(`Category with ID ${idCategory} not found`)
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
    idPicture: number,
    pictureInput: PictureUpdate,
    userId: number
  ) {
    const errors = await validate(pictureInput)

    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }

    const pictureUpdate: Picture | null = await this.db.findOne({
      where: { id: +idPicture },
      relations: ['category'],
    })
    if (!pictureUpdate) {
      throw new Error(`Picture with ID ${idPicture} not found`)
    }
    const pictureToSave = this.db.merge(pictureUpdate, {
      ...pictureInput,
      updatedBy: userId,
    })
    return await this.db.save(pictureToSave)
  }

  // delete picture do not delete category but remplacer pictureId by null
  // we dont need to delete category
  async deleteWithCategory(id: number) {
    const picture = await this.db.findOne({
      where: { id },
      relations: ['category'],
    })
    if (!picture) {
      throw new Error(`Picture with ${id} not found`)
    }
    if (picture?.category) {
      const category = await dataSource.getRepository(Category).findOne({
        where: { id: picture.category.id },
      })
      if (category) {
        Object.assign(category, { picture: null })
        console.log('----0--', category)
        await dataSource.getRepository(Category).save(category)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { affected } = await this.db.delete(picture.id)
    if (affected === 0) throw new Error('no delete affected on picture')
    return picture
  }
}
