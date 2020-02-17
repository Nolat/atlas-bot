import { gql } from "apollo-boost";

export default gql`
  query user($id: String!) {
    user(id: $id) {
      id
      username
    }
  }
`;
