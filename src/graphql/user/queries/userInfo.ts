import { gql } from "apollo-boost";

export default gql`
  query userInfo($id: String!) {
    user(id: $id) {
      id
      username
      faction {
        name
        icon
        color
      }
      joinedFactionAt
      money
      experience
    }
  }
`;
