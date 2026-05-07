import { type AppContext } from '../../context.js';
import { type BookLookupResult, type BookModel, type BookSubject } from './book.types.js';

interface BookQueryArgs {
  id: string;
}

interface BookCollectionQueryArgs {
  subject: BookSubject;
  limit?: number | null;
}

const normalizeBookId = (id: string): string => id.trim().toUpperCase();

const isValidBookId = (id: string): boolean => /^OL\d+W$/.test(id);

export const bookResolvers = {
  Query: {
    book: async (_parent: unknown, arguments_: BookQueryArgs, _context: AppContext): Promise<BookLookupResult> => {
      const normalizedId = normalizeBookId(arguments_.id);

      if (!isValidBookId(normalizedId)) {
        return {
          book: null,
          error: {
            code: 'INVALID_INPUT',
            message: 'TODO: return a clearer invalid-input message',
          },
        };
      }

      // TODO:
      // - fetch the book from the datasource
      // - return NOT_FOUND when the datasource returns null
      // - return UPSTREAM_ERROR when the REST API is unavailable
      // - return the mapped book on success
      throw new Error('TODO: implement Query.book');
    },

    booksBySubject: async (_parent: unknown, _arguments: BookCollectionQueryArgs, _context: AppContext): Promise<BookModel[]> => {
      // TODO:
      // - fetch books for the requested subject
      // - map each DTO into the GraphQL model
      // - sort by name
      // - apply limit after sorting
      // - treat negative limits as 0
      throw new Error('TODO: implement Query.booksBySubject');
    },
  },

  Book: {
    summary: (_book: BookModel): string => {
      // TODO:
      // - derive a readable summary from the mapped BookModel
      // - include name, id, subject, metric, and detail/fallback
      throw new Error('TODO: implement Book.summary');
    },
  },
};
