import { OpenLibraryApi, type OpenLibraryApiContract } from './datasources/open-library-api.js';

export interface AppContext {
  dataSources: {
    openLibraryApi: OpenLibraryApiContract;
  };
}

export const createContext = (): AppContext => ({
  dataSources: {
    openLibraryApi: new OpenLibraryApi(),
  },
});
