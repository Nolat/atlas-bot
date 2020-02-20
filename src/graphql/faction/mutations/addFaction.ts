import { gql } from "apollo-boost";

export default gql`
  mutation addFaction(
    $name: String!
    $description: String!
    $icon: String!
    $color: String!
  ) {
    addFaction(
      name: $name
      description: $description
      icon: $icon
      color: $color
    ) {
      id
    }
  }
`;
