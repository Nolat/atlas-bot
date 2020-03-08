import { gql } from "apollo-boost";

export default gql`
  query title($name: String!) {
    title(name: $name) {
      id
    }
  }
`;
