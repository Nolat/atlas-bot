import { gql } from "apollo-boost";

export default gql`
  mutation removeUserExperience(
    $factionName: String!
    $experience: Float!
    $id: String!
  ) {
    removeUserExperience(
      factionName: $factionName
      experience: $experience
      id: $id
    ) {
      id
    }
  }
`;
