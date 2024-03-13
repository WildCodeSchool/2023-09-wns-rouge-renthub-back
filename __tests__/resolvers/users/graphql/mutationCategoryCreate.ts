import { gql } from 'graphql-tag'

export const mutationCategoryCreate = gql`
  mutation ($data: UserCreateInput!) {
    userCreate(data: $data) {
      id
    }
  }
`
