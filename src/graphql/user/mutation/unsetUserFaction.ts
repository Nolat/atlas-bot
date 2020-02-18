import {gql} from "apollo-boost";

export default gql`
    mutation unsetUserFaction($id: String!){
        unsetUserFaction(id: $id){
            id
        }
    }
`;
