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
  level: Scalars["Float"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
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
  addTitle: Title;
  removeTitle: Scalars["Boolean"];
  addTitleBranch: TitleBranch;
  removeTitleBranch: Scalars["Boolean"];
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

export type MutationAddTitleArgs = {
  parentName?: Maybe<Scalars["String"]>;
  branchName?: Maybe<Scalars["String"]>;
  factionName?: Maybe<Scalars["String"]>;
  level?: Maybe<Scalars["Float"]>;
  name: Scalars["String"];
};

export type MutationRemoveTitleArgs = {
  name: Scalars["String"];
};

export type MutationAddTitleBranchArgs = {
  factionName: Scalars["String"];
  name: Scalars["String"];
};

export type MutationRemoveTitleBranchArgs = {
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
  titles: Array<Title>;
  title: Title;
  titleBranches: Array<TitleBranch>;
  titleBranch: TitleBranch;
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

export type QueryTitlesArgs = {
  branchName?: Maybe<Scalars["String"]>;
  factionName?: Maybe<Scalars["String"]>;
};

export type QueryTitleArgs = {
  name: Scalars["String"];
};

export type QueryTitleBranchesArgs = {
  factionName?: Maybe<Scalars["String"]>;
};

export type QueryTitleBranchArgs = {
  name: Scalars["String"];
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type Title = {
  __typename?: "Title";
  id: Scalars["String"];
  name: Scalars["String"];
  level?: Maybe<Scalars["Float"]>;
  branch?: Maybe<TitleBranch>;
  faction?: Maybe<Faction>;
  parent?: Maybe<Title>;
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type TitleBranch = {
  __typename?: "TitleBranch";
  id: Scalars["String"];
  name: Scalars["String"];
  faction: Faction;
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["String"];
  username: Scalars["String"];
  titles: UserTitle;
  faction?: Maybe<Faction>;
  joinedFactionAt?: Maybe<Scalars["String"]>;
  money: Scalars["Float"];
  experience?: Maybe<Scalars["Float"]>;
  level?: Maybe<Scalars["Float"]>;
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type UserTitle = {
  __typename?: "UserTitle";
  id: Scalars["String"];
  user: User;
  title: Title;
  isEnabled: Scalars["Boolean"];
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

export type AddTitleMutationVariables = {
  name: Scalars["String"];
  level?: Maybe<Scalars["Float"]>;
  factionName?: Maybe<Scalars["String"]>;
  branchName?: Maybe<Scalars["String"]>;
  parentName?: Maybe<Scalars["String"]>;
};

export type AddTitleMutation = { __typename?: "Mutation" } & {
  addTitle: { __typename?: "Title" } & Pick<Title, "id">;
};

export type RemoveTitleMutationVariables = {
  name: Scalars["String"];
};

export type RemoveTitleMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "removeTitle"
>;

export type TitleQueryVariables = {
  name: Scalars["String"];
};

export type TitleQuery = { __typename?: "Query" } & {
  title: { __typename?: "Title" } & Pick<Title, "id">;
};

export type TitlesQueryVariables = {
  factionName?: Maybe<Scalars["String"]>;
};

export type TitlesQuery = { __typename?: "Query" } & {
  titles: Array<
    { __typename?: "Title" } & Pick<Title, "id" | "name" | "level"> & {
        parent: Maybe<{ __typename?: "Title" } & Pick<Title, "id" | "name">>;
        faction: Maybe<{ __typename?: "Faction" } & Pick<Faction, "name">>;
        branch: Maybe<
          { __typename?: "TitleBranch" } & Pick<TitleBranch, "name">
        >;
      }
  >;
};

export type AddTitleBranchMutationVariables = {
  name: Scalars["String"];
  factionName: Scalars["String"];
};

export type AddTitleBranchMutation = { __typename?: "Mutation" } & {
  addTitleBranch: { __typename?: "TitleBranch" } & Pick<TitleBranch, "id">;
};

export type RemoveTitleBranchMutationVariables = {
  name: Scalars["String"];
};

export type RemoveTitleBranchMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "removeTitleBranch"
>;

export type TitleBranchQueryVariables = {
  name: Scalars["String"];
};

export type TitleBranchQuery = { __typename?: "Query" } & {
  titleBranch: { __typename?: "TitleBranch" } & Pick<TitleBranch, "id">;
};

export type TitleBranchesQueryVariables = {
  factionName?: Maybe<Scalars["String"]>;
};

export type TitleBranchesQuery = { __typename?: "Query" } & {
  titleBranches: Array<
    { __typename?: "TitleBranch" } & Pick<TitleBranch, "id" | "name"> & {
        faction: { __typename?: "Faction" } & Pick<Faction, "id" | "name">;
      }
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
    "id" | "username" | "joinedFactionAt" | "money" | "experience" | "level"
  > & {
      faction: Maybe<
        { __typename?: "Faction" } & Pick<Faction, "name" | "icon" | "color">
      >;
    };
};
