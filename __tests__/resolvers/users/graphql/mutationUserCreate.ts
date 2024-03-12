import { gql } from 'graphql-tag'

export const mutationUserCreate = gql`
  mutation ($data: UserCreateInput!) {
    userCreate(data: $data) {
      id
    }
  }
`
