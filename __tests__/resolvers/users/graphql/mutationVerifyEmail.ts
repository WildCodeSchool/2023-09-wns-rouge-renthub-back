import { gql } from 'graphql-tag'

export const mutationVerifyEmail = gql`
  mutation ($code: String!, $userId: Float!) {
    verifyEmail(code: $code, userId: $userId) {
      success
    }
  }
`
