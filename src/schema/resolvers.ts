import { mergeResolvers } from '@graphql-tools/merge';
import { bookResolvers } from '../modules/book/book.resolver.js';

export const resolvers = mergeResolvers([bookResolvers]);
