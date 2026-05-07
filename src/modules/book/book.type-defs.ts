export const bookTypeDefs = /* GraphQL */ `
  enum BookLookupErrorCode {
    INVALID_INPUT
    NOT_FOUND
    UPSTREAM_ERROR
  }

  type BookLookupError {
    code: BookLookupErrorCode!
    message: String!
  }

  type Book {
    id: ID!
    name: String!
    detail: String
    tags: [String!]!
    summary: String!
  }

  type BookLookupResult {
    book: Book
    error: BookLookupError
  }

  extend type Query {
    book(id: ID!): BookLookupResult!
  }
`;
