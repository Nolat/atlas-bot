import { gql } from "apollo-boost";

export default gql`
  mutation addTitleBranch($name: String!, $factionName: String!) {
    addTitleBranch(name: $name, factionName: $factionName) {
      id
    }
  }
`;
