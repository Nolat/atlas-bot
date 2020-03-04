import { gql } from "apollo-boost";

export default gql`
  mutation removeTitle($name: String!) {
    removeTitle(name: $name)
  }
`;
