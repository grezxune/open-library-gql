export const subjectValues = ['FANTASY', 'HISTORY', 'SCIENCE'] as const;

export type BookSubject = (typeof subjectValues)[number];

export interface BookModel {
  id: string;
  name: string;
  detail: string | null;
  subject: BookSubject | null;
  metric: number;
  tags: string[];
}

export type BookLookupErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'UPSTREAM_ERROR';

export interface BookLookupError {
  code: BookLookupErrorCode;
  message: string;
}

export interface BookLookupResult {
  book: BookModel | null;
  error: BookLookupError | null;
}
