export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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
  setUserFaction: User;
  unsetUserFaction: User;
  createFaction: Faction;
};

export type MutationSetUserFactionArgs = {
  nameFaction: Scalars["String"];
  id: Scalars["String"];
};

export type MutationUnsetUserFactionArgs = {
  id: Scalars["String"];
};

export type MutationCreateFactionArgs = {
  icon: Scalars["String"];
  color: Scalars["String"];
  description: Scalars["String"];
  name: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  users: Array<User>;
  user: User;
  factions: Array<Faction>;
  faction: Faction;
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type QueryFactionArgs = {
  name: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["String"];
  username: Scalars["String"];
  faction?: Maybe<Faction>;
  joinedFactionAt?: Maybe<Scalars["String"]>;
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type FactionsQueryVariables = {};

export type FactionsQuery = { __typename?: "Query" } & {
  factions: Array<
    { __typename?: "Faction" } & Pick<
      Faction,
      | "id"
      | "description"
      | "name"
      | "memberCount"
      | "maxMember"
      | "isJoinable"
      | "icon"
    >
  >;
};

export type UserQueryVariables = {
  id: Scalars["String"];
};

export type UserQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<User, "id" | "username">;
};

export type UserFactionQueryVariables = {
  userId: Scalars["String"];
};

export type UserFactionQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<User, "joinedFactionAt"> & {
      faction: Maybe<{ __typename?: "Faction" } & Pick<Faction, "id">>;
    };
};
