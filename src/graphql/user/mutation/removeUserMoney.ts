import { gql } from "apollo-boost";

export default gql`
  mutation removeUserMoney($id: String!, $money: Float!) {
    removeUserMoney(id: $id, money: $money) {
      id
    }
  }
`;
