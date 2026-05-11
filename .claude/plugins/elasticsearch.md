# Elasticsearch Plugin

Full-text search and analytics via Elasticsearch. Use for product/content search, log aggregation, or complex filtering that would be slow in PostgreSQL.

## Packages

```bash
npm install @elastic/elasticsearch @nestjs/elasticsearch
```

## Environment Variables

```
# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

## Module Structure

### `src/app/config/search.config.ts`

```typescript
registerAs('search', () => ({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  username: process.env.ELASTICSEARCH_USERNAME || '',
  password: process.env.ELASTICSEARCH_PASSWORD || '',
}))
```

### `src/common/search/search.module.ts`

Use `ElasticsearchModule.registerAsync` from `@nestjs/elasticsearch`:

```typescript
ElasticsearchModule.registerAsync({
  useFactory: (config: ConfigService) => ({
    node: config.getOrThrow('search.node'),
    auth: {
      username: config.getOrThrow('search.username'),
      password: config.getOrThrow('search.password'),
    },
  }),
  inject: [ConfigService],
})
```

Also provide and export: `SearchService`.

### `src/common/search/services/search.service.ts`

Key implementation details:
- Inject `ElasticsearchService` from `@nestjs/elasticsearch`
- In `onModuleInit`: call `this.elasticsearch.ping()` to verify connection; log success at `info` level
- Expose:
  - `indexDocument<T>(index: string, id: string, body: T): Promise<void>`
  - `search<T>(index: string, query: object): Promise<T[]>` — extracts `hits.hits._source`
  - `deleteDocument(index: string, id: string): Promise<void>`
  - `updateDocument<T>(index: string, id: string, body: Partial<T>): Promise<void>`

### `src/common/search/interfaces/search.interface.ts`

```typescript
export interface ISearchQuery {
  query: object;
  from?: number;
  size?: number;
  sort?: object[];
}

export interface IIndexOptions {
  index: string;
  id: string;
}
```

## CommonModule Wiring

Import `SearchModule` in `src/common/common.module.ts` and add to `exports`.

## Usage Example

```typescript
constructor(private readonly search: SearchService) {}

async indexUser(user: UserEntity): Promise<void> {
  await this.search.indexDocument('users', user.id, {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    createdAt: user.createdAt,
  });
}

async searchUsers(term: string): Promise<UserEntity[]> {
  return this.search.search<UserEntity>('users', {
    multi_match: { query: term, fields: ['email', 'name'] },
  });
}
```

## Notes

- Run Elasticsearch locally: `docker run --rm -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:8.17.0`
- For production, use [Elastic Cloud](https://www.elastic.co/cloud) or AWS OpenSearch
- Keep Elasticsearch in sync with Postgres via service hooks — index on create/update, delete on soft-delete
- Elasticsearch 8.x requires authentication by default; disable with `xpack.security.enabled=false` for local dev only
