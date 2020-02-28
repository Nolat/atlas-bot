import { gql } from "apollo-boost";

export default gql`
  mutation addTitle(
    $name: String!
    $level: Float!
    $factionName: String!
    $parentName: String
  ) {
    addTitle(
      name: $name
      level: $level
      factionName: $factionName
      parentName: $parentName
    ) {
      id
    }
  }
`;
