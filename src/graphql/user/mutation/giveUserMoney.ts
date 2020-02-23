import { gql } from "apollo-boost";

export default gql`
  mutation giveUserMoney($id: String!, $money: Float!) {
    giveUserMoney(id: $id, money: $money) {
      id
    }
  }
`;
