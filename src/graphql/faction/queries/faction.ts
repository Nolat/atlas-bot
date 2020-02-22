import { gql } from "apollo-boost";

export default gql`
  query faction($name: String!) {
    faction(name: $name) {
      name
      description
      color
      icon
      memberCount
      maxMember
      isJoinable
    }
  }
`;
