import { type RestBookRecord } from '../../datasources/open-library-api.js';
import { type BookModel } from './book.types.js';

export const mapRestBookToBook = (_book: RestBookRecord): BookModel => {
  // TODO:
  // - map the Open Library API DTO to the GraphQL-facing BookModel
  // - convert empty optional values to null where appropriate
  // - default numeric fields used by summary so output is deterministic
  // - sort tags alphabetically
  throw new Error('TODO: implement mapRestBookToBook');
};
