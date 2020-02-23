import { gql } from "apollo-boost";

export default gql`
  mutation giveUserExperience(
    $factionName: String!
    $experience: Float!
    $id: String!
  ) {
    giveUserExperience(
      factionName: $factionName
      experience: $experience
      id: $id
    ) {
      id
    }
  }
`;
