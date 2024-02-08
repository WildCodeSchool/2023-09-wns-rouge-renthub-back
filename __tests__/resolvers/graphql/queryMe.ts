import { gql } from 'graphql-tag'

export const queryMe = gql`
  query {
    me {
      id
      email
    }
  }
`
