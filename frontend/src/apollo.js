import ApolloClient from 'apollo-client/ApolloClient';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client/lib/module/index';

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ` +
            `${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    new ApolloLink((operation, forward) => {
      operation.setContext(({ headers }) => ({
        headers: {
          ...headers,
          authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : "" // however you get your token
        }
      }));
      return forward(operation);
    }),
    createUploadLink({
      uri: process.env.API_URL,
      credentials: "same-origin"
    })
  ])
});
