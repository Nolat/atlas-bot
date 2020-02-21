import { gql } from "apollo-boost";

export default gql`
  query userFaction($id: String!) {
    user(id: $id) {
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
