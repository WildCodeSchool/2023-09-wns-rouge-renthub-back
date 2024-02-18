import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { CategoryService } from '../../src/services/Category.services'
import { Category } from './../../src/entities/Category'

describe('CategoryService', () => {
  let categoryService: CategoryService

  beforeEach(() => {
    // Créez une nouvelle instance du service avant chaque test
    categoryService = new CategoryService()
  })

  it('should return a list of categories', async () => {
    // Créez des données fictives de catégorie
    const fakeCategories: Category[] = [
      {
        id: 1,
        name: 'Category 1',
        index: 1,
        display: true,
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        parentCategory: undefined, // Mettez la référence parente si nécessaire
        childCategories: [], // Ajoutez des catégories enfants si nécessaire
        picture: undefined, // Ajoutez une référence à l'image si nécessaires
        updateDatesOnInsert: () => new Date(), // Mettez la date d'insertion (ou une date fictive)
        updateDatesOnUpdate: () => new Date(),
        // autres champs et valeurs ici
      },
      {
        id: 2,
        name: 'Category 2',
        index: 1,
        display: true,
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        parentCategory: undefined, // Mettez la référence parente si nécessaire
        childCategories: [], // Ajoutez des catégories enfants si nécessaire
        picture: undefined, // Ajoutez une référence à l'image si nécessaires
        updateDatesOnInsert: () => new Date(), // Mettez la date d'insertion (ou une date fictive)
        updateDatesOnUpdate: () => new Date(),
      },
      // Ajoutez autant de catégories fictives que nécessaire
    ]

    // Mockez la méthode list du service pour retourner les données fictives
    jest.spyOn(categoryService, 'list').mockResolvedValue(fakeCategories)

    // Appelez la méthode listCategories
    const categories = await categoryService.list()

    // Assurez-vous que la méthode a retourné les catégories fictives
    expect(categories).toEqual(fakeCategories)
  })
})
