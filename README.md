# TypeScript + GraphQL Exercise

## Overview

You are joining a codebase that exposes a small GraphQL API over a REST datasource. The project uses modular GraphQL SDL, resolver composition, a typed context datasource, Zod DTO parsing, and focused tests.

## What You Are Building

You are implementing a small GraphQL service backed by the public [Open Library API](https://openlibrary.org/developers/api).

Use this REST API base URL when wiring the datasource:

```text
https://openlibrary.org
```

The schema exposes:

- `book(id: ID!): BookLookupResult!`
- `booksBySubject(subject: BookSubject!, limit: Int = 5): [Book!]!`

The public `Book` type stays intentionally small: `id`, `name`, `detail`, `tags`, and `summary`.

## Your Task

Make the supplied tests pass by completing:

- `src/context.ts`
- `src/modules/book/book.mapper.ts`
- `src/modules/book/book.resolver.ts`

Functional requirements:

- validate and normalize `id` for `book`
- return `INVALID_INPUT`, `NOT_FOUND`, and `UPSTREAM_ERROR` in the lookup result when appropriate
- map REST DTOs into the GraphQL model with null/default/sorted-array handling
- sort `booksBySubject` results by `name`, then apply `limit`
- treat negative limits as `0`
- compute a deterministic `Book.summary`

## How To Run

```bash
pnpm install
pnpm test
pnpm run typecheck
```
