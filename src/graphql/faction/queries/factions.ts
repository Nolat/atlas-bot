import { gql } from "apollo-boost";

export default gql`
  query factions {
    factions {
      id
      name
      description
      icon
      color
      memberCount
      maxMember
      isJoinable
    }
  }
`;
