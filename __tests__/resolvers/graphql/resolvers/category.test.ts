import { buildSchema } from 'type-graphql'
import { graphql } from 'graphql'
import { CategoriesResolver } from '../../../../src/resolvers/Category.resolver'
import { CategoryService } from '../../../../src/services/Category.services'
import { describe, expect, it, jest } from '@jest/globals'
import { Category } from '../../../../src/entities/Category'

describe('Categories Resolver - Snapshot', () => {
  it('should match snapshot', async () => {
    // Créer une  de service
    const service = new CategoryService()

    // Espionner la méthode list pour renvoyer des données fictives
    jest.spyOn(service, 'list').mockImplementation(async () => {
      return [
        {
          id: 1,
          name: 'Category 1',
          index: 1,
          display: true,
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          parentCategory: null, // Mettez la référence parente si nécessaire
          childCategories: [], // Ajoutez des catégories enfants si nécessaire
          picture: null, // Ajoutez une référence à l'image si nécessaires
          updateDatesOnInsert: jest.fn(),
          updateDatesOnUpdate: jest.fn(),
        } as unknown as Category,
      ]
    })
    // Construire le schéma GraphQL avec les résolveurs
    const schema = await buildSchema({
      resolvers: [CategoriesResolver],
      validate: true, // Désactiver la validation du schéma pour éviter les erreurs pendant les tests
    })

    // Exécuter la requête GraphQL
    const res = await graphql({
      schema,
      source: `
        query {
          listCategories {
            id
            name
            index
            display
            createdBy
            updatedBy
            createdAt
            updatedAt
            parentCategory {
              name
            }
            childCategories {
              name
            }
            picture {
              urlHD
            }
          }
        }
      `,
    })

    // Vérifier si les données renvoyées correspondent au snapshot
    expect(res).toMatchSnapshot()
  })

  // it('can get a list of categories', async () => {
  //   const catService = new CategoryService()
  //   await catService.create({
  //     id: 1,
  //     name: 'Mobilier',
  //     description:
  //       'Oat cake biscuit cookie chocolate pudding. Fruitcake cake cupcake bonbon pudding tiramisu jelly beans marzipan. Shortbread dessert chocolate biscuit jelly-o brownie. Toffee tootsie roll lollipop jelly beans powder croissant pie. Sesame snaps jelly-o dessert sugar plum donut caramels chocolate. Bear claw macaroon brownie cookie icing jelly sugar plum.',
  //     image:
  //       'https://www.highgest.fr/image/562535501368/1920/928/Les-petits-+.jpg',
  //   })

  //   await catService.create({
  //     id: 2,
  //     name: 'Eclairage',
  //     description:
  //       'Oat cake biscuit cookie chocolate pudding. Fruitcake cake cupcake bonbon pudding tiramisu jelly beans marzipan. Shortbread dessert chocolate biscuit jelly-o brownie. Toffee tootsie roll lollipop jelly beans powder croissant pie. Sesame snaps jelly-o dessert sugar plum donut caramels chocolate. Bear claw macaroon brownie cookie icing jelly sugar plum.',
  //     image:
  //       'https://www.highgest.fr/image/505818799390/1920/945/Les-petits-+.jpg',
  //   })

  //   const res = await execute(getCategories)
  //   expect(res).toMatchSnapshot()
  // })
  // it('can get one category by id', async () => {
  //   const cat3 = await Category.create({
  //     name: 'Sonorisation',
  //     description: 'Description de la catégorie Sonorisation',
  //     image: 'https://exemple.com/image_sonorisation.jpg',
  //   }).save()
  //   const res = await execute(getCategoryById, { categoryId: cat3.id })
  //   expect(res).toMatchSnapshot()
  // })
})
