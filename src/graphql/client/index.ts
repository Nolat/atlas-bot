import ApolloClient, { InMemoryCache } from "apollo-boost";

// * Environment variables
const { API_ENDPOINT, API_SECRET } = process.env;

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
