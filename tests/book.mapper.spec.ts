import { describe, expect, it } from 'vitest';
import { type RestBookRecord } from '../src/datasources/open-library-api.js';
import { mapRestBookToBook } from '../src/modules/book/book.mapper.js';

const primary: RestBookRecord = { id: 'OL262758W', name: 'The Hobbit', author: 'J. R. R. Tolkien', subjectName: 'Fantasy', firstPublished: 1937, subjects: ['Fantasy', 'Adventure'] };
const sparse: RestBookRecord = { id: 'OL1W', name: 'Anonymous Notes', author: '', subjectName: null, firstPublished: null, subjects: [] };

describe('mapRestBookToBook', () => {
  it('maps a Open Library API response into the GraphQL model', () => {
    expect(mapRestBookToBook(primary)).toEqual({ id: 'OL262758W', name: 'The Hobbit', detail: 'J. R. R. Tolkien', subject: 'FANTASY', metric: 1937, tags: ['Adventure', 'Fantasy'] });
  });

  it('normalizes empty optional values, defaults metrics, and sorts tags', () => {
    expect(mapRestBookToBook(sparse)).toEqual({ id: 'OL1W', name: 'Anonymous Notes', detail: null, subject: null, metric: 0, tags: [] });
  });
});
