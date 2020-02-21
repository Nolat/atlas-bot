import { gql } from "apollo-boost";

export default gql`
  query userFaction($userId: String!) {
    user(id: $userId) {
      id
      username
      faction {
        id
        name
      }
      joinedFactionAt
    }
  }
`;
