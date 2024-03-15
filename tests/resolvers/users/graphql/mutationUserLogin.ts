import { gql } from 'graphql-tag'

export const mutationUserLogin = gql`
  mutation ($data: UserLoginInput!) {
    userLogin(data: $data) {
      id
    }
  }
`
