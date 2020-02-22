import { gql } from "apollo-boost";

export default gql`
  mutation removeFaction($name: String!) {
    removeFaction(name: $name)
  }
`;
