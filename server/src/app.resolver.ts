import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  // Simple root query so GraphQL schema has a Query type
  @Query(() => String, { description: 'Health check / hello query' })
  hello(): string {
    return 'Hello GraphQL';
  }
}
