import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ID,
  Authorized,
  Query,
} from 'type-graphql'
import { Picture, PictureCreateInput, PictureUpdate } from '../entities/Picture'
import { MyContext } from '../types/MyContext'
import { PictureService } from '../services/Picture.service'
// import { CategoryService } from '../services/Category.services'

// TODO OK
@Resolver(Picture)
export class PictureResolver {
  @Query(() => Picture)
  async findPictureOnCategory(@Arg('idCategory', () => ID) idCategory: number) {
    //  const idCategoryExist =  await new CategoryService().find(+idCategory)
    //  if (!idCategoryExist) throw new Error('Category not found')
    const pictureById = await new PictureService().find(+idCategory)
    console.log('----0--', pictureById)
    return pictureById
  }

  // @Query(() => [Category])
  // async getPictureByCategoryIds(
  //   @Arg('id', () => ID) id: number
  // ): Promise<Category[]> {
  //   const categories = await Category.find({
  //     where: { id: { $in: categoryIds } },
  //   })
  //   return categories
  // }

  // TODO OK
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Picture)
  async createPictureOnCategory(
    @Ctx() context: MyContext,
    @Arg('data', () => PictureCreateInput) data: PictureCreateInput,
    @Arg('idCategory', () => ID) idCategory: number
  ) {
    console.log('----1--', context.user, idCategory)
    if (!context.user) {
      throw new Error('Not authenticated')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const newPicture = await new PictureService().createOnCategory(
      data,
      idCategory,
      context.user.id
    )

    return newPicture
  }

  // TODO update picture on category
  @Authorized('ADMIN')
  @Mutation(() => Picture)
  async updatePictureOnCategory(
    @Ctx() context: MyContext,
    @Arg('idPicture', () => ID) idPicture: number,
    @Arg('dataPicture', () => PictureUpdate) data: PictureUpdate
  ) {
    if (!context.user) {
      throw new Error('Not authenticated')
    }

    return await new PictureService().updateOnCategory(
      idPicture,
      data,
      context.user.id
    )
  }
  // @Authorized('ADMIN', 'USER')
  // @Mutation(() => Picture)
  // async createPicture(
  //   @Ctx() context: MyContext,
  //   @Arg('data', () => PictureCreateInput) data: PictureCreateInput
  // ): Promise<Picture> {
  //   if (!context.user) {
  //     throw new Error('Not authenticated')
  //   }
  //   return createImage(data.filename)
  // }

  @Authorized('ADMIN')
  @Mutation(() => Picture, { nullable: true })
  async deletePicture(
    @Ctx() context: MyContext,
    @Arg('idPicture', () => ID) idPicture: number
  ) {
    if (!context.user) {
      throw new Error('Not authenticated')
    }

    return new PictureService().deleteWithCategory(idPicture)
  }
}
