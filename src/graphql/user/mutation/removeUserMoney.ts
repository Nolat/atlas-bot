import { gql } from "apollo-boost";

export default gql`
  mutation removeUserMoney($id: String!, $amount: Float!) {
    removeUserMoney(id: $id, amount: $amount) {
      id
    }
  }
`;
