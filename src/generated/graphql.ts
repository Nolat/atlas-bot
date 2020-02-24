export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Experience = {
  __typename?: "Experience";
  id: Scalars["String"];
  user: User;
  faction: Faction;
  value: Scalars["Float"];
};

export type Faction = {
  __typename?: "Faction";
  id: Scalars["String"];
  name: Scalars["String"];
  description: Scalars["String"];
  color: Scalars["String"];
  icon: Scalars["String"];
  memberCount: Scalars["Float"];
  maxMember: Scalars["Float"];
  isJoinable: Scalars["Boolean"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  giveUserExperience: Experience;
  removeUserExperience: Experience;
  addFaction: Faction;
  removeFaction: Scalars["Boolean"];
  setUserFaction: User;
  unsetUserFaction: User;
  giveUserMoney: User;
  removeUserMoney: User;
};

export type MutationGiveUserExperienceArgs = {
  factionName: Scalars["String"];
  experience: Scalars["Float"];
  id: Scalars["String"];
};

export type MutationRemoveUserExperienceArgs = {
  factionName: Scalars["String"];
  experience: Scalars["Float"];
  id: Scalars["String"];
};

export type MutationAddFactionArgs = {
  icon: Scalars["String"];
  color: Scalars["String"];
  description: Scalars["String"];
  name: Scalars["String"];
};

export type MutationRemoveFactionArgs = {
  name: Scalars["String"];
};

export type MutationSetUserFactionArgs = {
  factionName: Scalars["String"];
  id: Scalars["String"];
};

export type MutationUnsetUserFactionArgs = {
  id: Scalars["String"];
};

export type MutationGiveUserMoneyArgs = {
  money: Scalars["Float"];
  id: Scalars["String"];
};

export type MutationRemoveUserMoneyArgs = {
  amount: Scalars["Float"];
  id: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  experiences: Array<Experience>;
  experience: Experience;
  factions: Array<Faction>;
  faction: Faction;
  users: Array<User>;
  user: User;
};

export type QueryExperiencesArgs = {
  id?: Maybe<Scalars["String"]>;
};

export type QueryExperienceArgs = {
  factionName: Scalars["String"];
  id: Scalars["String"];
};

export type QueryFactionArgs = {
  name: Scalars["String"];
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type ServerMessage = {
  __typename?: "ServerMessage";
  id: Scalars["String"];
  idChannel: Scalars["String"];
  idMessage: Scalars["String"];
  type: Scalars["String"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["String"];
  username: Scalars["String"];
  faction?: Maybe<Faction>;
  joinedFactionAt?: Maybe<Scalars["String"]>;
  money: Scalars["Float"];
  experience?: Maybe<Scalars["Float"]>;
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type GiveUserExperienceMutationVariables = {
  factionName: Scalars["String"];
  experience: Scalars["Float"];
  id: Scalars["String"];
};

export type GiveUserExperienceMutation = { __typename?: "Mutation" } & {
  giveUserExperience: { __typename?: "Experience" } & Pick<Experience, "id">;
};

export type RemoveUserExperienceMutationVariables = {
  factionName: Scalars["String"];
  experience: Scalars["Float"];
  id: Scalars["String"];
};

export type RemoveUserExperienceMutation = { __typename?: "Mutation" } & {
  removeUserExperience: { __typename?: "Experience" } & Pick<Experience, "id">;
};

export type AddFactionMutationVariables = {
  name: Scalars["String"];
  description: Scalars["String"];
  icon: Scalars["String"];
  color: Scalars["String"];
};

export type AddFactionMutation = { __typename?: "Mutation" } & {
  addFaction: { __typename?: "Faction" } & Pick<Faction, "id">;
};

export type RemoveFactionMutationVariables = {
  name: Scalars["String"];
};

export type RemoveFactionMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "removeFaction"
>;

export type FactionQueryVariables = {
  name: Scalars["String"];
};

export type FactionQuery = { __typename?: "Query" } & {
  faction: { __typename?: "Faction" } & Pick<
    Faction,
    | "name"
    | "description"
    | "color"
    | "icon"
    | "memberCount"
    | "maxMember"
    | "isJoinable"
  >;
};

export type FactionsQueryVariables = {};

export type FactionsQuery = { __typename?: "Query" } & {
  factions: Array<
    { __typename?: "Faction" } & Pick<
      Faction,
      | "id"
      | "name"
      | "description"
      | "icon"
      | "color"
      | "memberCount"
      | "maxMember"
      | "isJoinable"
    >
  >;
};

export type GiveUserMoneyMutationVariables = {
  id: Scalars["String"];
  money: Scalars["Float"];
};

export type GiveUserMoneyMutation = { __typename?: "Mutation" } & {
  giveUserMoney: { __typename?: "User" } & Pick<User, "id">;
};

export type RemoveUserMoneyMutationVariables = {
  id: Scalars["String"];
  amount: Scalars["Float"];
};

export type RemoveUserMoneyMutation = { __typename?: "Mutation" } & {
  removeUserMoney: { __typename?: "User" } & Pick<User, "id">;
};

export type SetUserFactionMutationVariables = {
  factionName: Scalars["String"];
  id: Scalars["String"];
};

export type SetUserFactionMutation = { __typename?: "Mutation" } & {
  setUserFaction: { __typename?: "User" } & Pick<User, "id">;
};

export type UnsetUserFactionMutationVariables = {
  id: Scalars["String"];
};

export type UnsetUserFactionMutation = { __typename?: "Mutation" } & {
  unsetUserFaction: { __typename?: "User" } & Pick<User, "id">;
};

export type UserQueryVariables = {
  id: Scalars["String"];
};

export type UserQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<User, "id" | "username">;
};

export type UserFactionQueryVariables = {
  id: Scalars["String"];
};

export type UserFactionQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<
    User,
    "id" | "username" | "joinedFactionAt"
  > & {
      faction: Maybe<{ __typename?: "Faction" } & Pick<Faction, "id" | "name">>;
    };
};

export type UserInfoQueryVariables = {
  id: Scalars["String"];
};

export type UserInfoQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<
    User,
    "id" | "username" | "joinedFactionAt" | "money" | "experience"
  > & {
      faction: Maybe<
        { __typename?: "Faction" } & Pick<Faction, "name" | "icon" | "color">
      >;
    };
};
