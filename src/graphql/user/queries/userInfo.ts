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
      titles {
        title {
          name
          level
          branch {
            name
          }
          faction {
            name
          }
        }
      }
      joinedFactionAt
      money
      experience
      level
    }
  }
`;
