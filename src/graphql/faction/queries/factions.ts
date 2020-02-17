import { gql } from "apollo-boost";

export default gql`
  query factions {
    factions {
      id
      description
      name
      memberCount
      maxMember
      isJoinable
      icon
    }
  }
`;
