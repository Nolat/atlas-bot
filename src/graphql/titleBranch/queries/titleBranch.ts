import { gql } from "apollo-boost";

export default gql`
  query titleBranch($name: String!) {
    titleBranch(name: $name) {
      id
    }
  }
`;
