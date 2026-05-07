import { startStandaloneServer } from '@apollo/server/standalone';
import { createContext } from './context.js';
import { createServer } from './server.js';

const port = Number(process.env.PORT ?? 4000);

async function main(): Promise<void> {
  const server = createServer();
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => createContext(),
  });

  console.log(`GraphQL server ready at ${url}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
