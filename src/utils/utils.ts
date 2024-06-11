import { ValidationError } from 'class-validator'
import { ObjectId } from '../entities/ObjectId'
import { randomBytes } from 'crypto'
import { MyContext } from '../types/Context.type'

/**
 * Merge some data on an existing database entity, it takes care of keeping existing many-to-many relations to avoid unicity constraints
 * @param entity The base entity you want to merge your incomming data on (make sure to fetch many-to-many relations)
 * @param data The data payload you want to apply on your base entity (to update)
 * @returns The merged entity (the entity is updated as well)
 */
export function merge(entity: any, data: any): any {
  // should keep existing relations
  for (const [key, value] of Object.entries(data)) {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof ObjectId
    ) {
      if (!(key in entity)) {
        throw new Error(
          `missing key ${key} in your entity, did you forgot to fetch your relation?`
        )
      }
      if (Array.isArray(entity[key])) {
        data[key] = data[key].map((entry: ObjectId) => {
          const existingEntry = entity[key].find(
            (entityEntry: ObjectId) => entityEntry.id == entry.id
          )
          return existingEntry || entry
        })
      }
    }
  }
  Object.assign(entity, data)
  return entity
}

export const generateSecurityCode = (length: number): string => {
  return randomBytes(length).toString('hex').substring(0, length)
}

/** Function to provide precise(s) information(s) about the error(s) generated by Class Validator */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return ''
  }
  const validationMessages = errors
    .map((error) => {
      if (error.constraints) {
        return `${error.property}: ${Object.values(error.constraints).join(', ')}`
      } else {
        return `${error.property}: Erreur de validation non spécifiée.`
      }
    })
    .join('; ')
  return validationMessages
}

/**
 * Checks if the given user is the right user based on the provided context.
 * @param User - The user object to compare.
 * @param context - The context object containing user information.
 * @returns A boolean indicating whether the user is the right user.
 * True = The user is the right user.
 */
export const isRightUser = (userId: number, context: MyContext): boolean => {
  return (
    (context.user?.role.right === 'USER' && context.user?.id === userId) ||
    context.user?.role.right === 'ADMIN'
  )
}
