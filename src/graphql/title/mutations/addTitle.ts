import { gql } from "apollo-boost";

export default gql`
  mutation addTitle(
    $name: String!
    $level: Float
    $factionName: String
    $branchName: String
    $parentName: String
  ) {
    addTitle(
      name: $name
      level: $level
      factionName: $factionName
      branchName: $branchName
      parentName: $parentName
    ) {
      id
    }
  }
`;
