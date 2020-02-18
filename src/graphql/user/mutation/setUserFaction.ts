import {gql} from "apollo-boost";

export default gql`
   mutation setUserFaction($factionName: String!, $id: String!){
    setUserFaction(factionName: $factionName, id: $id){
        id
    }   
   }
`;
