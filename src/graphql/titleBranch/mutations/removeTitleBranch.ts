import { gql } from "apollo-boost";

export default gql`
  mutation removeTitleBranch($name: String!) {
    removeTitleBranch(name: $name)
  }
`;
