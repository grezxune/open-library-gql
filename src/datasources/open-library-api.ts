import { z } from 'zod';

const isPresentString = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const RestBookRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string().optional().nullable(),
  subjectName: z.string().optional().nullable(),
  firstPublished: z.number().optional().nullable(),
  subjects: z.array(z.string()).optional().nullable(),
});

const RawBookSchema = z.object({ key: z.string(), title: z.string(), authors: z.array(z.object({ name: z.string() })).optional().nullable(), first_publish_year: z.number().optional().nullable(), subjects: z.array(z.string()).optional().nullable(), subject: z.array(z.string()).optional().nullable() });
const stripWorkKey = (key: string): string => key.replace(/^\/works\//, '').toUpperCase();
const toRecord = (book: z.infer<typeof RawBookSchema>): RestBookRecord => ({ id: stripWorkKey(book.key), name: book.title, author: book.authors?.[0]?.name, subjectName: (book.subjects ?? book.subject)?.[0], firstPublished: book.first_publish_year, subjects: [...(book.subjects ?? []), ...(book.subject ?? [])] });
const parseOne = (body: unknown): RestBookRecord => toRecord(RawBookSchema.parse(body));

export type RestBookRecord = z.infer<typeof RestBookRecordSchema>;

export interface OpenLibraryApiContract {
  getBookById(id: string): Promise<RestBookRecord | null>;
}

export class UpstreamServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamServiceError';
  }
}

export class OpenLibraryApi implements OpenLibraryApiContract {
  constructor(private readonly baseUrl: string) {}

  async getBookById(id: string): Promise<RestBookRecord | null> {
    return this.fetchOne(`/works/${encodeURIComponent(id)}.json`, { allowNotFound: true });
  }

  private async fetchOne(path: string, options: { allowNotFound?: boolean } = {}): Promise<RestBookRecord | null> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (response.status === 404 && options.allowNotFound) {
      return null;
    }

    if (!response.ok) {
      throw new UpstreamServiceError(`Open Library API request failed with status ${response.status}`);
    }

    const body: unknown = await response.json();
    return parseOne(body);
  }
}
