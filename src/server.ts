import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginUsageReportingDisabled } from '@apollo/server/plugin/disabled';
import { type AppContext } from './context.js';
import { resolvers } from './schema/resolvers.js';
import { typeDefs } from './schema/type-defs.js';

export const createServer = (): ApolloServer<AppContext> =>
  new ApolloServer<AppContext>({
    plugins: [ApolloServerPluginUsageReportingDisabled()],
    typeDefs,
    resolvers,
  });
