import { SeederFactoryManager } from 'typeorm-extension'
import { Role } from '../../entities/Role'

export type RolesSeederTypes = {
  rolesSaved: Role[]
}

export default async function rolesSeeder(
  factoryManager: SeederFactoryManager
) {
  const rolesSaved: Role[] = []
  const roleFactory = factoryManager.get(Role)
  
  const rolesNames = [
    { groupName: 'Developers', rightForGroup: 'ADMIN' },
    { groupName: 'Users', rightForGroup: 'USER' },
  ]
  const countRoles = rolesNames.length
  const roles = await roleFactory.saveMany(countRoles) // Save a single role (Admin)
  roles.sort((a, b) => a.id - b.id)
  
  for (let i = 0; i < rolesNames.length; i++) {
    const role = roles[i]
    role.name = rolesNames[i].groupName
    role.right = rolesNames[i].rightForGroup

    const roleSaved = await role.save()
    rolesSaved.push(roleSaved)
  }

  return { rolesSaved }
}
