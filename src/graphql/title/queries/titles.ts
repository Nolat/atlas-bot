import { gql } from "apollo-boost";

export default gql`
  query titles($factionName: String) {
    titles(factionName: $factionName) {
      id
      name
      level
      parent {
        id
        name
      }
      faction {
        name
      }
      branch {
        name
      }
    }
  }
`;
