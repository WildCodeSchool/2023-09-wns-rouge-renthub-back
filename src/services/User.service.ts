import { Role } from '../entities/Role'

// ******************************* //
// THIS SERVICE CAN BE USED
// TO DELOCALIZE LOGIC
// TO LIGHTEN THE RESOLVERS //
// ******************************* //

/**
 * Retrieves or creates a user role with the right 'USER'.
 * If the role does not exist, it creates a new role with the name 'USERS' and the right 'USER'.
 * @returns A Promise that resolves to the user role.
 */
export async function getOrCreateUserRole(): Promise<Role> {
  let role: Role | null = await Role.findOne({ where: { right: 'USER' } })
  if (!role) {
    role = new Role()
    role.name = 'USERS'
    role.right = 'USER'
    await role.save()
  }
  return role
}
