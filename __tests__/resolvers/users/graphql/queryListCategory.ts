import { gql } from 'graphql-tag'

export const GET_CATEGORIES = gql`
  query listCategories {
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
`
