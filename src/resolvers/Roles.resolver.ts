import { Resolver, Mutation, Query, Arg, ID } from 'type-graphql'
import { Role, RoleCreateInput, RoleUpdateInput } from '../entities/Role'
import { validate } from 'class-validator'

@Resolver(Role)
export class RolesResolver {
  @Query(() => [Role])
  async rolesGetAll(): Promise<Role[]> {
    const roles = await Role.find({ relations: { user: true } })
    return roles
  }

  @Query(() => Role)
  async roleById(@Arg('id', () => ID) id: number): Promise<Role> {
    const role = await Role.findOne({
      where: { id },
      relations: { user: true },
    })
    if (!role) {
      throw new Error('Role not found')
    }
    return role
  }

  @Mutation(() => Role)
  async roleCreate(
    @Arg('data', () => RoleCreateInput) data: RoleCreateInput
  ): Promise<Role> {
    const newRole = new Role()
    Object.assign(newRole, data)
    const roleName: string = data.name
    // Verify if already exists
    const existingRoleName = await Role.findOne({ where: { name: roleName } })
    if (existingRoleName) {
      throw new Error('Role already exists')
    } else {
      // Validate before save
      const errors = await validate(newRole)
      if (errors.length === 0) {
        await newRole.save()
        return newRole
      }
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }
  }

  @Mutation(() => Role)
  async roleUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data', () => RoleUpdateInput) data: RoleUpdateInput
  ): Promise<Role> {
    const role = await Role.findOne({ where: { id } })
    if (!role) {
      throw new Error('Role not found')
    }

    Object.assign(role, data)
    const errors = await validate(role)
    if (errors.length === 0) {
      await role.save()
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }
    return role
  }

  @Mutation(() => Boolean)
  async roleDelete(@Arg('id', () => ID) id: number): Promise<boolean> {
    const role = await Role.findOne({ where: { id } })
    if (!role) {
      throw new Error('Role not found')
    }
    try {
      await role.remove()
      return true
    } catch (error) {
      throw new Error(`Error occured: ${error}`)
    }
  }
}
