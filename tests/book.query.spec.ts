import { describe, expect, it, vi } from 'vitest';
import { type AppContext } from '../src/context.js';
import { type RestBookRecord, UpstreamServiceError } from '../src/datasources/open-library-api.js';
import { createServer } from '../src/server.js';

const lookupQuery = /* GraphQL */ `
  query Lookup($id: ID!) {
    book(id: $id) {
      book {
        id
        name
        detail
        tags
        summary
      }
      error {
        code
        message
      }
    }
  }
`;


const primary: RestBookRecord = { id: 'OL262758W', name: 'The Hobbit', author: 'J. R. R. Tolkien', subjectName: 'Fantasy', firstPublished: 1937, subjects: ['Fantasy', 'Adventure'] };

const createMockContext = () => {
  const getBookById = vi.fn(async (_id: string) => null as RestBookRecord | null);

  const context: AppContext = {
    dataSources: {
      openLibraryApi: {
        getBookById,
      },
    },
  };

  return { context, getBookById };
};

const executeSingle = async (query: string, variables: Record<string, unknown>, contextValue: AppContext) => {
  const server = createServer();

  try {
    const response = await server.executeOperation({ query, variables }, { contextValue });

    if (response.body.kind !== 'single') {
      throw new Error('Expected a single GraphQL result.');
    }

    return response.body.singleResult;
  } finally {
    await server.stop();
  }
};

describe('book queries', () => {
  it('returns a mapped book and computed summary for a valid id', async () => {
    const { context, getBookById } = createMockContext();
    getBookById.mockResolvedValue(primary);

    const result = await executeSingle(lookupQuery, { id: ' ol262758w ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      book: {
        book: {
          id: 'OL262758W',
          name: 'The Hobbit',
          detail: 'J. R. R. Tolkien',
          tags: ['Adventure', 'Fantasy'],
          summary: 'The Hobbit (OL262758W) is a book in FANTASY. Detail: J. R. R. Tolkien. First published: 1,937.',
        },
        error: null,
      },
    });
    expect(getBookById).toHaveBeenCalledWith('OL262758W');
  });

  it('returns INVALID_INPUT and skips the datasource when the id is malformed', async () => {
    const { context, getBookById } = createMockContext();

    const result = await executeSingle(lookupQuery, { id: 'hobbit' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      book: {
        book: null,
        error: {
          code: 'INVALID_INPUT',
          message: 'Book id must look like an Open Library work id, for example OL45883W.',
        },
      },
    });
    expect(getBookById).not.toHaveBeenCalled();
  });

  it('returns NOT_FOUND when the datasource cannot find a book', async () => {
    const { context, getBookById } = createMockContext();
    getBookById.mockResolvedValue(null);

    const result = await executeSingle(lookupQuery, { id: 'OL999999W' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      book: {
        book: null,
        error: {
          code: 'NOT_FOUND',
          message: 'No book found for id "OL999999W".',
        },
      },
    });
  });

  it('returns UPSTREAM_ERROR when the datasource throws an upstream failure', async () => {
    const { context, getBookById } = createMockContext();
    getBookById.mockRejectedValue(new UpstreamServiceError('boom'));

    const result = await executeSingle(lookupQuery, { id: ' ol262758w ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      book: {
        book: null,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Open Library is currently unavailable.',
        },
      },
    });
  });
});
