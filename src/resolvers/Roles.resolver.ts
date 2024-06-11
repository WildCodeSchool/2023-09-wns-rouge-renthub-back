import { Resolver, Mutation, Query, Arg, ID, Authorized } from 'type-graphql'
import { Role, RoleCreateInput, RoleUpdateInput } from '../entities/Role'
import { RoleService } from '../services/Role.service'

@Resolver(Role)
export class RolesResolver {
  @Authorized('ADMIN')
  @Query(() => [Role])
  async rolesGetAll(): Promise<Role[]> {
    const roles = await new RoleService().findAll()
    return roles
  }

  @Authorized('ADMIN')
  @Query(() => Role)
  async roleById(@Arg('id', () => ID) id: number): Promise<Role> {
    const role = await new RoleService().find(id)
    return role
  }

  @Authorized('ADMIN')
  @Mutation(() => Role)
  async roleCreate(
    @Arg('data', () => RoleCreateInput) data: RoleCreateInput
  ): Promise<Role> {
    const newRole = new RoleService().create(data)
    return newRole
  }

  @Authorized('ADMIN')
  @Mutation(() => Role)
  async roleUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data', () => RoleUpdateInput) data: RoleUpdateInput
  ): Promise<Role> {
    const role = await new RoleService().update(id, data)
    return role
  }

  @Authorized('ADMIN')
  @Mutation(() => Role)
  async roleDelete(@Arg('id', () => ID) id: number): Promise<Role> {
    const deletedRole = await new RoleService().delete(id)
    return deletedRole
  }
}
