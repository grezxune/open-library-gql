import { mergeTypeDefs } from '@graphql-tools/merge';
import { bookTypeDefs } from '../modules/book/book.type-defs.js';

const baseTypeDefs = /* GraphQL */ `
  type Query {
    _empty: Boolean
  }
`;

export const typeDefs = mergeTypeDefs([baseTypeDefs, bookTypeDefs]);
