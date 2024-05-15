import { Repository } from 'typeorm'
import { dataSource } from '../datasource'
import {
  ProductCart,
  ProductCartCreateInput,
  ProductCartUpdateInput,
} from '../entities/ProductCart.entity'
import { validate } from 'class-validator'

export class ProductCartService {
  db: Repository<ProductCart>
  constructor() {
    this.db = dataSource.getRepository(ProductCart)
  }

  async create(data: ProductCartCreateInput) {
    const newProductCart = this.db.create(data)
    const errors = await validate(newProductCart)
    if (errors.length > 0) throw new Error(`Validation failed! ${errors}`)
    const { id } = await this.db.save(newProductCart)
    const productCart = await this.find(id)
    return productCart
  }

  async findAll() {
    const listProductCarts = this.db.find({
      relations: { productReference: true, cartReference: true },
    })
    return listProductCarts
  }

  async find(id: number) {
    const productCart = await this.db.findOne({
      where: { id },
      relations: { productReference: { category: true }, cartReference: true },
    })
    if (!productCart) {
      throw new Error('ProductCart not found')
    }
    return productCart
  }
  /**
 * 
 ProductCartUpdateInput {
  @Field(() => Int, { nullable: true })
  quantity?: number

  @Field({ nullable: true })
  dateTimeStart?: Date

  @Field({ nullable: true })
  dateTimeEnd?: Date
 */
  async update(id: number, data: ProductCartUpdateInput) {
    const errors = await validate(data)
    if (errors.length > 0) throw new Error(`Validation failed! ${errors}`)

    const productCart = await this.db.findOne({
      where: { id },
      relations: {
        productReference: { category: true },
        cartReference: { owner: true },
      },
    })

    if (!productCart) throw new Error('ProductCart not found')

    Object.assign(productCart, data)

    const updatedCart = await this.db.save(productCart)
    return updatedCart
  }

  async delete(id: number) {
    const productCart = await this.db.findOne({
      where: { id },
      relations: {
        productReference: {
          pictureProduct: true,
          stock: true,
          productCart: true,
          category: true,
        },
        cartReference: true,
      },
    })
    if (!productCart) throw new Error("Stock doesn't exist")

    this.db.remove(productCart)
    return productCart
  }
}