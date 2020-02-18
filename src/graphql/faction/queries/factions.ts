import { gql } from "apollo-boost";

export default gql`
  query factions {
    factions {
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
