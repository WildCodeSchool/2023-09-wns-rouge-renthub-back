import { Repository } from 'typeorm'
import { dataSource } from '../datasource'
import { Role, RoleCreateInput, RoleUpdateInput } from '../entities/Role'
import { validate } from 'class-validator'
import { formatValidationErrors } from '../utils/utils'

export class RoleService {
  db: Repository<Role>
  constructor() {
    this.db = dataSource.getRepository(Role)
  }

  async findAll() {
    const roles = await this.db.find({ relations: { user: true } })
    return roles
  }

  async find(id: number) {
    const role = await this.db.findOne({
      where: { id },
      relations: { user: true },
    })
    if (!role) throw new Error('Role not found')

    return role
  }

  async create(data: RoleCreateInput) {
    const newRole = new Role()
    Object.assign(newRole, data)

    // Validate before save
    const errors = await validate(newRole)
    if (errors.length > 0) {
      const validationMessages = formatValidationErrors(errors)
      throw new Error(validationMessages || 'Validation error occured')
    }
    await newRole.save()
    return newRole
  }

  async update(id: number, data: RoleUpdateInput) {
    const role = await this.db.findOne({
      where: { id },
      relations: { user: true },
    })
    if (!role) throw new Error('Role not found')

    Object.assign(role, data)
    const errors = await validate(role)
    if (errors.length > 0) {
      const validationMessages = formatValidationErrors(errors)
      throw new Error(validationMessages || 'Validation error occured')
    }

    await role.save()
    return role
  }

  async delete(id: number) {
    const role = await this.find(id)
    if (!role) throw new Error('Role not found')

    const deletedRole = await role.remove()
    Object.assign(deletedRole, { id })

    return deletedRole
  }
}
