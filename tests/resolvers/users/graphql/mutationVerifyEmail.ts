import { gql } from 'graphql-tag'

export const mutationVerifyEmail = gql`
  mutation ($data: VerifyEmailResponseInput!) {
    verifyEmail(data: $data) {
      success
    }
  }
`
