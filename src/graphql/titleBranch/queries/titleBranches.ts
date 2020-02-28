import { gql } from "apollo-boost";

export default gql`
  query titleBranches($factionName: String) {
    titleBranches(factionName: $factionName) {
      id
      name
      faction {
        id
        name
      }
    }
  }
`;
