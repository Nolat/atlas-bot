import ApolloClient, { InMemoryCache } from "apollo-boost";

// * Environment variables
const API_ENDPOINT: string = process.env.API_ENDPOINT!;
const API_SECRET: string = process.env.API_SECRET!;

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${API_ENDPOINT}/graphql`,
  request: operation => {
    operation.setContext({
      headers: {
        authorization: API_SECRET
      }
    });
  }
});

export default client;
