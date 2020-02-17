import { gql } from "apollo-boost";

export default gql`
  query userFaction($userId: String!) {
    user(id: $userId) {
      faction {
        id
      }
      joinedFactionAt
    }
  }
`;
