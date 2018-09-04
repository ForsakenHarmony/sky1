import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { Options } from 'graphql-binding'
import { makePrismaBindingClass, BasePrismaOptions } from 'prisma-binding'

export interface Query {
    users: <T = User[]>(args: { where?: UserWhereInput, orderBy?: UserOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    creations: <T = Creation[]>(args: { where?: CreationWhereInput, orderBy?: CreationOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    files: <T = File[]>(args: { where?: FileWhereInput, orderBy?: FileOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    user: <T = User | null>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    creation: <T = Creation | null>(args: { where: CreationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    file: <T = File | null>(args: { where: FileWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    usersConnection: <T = UserConnection>(args: { where?: UserWhereInput, orderBy?: UserOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    creationsConnection: <T = CreationConnection>(args: { where?: CreationWhereInput, orderBy?: CreationOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    filesConnection: <T = FileConnection>(args: { where?: FileWhereInput, orderBy?: FileOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    node: <T = Node | null>(args: { id: ID_Output }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createUser: <T = User>(args: { data: UserCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createCreation: <T = Creation>(args: { data: CreationCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createFile: <T = File>(args: { data: FileCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateUser: <T = User | null>(args: { data: UserUpdateInput, where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateCreation: <T = Creation | null>(args: { data: CreationUpdateInput, where: CreationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateFile: <T = File | null>(args: { data: FileUpdateInput, where: FileWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteUser: <T = User | null>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteCreation: <T = Creation | null>(args: { where: CreationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteFile: <T = File | null>(args: { where: FileWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertUser: <T = User>(args: { where: UserWhereUniqueInput, create: UserCreateInput, update: UserUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertCreation: <T = Creation>(args: { where: CreationWhereUniqueInput, create: CreationCreateInput, update: CreationUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertFile: <T = File>(args: { where: FileWhereUniqueInput, create: FileCreateInput, update: FileUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyUsers: <T = BatchPayload>(args: { data: UserUpdateInput, where?: UserWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyCreations: <T = BatchPayload>(args: { data: CreationUpdateInput, where?: CreationWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyFiles: <T = BatchPayload>(args: { data: FileUpdateInput, where?: FileWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyUsers: <T = BatchPayload>(args: { where?: UserWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyCreations: <T = BatchPayload>(args: { where?: CreationWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyFiles: <T = BatchPayload>(args: { where?: FileWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {
    user: <T = UserSubscriptionPayload | null>(args: { where?: UserSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    creation: <T = CreationSubscriptionPayload | null>(args: { where?: CreationSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    file: <T = FileSubscriptionPayload | null>(args: { where?: FileSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Exists {
  User: (where?: UserWhereInput) => Promise<boolean>
  Creation: (where?: CreationWhereInput) => Promise<boolean>
  File: (where?: FileWhereInput) => Promise<boolean>
}

export interface Prisma {
  query: Query
  mutation: Mutation
  subscription: Subscription
  exists: Exists
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
delegateSubscription(fieldName: string, args?: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(options: BasePrismaOptions): T
}
/**
 * Type Defs
*/

const typeDefs = `type AggregateCreation {
  count: Int!
}

type AggregateFile {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  """The number of nodes that have been affected by the Batch operation."""
  count: Long!
}

type Creation implements Node {
  id: ID!
  likes: Int!
  name: String!
  description: String!
  status: Status!
  pictures(where: FileWhereInput, orderBy: FileOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [File!]
  file(where: FileWhereInput): File
  tags: [String!]!
  creator(where: UserWhereInput): User!
}

"""A connection to a list of items."""
type CreationConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [CreationEdge]!
  aggregate: AggregateCreation!
}

input CreationCreateInput {
  likes: Int!
  name: String!
  description: String!
  status: Status!
  tags: CreationCreatetagsInput
  pictures: FileCreateManyInput
  file: FileCreateOneInput
  creator: UserCreateOneWithoutCreationsInput!
}

input CreationCreateManyWithoutCreatorInput {
  create: [CreationCreateWithoutCreatorInput!]
  connect: [CreationWhereUniqueInput!]
}

input CreationCreatetagsInput {
  set: [String!]
}

input CreationCreateWithoutCreatorInput {
  likes: Int!
  name: String!
  description: String!
  status: Status!
  tags: CreationCreatetagsInput
  pictures: FileCreateManyInput
  file: FileCreateOneInput
}

"""An edge in a connection."""
type CreationEdge {
  """The item at the end of the edge."""
  node: Creation!

  """A cursor for use in pagination."""
  cursor: String!
}

enum CreationOrderByInput {
  id_ASC
  id_DESC
  likes_ASC
  likes_DESC
  name_ASC
  name_DESC
  description_ASC
  description_DESC
  status_ASC
  status_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type CreationPreviousValues {
  id: ID!
  likes: Int!
  name: String!
  description: String!
  status: Status!
  tags: [String!]!
}

type CreationSubscriptionPayload {
  mutation: MutationType!
  node: Creation
  updatedFields: [String!]
  previousValues: CreationPreviousValues
}

input CreationSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [CreationSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [CreationSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [CreationSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: CreationWhereInput
}

input CreationUpdateInput {
  likes: Int
  name: String
  description: String
  status: Status
  tags: CreationUpdatetagsInput
  pictures: FileUpdateManyInput
  file: FileUpdateOneInput
  creator: UserUpdateOneWithoutCreationsInput
}

input CreationUpdateManyWithoutCreatorInput {
  create: [CreationCreateWithoutCreatorInput!]
  connect: [CreationWhereUniqueInput!]
  disconnect: [CreationWhereUniqueInput!]
  delete: [CreationWhereUniqueInput!]
  update: [CreationUpdateWithWhereUniqueWithoutCreatorInput!]
  upsert: [CreationUpsertWithWhereUniqueWithoutCreatorInput!]
}

input CreationUpdatetagsInput {
  set: [String!]
}

input CreationUpdateWithoutCreatorDataInput {
  likes: Int
  name: String
  description: String
  status: Status
  tags: CreationUpdatetagsInput
  pictures: FileUpdateManyInput
  file: FileUpdateOneInput
}

input CreationUpdateWithWhereUniqueWithoutCreatorInput {
  where: CreationWhereUniqueInput!
  data: CreationUpdateWithoutCreatorDataInput!
}

input CreationUpsertWithWhereUniqueWithoutCreatorInput {
  where: CreationWhereUniqueInput!
  update: CreationUpdateWithoutCreatorDataInput!
  create: CreationCreateWithoutCreatorInput!
}

input CreationWhereInput {
  """Logical AND on all given filters."""
  AND: [CreationWhereInput!]

  """Logical OR on all given filters."""
  OR: [CreationWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [CreationWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  likes: Int

  """All values that are not equal to given value."""
  likes_not: Int

  """All values that are contained in given list."""
  likes_in: [Int!]

  """All values that are not contained in given list."""
  likes_not_in: [Int!]

  """All values less than the given value."""
  likes_lt: Int

  """All values less than or equal the given value."""
  likes_lte: Int

  """All values greater than the given value."""
  likes_gt: Int

  """All values greater than or equal the given value."""
  likes_gte: Int
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  description: String

  """All values that are not equal to given value."""
  description_not: String

  """All values that are contained in given list."""
  description_in: [String!]

  """All values that are not contained in given list."""
  description_not_in: [String!]

  """All values less than the given value."""
  description_lt: String

  """All values less than or equal the given value."""
  description_lte: String

  """All values greater than the given value."""
  description_gt: String

  """All values greater than or equal the given value."""
  description_gte: String

  """All values containing the given string."""
  description_contains: String

  """All values not containing the given string."""
  description_not_contains: String

  """All values starting with the given string."""
  description_starts_with: String

  """All values not starting with the given string."""
  description_not_starts_with: String

  """All values ending with the given string."""
  description_ends_with: String

  """All values not ending with the given string."""
  description_not_ends_with: String
  status: Status

  """All values that are not equal to given value."""
  status_not: Status

  """All values that are contained in given list."""
  status_in: [Status!]

  """All values that are not contained in given list."""
  status_not_in: [Status!]
  pictures_every: FileWhereInput
  pictures_some: FileWhereInput
  pictures_none: FileWhereInput
  file: FileWhereInput
  creator: UserWhereInput
}

input CreationWhereUniqueInput {
  id: ID
}

type File {
  id: UUID!
  name: String!
  url: String!
}

"""A connection to a list of items."""
type FileConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [FileEdge]!
  aggregate: AggregateFile!
}

input FileCreateInput {
  name: String!
  url: String!
}

input FileCreateManyInput {
  create: [FileCreateInput!]
  connect: [FileWhereUniqueInput!]
}

input FileCreateOneInput {
  create: FileCreateInput
  connect: FileWhereUniqueInput
}

"""An edge in a connection."""
type FileEdge {
  """The item at the end of the edge."""
  node: File!

  """A cursor for use in pagination."""
  cursor: String!
}

enum FileOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  url_ASC
  url_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type FilePreviousValues {
  id: UUID!
  name: String!
  url: String!
}

type FileSubscriptionPayload {
  mutation: MutationType!
  node: File
  updatedFields: [String!]
  previousValues: FilePreviousValues
}

input FileSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [FileSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [FileSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [FileSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: FileWhereInput
}

input FileUpdateDataInput {
  name: String
  url: String
}

input FileUpdateInput {
  name: String
  url: String
}

input FileUpdateManyInput {
  create: [FileCreateInput!]
  connect: [FileWhereUniqueInput!]
  disconnect: [FileWhereUniqueInput!]
  delete: [FileWhereUniqueInput!]
  update: [FileUpdateWithWhereUniqueNestedInput!]
  upsert: [FileUpsertWithWhereUniqueNestedInput!]
}

input FileUpdateOneInput {
  create: FileCreateInput
  connect: FileWhereUniqueInput
  disconnect: Boolean
  delete: Boolean
  update: FileUpdateDataInput
  upsert: FileUpsertNestedInput
}

input FileUpdateWithWhereUniqueNestedInput {
  where: FileWhereUniqueInput!
  data: FileUpdateDataInput!
}

input FileUpsertNestedInput {
  update: FileUpdateDataInput!
  create: FileCreateInput!
}

input FileUpsertWithWhereUniqueNestedInput {
  where: FileWhereUniqueInput!
  update: FileUpdateDataInput!
  create: FileCreateInput!
}

input FileWhereInput {
  """Logical AND on all given filters."""
  AND: [FileWhereInput!]

  """Logical OR on all given filters."""
  OR: [FileWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [FileWhereInput!]
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  url: String

  """All values that are not equal to given value."""
  url_not: String

  """All values that are contained in given list."""
  url_in: [String!]

  """All values that are not contained in given list."""
  url_not_in: [String!]

  """All values less than the given value."""
  url_lt: String

  """All values less than or equal the given value."""
  url_lte: String

  """All values greater than the given value."""
  url_gt: String

  """All values greater than or equal the given value."""
  url_gte: String

  """All values containing the given string."""
  url_contains: String

  """All values not containing the given string."""
  url_not_contains: String

  """All values starting with the given string."""
  url_starts_with: String

  """All values not starting with the given string."""
  url_not_starts_with: String

  """All values ending with the given string."""
  url_ends_with: String

  """All values not ending with the given string."""
  url_not_ends_with: String
}

input FileWhereUniqueInput {
  id: UUID
}

"""
The \`Long\` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
"""
scalar Long

type Mutation {
  createUser(data: UserCreateInput!): User!
  createCreation(data: CreationCreateInput!): Creation!
  createFile(data: FileCreateInput!): File!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateCreation(data: CreationUpdateInput!, where: CreationWhereUniqueInput!): Creation
  updateFile(data: FileUpdateInput!, where: FileWhereUniqueInput!): File
  deleteUser(where: UserWhereUniqueInput!): User
  deleteCreation(where: CreationWhereUniqueInput!): Creation
  deleteFile(where: FileWhereUniqueInput!): File
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  upsertCreation(where: CreationWhereUniqueInput!, create: CreationCreateInput!, update: CreationUpdateInput!): Creation!
  upsertFile(where: FileWhereUniqueInput!, create: FileCreateInput!, update: FileUpdateInput!): File!
  updateManyUsers(data: UserUpdateInput!, where: UserWhereInput): BatchPayload!
  updateManyCreations(data: CreationUpdateInput!, where: CreationWhereInput): BatchPayload!
  updateManyFiles(data: FileUpdateInput!, where: FileWhereInput): BatchPayload!
  deleteManyUsers(where: UserWhereInput): BatchPayload!
  deleteManyCreations(where: CreationWhereInput): BatchPayload!
  deleteManyFiles(where: FileWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

"""An object with an ID"""
interface Node {
  """The id of the object."""
  id: ID!
}

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: String

  """When paginating forwards, the cursor to continue."""
  endCursor: String
}

type Query {
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  creations(where: CreationWhereInput, orderBy: CreationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Creation]!
  files(where: FileWhereInput, orderBy: FileOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [File]!
  user(where: UserWhereUniqueInput!): User
  creation(where: CreationWhereUniqueInput!): Creation
  file(where: FileWhereUniqueInput!): File
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  creationsConnection(where: CreationWhereInput, orderBy: CreationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CreationConnection!
  filesConnection(where: FileWhereInput, orderBy: FileOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): FileConnection!

  """Fetches an object given its ID"""
  node(
    """The ID of an object"""
    id: ID!
  ): Node
}

enum Role {
  USER
  ADMIN
}

enum Status {
  WIP
  COMPLETED
}

type Subscription {
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
  creation(where: CreationSubscriptionWhereInput): CreationSubscriptionPayload
  file(where: FileSubscriptionWhereInput): FileSubscriptionPayload
}

type User {
  id: UUID!
  discord_id: String!
  username: String!
  email: String!
  avatar: String!
  creations(where: CreationWhereInput, orderBy: CreationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Creation!]
  role: Role!
}

"""A connection to a list of items."""
type UserConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  discord_id: String!
  username: String!
  email: String!
  avatar: String!
  role: Role!
  creations: CreationCreateManyWithoutCreatorInput
}

input UserCreateOneWithoutCreationsInput {
  create: UserCreateWithoutCreationsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutCreationsInput {
  discord_id: String!
  username: String!
  email: String!
  avatar: String!
  role: Role!
}

"""An edge in a connection."""
type UserEdge {
  """The item at the end of the edge."""
  node: User!

  """A cursor for use in pagination."""
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  discord_id_ASC
  discord_id_DESC
  username_ASC
  username_DESC
  email_ASC
  email_DESC
  avatar_ASC
  avatar_DESC
  role_ASC
  role_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type UserPreviousValues {
  id: UUID!
  discord_id: String!
  username: String!
  email: String!
  avatar: String!
  role: Role!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [UserSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [UserSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [UserSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: UserWhereInput
}

input UserUpdateInput {
  discord_id: String
  username: String
  email: String
  avatar: String
  role: Role
  creations: CreationUpdateManyWithoutCreatorInput
}

input UserUpdateOneWithoutCreationsInput {
  create: UserCreateWithoutCreationsInput
  connect: UserWhereUniqueInput
  delete: Boolean
  update: UserUpdateWithoutCreationsDataInput
  upsert: UserUpsertWithoutCreationsInput
}

input UserUpdateWithoutCreationsDataInput {
  discord_id: String
  username: String
  email: String
  avatar: String
  role: Role
}

input UserUpsertWithoutCreationsInput {
  update: UserUpdateWithoutCreationsDataInput!
  create: UserCreateWithoutCreationsInput!
}

input UserWhereInput {
  """Logical AND on all given filters."""
  AND: [UserWhereInput!]

  """Logical OR on all given filters."""
  OR: [UserWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [UserWhereInput!]
  discord_id: String

  """All values that are not equal to given value."""
  discord_id_not: String

  """All values that are contained in given list."""
  discord_id_in: [String!]

  """All values that are not contained in given list."""
  discord_id_not_in: [String!]

  """All values less than the given value."""
  discord_id_lt: String

  """All values less than or equal the given value."""
  discord_id_lte: String

  """All values greater than the given value."""
  discord_id_gt: String

  """All values greater than or equal the given value."""
  discord_id_gte: String

  """All values containing the given string."""
  discord_id_contains: String

  """All values not containing the given string."""
  discord_id_not_contains: String

  """All values starting with the given string."""
  discord_id_starts_with: String

  """All values not starting with the given string."""
  discord_id_not_starts_with: String

  """All values ending with the given string."""
  discord_id_ends_with: String

  """All values not ending with the given string."""
  discord_id_not_ends_with: String
  username: String

  """All values that are not equal to given value."""
  username_not: String

  """All values that are contained in given list."""
  username_in: [String!]

  """All values that are not contained in given list."""
  username_not_in: [String!]

  """All values less than the given value."""
  username_lt: String

  """All values less than or equal the given value."""
  username_lte: String

  """All values greater than the given value."""
  username_gt: String

  """All values greater than or equal the given value."""
  username_gte: String

  """All values containing the given string."""
  username_contains: String

  """All values not containing the given string."""
  username_not_contains: String

  """All values starting with the given string."""
  username_starts_with: String

  """All values not starting with the given string."""
  username_not_starts_with: String

  """All values ending with the given string."""
  username_ends_with: String

  """All values not ending with the given string."""
  username_not_ends_with: String
  email: String

  """All values that are not equal to given value."""
  email_not: String

  """All values that are contained in given list."""
  email_in: [String!]

  """All values that are not contained in given list."""
  email_not_in: [String!]

  """All values less than the given value."""
  email_lt: String

  """All values less than or equal the given value."""
  email_lte: String

  """All values greater than the given value."""
  email_gt: String

  """All values greater than or equal the given value."""
  email_gte: String

  """All values containing the given string."""
  email_contains: String

  """All values not containing the given string."""
  email_not_contains: String

  """All values starting with the given string."""
  email_starts_with: String

  """All values not starting with the given string."""
  email_not_starts_with: String

  """All values ending with the given string."""
  email_ends_with: String

  """All values not ending with the given string."""
  email_not_ends_with: String
  avatar: String

  """All values that are not equal to given value."""
  avatar_not: String

  """All values that are contained in given list."""
  avatar_in: [String!]

  """All values that are not contained in given list."""
  avatar_not_in: [String!]

  """All values less than the given value."""
  avatar_lt: String

  """All values less than or equal the given value."""
  avatar_lte: String

  """All values greater than the given value."""
  avatar_gt: String

  """All values greater than or equal the given value."""
  avatar_gte: String

  """All values containing the given string."""
  avatar_contains: String

  """All values not containing the given string."""
  avatar_not_contains: String

  """All values starting with the given string."""
  avatar_starts_with: String

  """All values not starting with the given string."""
  avatar_not_starts_with: String

  """All values ending with the given string."""
  avatar_ends_with: String

  """All values not ending with the given string."""
  avatar_not_ends_with: String
  role: Role

  """All values that are not equal to given value."""
  role_not: Role

  """All values that are contained in given list."""
  role_in: [Role!]

  """All values that are not contained in given list."""
  role_not_in: [Role!]
  creations_every: CreationWhereInput
  creations_some: CreationWhereInput
  creations_none: CreationWhereInput
}

input UserWhereUniqueInput {
  id: UUID
  discord_id: String
}

"""A type 4 UUID according to IETF RFC 4122."""
scalar UUID
`

export const Prisma = makePrismaBindingClass<BindingConstructor<Prisma>>({typeDefs})

/**
 * Types
*/

export type UserOrderByInput =   'id_ASC' |
  'id_DESC' |
  'discord_id_ASC' |
  'discord_id_DESC' |
  'username_ASC' |
  'username_DESC' |
  'email_ASC' |
  'email_DESC' |
  'avatar_ASC' |
  'avatar_DESC' |
  'role_ASC' |
  'role_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type Status =   'WIP' |
  'COMPLETED'

export type CreationOrderByInput =   'id_ASC' |
  'id_DESC' |
  'likes_ASC' |
  'likes_DESC' |
  'name_ASC' |
  'name_DESC' |
  'description_ASC' |
  'description_DESC' |
  'status_ASC' |
  'status_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type FileOrderByInput =   'id_ASC' |
  'id_DESC' |
  'name_ASC' |
  'name_DESC' |
  'url_ASC' |
  'url_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type MutationType =   'CREATED' |
  'UPDATED' |
  'DELETED'

export type Role =   'USER' |
  'ADMIN'

export interface FileCreateManyInput {
  create?: FileCreateInput[] | FileCreateInput
  connect?: FileWhereUniqueInput[] | FileWhereUniqueInput
}

export interface UserWhereInput {
  AND?: UserWhereInput[] | UserWhereInput
  OR?: UserWhereInput[] | UserWhereInput
  NOT?: UserWhereInput[] | UserWhereInput
  discord_id?: String
  discord_id_not?: String
  discord_id_in?: String[] | String
  discord_id_not_in?: String[] | String
  discord_id_lt?: String
  discord_id_lte?: String
  discord_id_gt?: String
  discord_id_gte?: String
  discord_id_contains?: String
  discord_id_not_contains?: String
  discord_id_starts_with?: String
  discord_id_not_starts_with?: String
  discord_id_ends_with?: String
  discord_id_not_ends_with?: String
  username?: String
  username_not?: String
  username_in?: String[] | String
  username_not_in?: String[] | String
  username_lt?: String
  username_lte?: String
  username_gt?: String
  username_gte?: String
  username_contains?: String
  username_not_contains?: String
  username_starts_with?: String
  username_not_starts_with?: String
  username_ends_with?: String
  username_not_ends_with?: String
  email?: String
  email_not?: String
  email_in?: String[] | String
  email_not_in?: String[] | String
  email_lt?: String
  email_lte?: String
  email_gt?: String
  email_gte?: String
  email_contains?: String
  email_not_contains?: String
  email_starts_with?: String
  email_not_starts_with?: String
  email_ends_with?: String
  email_not_ends_with?: String
  avatar?: String
  avatar_not?: String
  avatar_in?: String[] | String
  avatar_not_in?: String[] | String
  avatar_lt?: String
  avatar_lte?: String
  avatar_gt?: String
  avatar_gte?: String
  avatar_contains?: String
  avatar_not_contains?: String
  avatar_starts_with?: String
  avatar_not_starts_with?: String
  avatar_ends_with?: String
  avatar_not_ends_with?: String
  role?: Role
  role_not?: Role
  role_in?: Role[] | Role
  role_not_in?: Role[] | Role
  creations_every?: CreationWhereInput
  creations_some?: CreationWhereInput
  creations_none?: CreationWhereInput
}

export interface UserCreateOneWithoutCreationsInput {
  create?: UserCreateWithoutCreationsInput
  connect?: UserWhereUniqueInput
}

export interface FileWhereInput {
  AND?: FileWhereInput[] | FileWhereInput
  OR?: FileWhereInput[] | FileWhereInput
  NOT?: FileWhereInput[] | FileWhereInput
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  url?: String
  url_not?: String
  url_in?: String[] | String
  url_not_in?: String[] | String
  url_lt?: String
  url_lte?: String
  url_gt?: String
  url_gte?: String
  url_contains?: String
  url_not_contains?: String
  url_starts_with?: String
  url_not_starts_with?: String
  url_ends_with?: String
  url_not_ends_with?: String
}

export interface FileUpdateOneInput {
  create?: FileCreateInput
  connect?: FileWhereUniqueInput
  disconnect?: Boolean
  delete?: Boolean
  update?: FileUpdateDataInput
  upsert?: FileUpsertNestedInput
}

export interface CreationUpdateWithoutCreatorDataInput {
  likes?: Int
  name?: String
  description?: String
  status?: Status
  tags?: CreationUpdatetagsInput
  pictures?: FileUpdateManyInput
  file?: FileUpdateOneInput
}

export interface FileUpsertWithWhereUniqueNestedInput {
  where: FileWhereUniqueInput
  update: FileUpdateDataInput
  create: FileCreateInput
}

export interface UserCreateWithoutCreationsInput {
  discord_id: String
  username: String
  email: String
  avatar: String
  role: Role
}

export interface FileUpdateDataInput {
  name?: String
  url?: String
}

export interface CreationWhereInput {
  AND?: CreationWhereInput[] | CreationWhereInput
  OR?: CreationWhereInput[] | CreationWhereInput
  NOT?: CreationWhereInput[] | CreationWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  likes?: Int
  likes_not?: Int
  likes_in?: Int[] | Int
  likes_not_in?: Int[] | Int
  likes_lt?: Int
  likes_lte?: Int
  likes_gt?: Int
  likes_gte?: Int
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  description?: String
  description_not?: String
  description_in?: String[] | String
  description_not_in?: String[] | String
  description_lt?: String
  description_lte?: String
  description_gt?: String
  description_gte?: String
  description_contains?: String
  description_not_contains?: String
  description_starts_with?: String
  description_not_starts_with?: String
  description_ends_with?: String
  description_not_ends_with?: String
  status?: Status
  status_not?: Status
  status_in?: Status[] | Status
  status_not_in?: Status[] | Status
  pictures_every?: FileWhereInput
  pictures_some?: FileWhereInput
  pictures_none?: FileWhereInput
  file?: FileWhereInput
  creator?: UserWhereInput
}

export interface UserCreateInput {
  discord_id: String
  username: String
  email: String
  avatar: String
  role: Role
  creations?: CreationCreateManyWithoutCreatorInput
}

export interface CreationWhereUniqueInput {
  id?: ID_Input
}

export interface CreationCreateManyWithoutCreatorInput {
  create?: CreationCreateWithoutCreatorInput[] | CreationCreateWithoutCreatorInput
  connect?: CreationWhereUniqueInput[] | CreationWhereUniqueInput
}

export interface UserSubscriptionWhereInput {
  AND?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  OR?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  NOT?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: UserWhereInput
}

export interface CreationCreateWithoutCreatorInput {
  likes: Int
  name: String
  description: String
  status: Status
  tags?: CreationCreatetagsInput
  pictures?: FileCreateManyInput
  file?: FileCreateOneInput
}

export interface UserUpsertWithoutCreationsInput {
  update: UserUpdateWithoutCreationsDataInput
  create: UserCreateWithoutCreationsInput
}

export interface CreationCreatetagsInput {
  set?: String[] | String
}

export interface UserUpdateOneWithoutCreationsInput {
  create?: UserCreateWithoutCreationsInput
  connect?: UserWhereUniqueInput
  delete?: Boolean
  update?: UserUpdateWithoutCreationsDataInput
  upsert?: UserUpsertWithoutCreationsInput
}

export interface FileUpdateWithWhereUniqueNestedInput {
  where: FileWhereUniqueInput
  data: FileUpdateDataInput
}

export interface CreationUpsertWithWhereUniqueWithoutCreatorInput {
  where: CreationWhereUniqueInput
  update: CreationUpdateWithoutCreatorDataInput
  create: CreationCreateWithoutCreatorInput
}

export interface FileCreateInput {
  name: String
  url: String
}

export interface FileSubscriptionWhereInput {
  AND?: FileSubscriptionWhereInput[] | FileSubscriptionWhereInput
  OR?: FileSubscriptionWhereInput[] | FileSubscriptionWhereInput
  NOT?: FileSubscriptionWhereInput[] | FileSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: FileWhereInput
}

export interface FileCreateOneInput {
  create?: FileCreateInput
  connect?: FileWhereUniqueInput
}

export interface UserWhereUniqueInput {
  id?: UUID
  discord_id?: String
}

export interface CreationCreateInput {
  likes: Int
  name: String
  description: String
  status: Status
  tags?: CreationCreatetagsInput
  pictures?: FileCreateManyInput
  file?: FileCreateOneInput
  creator: UserCreateOneWithoutCreationsInput
}

export interface FileUpdateInput {
  name?: String
  url?: String
}

export interface FileUpdateManyInput {
  create?: FileCreateInput[] | FileCreateInput
  connect?: FileWhereUniqueInput[] | FileWhereUniqueInput
  disconnect?: FileWhereUniqueInput[] | FileWhereUniqueInput
  delete?: FileWhereUniqueInput[] | FileWhereUniqueInput
  update?: FileUpdateWithWhereUniqueNestedInput[] | FileUpdateWithWhereUniqueNestedInput
  upsert?: FileUpsertWithWhereUniqueNestedInput[] | FileUpsertWithWhereUniqueNestedInput
}

export interface CreationUpdateInput {
  likes?: Int
  name?: String
  description?: String
  status?: Status
  tags?: CreationUpdatetagsInput
  pictures?: FileUpdateManyInput
  file?: FileUpdateOneInput
  creator?: UserUpdateOneWithoutCreationsInput
}

export interface CreationUpdateWithWhereUniqueWithoutCreatorInput {
  where: CreationWhereUniqueInput
  data: CreationUpdateWithoutCreatorDataInput
}

export interface CreationUpdateManyWithoutCreatorInput {
  create?: CreationCreateWithoutCreatorInput[] | CreationCreateWithoutCreatorInput
  connect?: CreationWhereUniqueInput[] | CreationWhereUniqueInput
  disconnect?: CreationWhereUniqueInput[] | CreationWhereUniqueInput
  delete?: CreationWhereUniqueInput[] | CreationWhereUniqueInput
  update?: CreationUpdateWithWhereUniqueWithoutCreatorInput[] | CreationUpdateWithWhereUniqueWithoutCreatorInput
  upsert?: CreationUpsertWithWhereUniqueWithoutCreatorInput[] | CreationUpsertWithWhereUniqueWithoutCreatorInput
}

export interface UserUpdateInput {
  discord_id?: String
  username?: String
  email?: String
  avatar?: String
  role?: Role
  creations?: CreationUpdateManyWithoutCreatorInput
}

export interface CreationUpdatetagsInput {
  set?: String[] | String
}

export interface FileUpsertNestedInput {
  update: FileUpdateDataInput
  create: FileCreateInput
}

export interface UserUpdateWithoutCreationsDataInput {
  discord_id?: String
  username?: String
  email?: String
  avatar?: String
  role?: Role
}

export interface FileWhereUniqueInput {
  id?: UUID
}

export interface CreationSubscriptionWhereInput {
  AND?: CreationSubscriptionWhereInput[] | CreationSubscriptionWhereInput
  OR?: CreationSubscriptionWhereInput[] | CreationSubscriptionWhereInput
  NOT?: CreationSubscriptionWhereInput[] | CreationSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: CreationWhereInput
}

/*
 * An object with an ID

 */
export interface Node {
  id: ID_Output
}

export interface FilePreviousValues {
  id: UUID
  name: String
  url: String
}

/*
 * An edge in a connection.

 */
export interface UserEdge {
  node: User
  cursor: String
}

export interface CreationSubscriptionPayload {
  mutation: MutationType
  node?: Creation
  updatedFields?: String[]
  previousValues?: CreationPreviousValues
}

export interface Creation extends Node {
  id: ID_Output
  likes: Int
  name: String
  description: String
  status: Status
  pictures?: File[]
  file?: File
  tags: String[]
  creator: User
}

/*
 * Information about pagination in a connection.

 */
export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String
  endCursor?: String
}

export interface User {
  id: UUID
  discord_id: String
  username: String
  email: String
  avatar: String
  creations?: Creation[]
  role: Role
}

export interface AggregateFile {
  count: Int
}

export interface BatchPayload {
  count: Long
}

/*
 * A connection to a list of items.

 */
export interface FileConnection {
  pageInfo: PageInfo
  edges: FileEdge[]
  aggregate: AggregateFile
}

export interface CreationPreviousValues {
  id: ID_Output
  likes: Int
  name: String
  description: String
  status: Status
  tags: String[]
}

/*
 * An edge in a connection.

 */
export interface CreationEdge {
  node: Creation
  cursor: String
}

export interface AggregateUser {
  count: Int
}

export interface UserPreviousValues {
  id: UUID
  discord_id: String
  username: String
  email: String
  avatar: String
  role: Role
}

export interface UserSubscriptionPayload {
  mutation: MutationType
  node?: User
  updatedFields?: String[]
  previousValues?: UserPreviousValues
}

export interface File {
  id: UUID
  name: String
  url: String
}

/*
 * A connection to a list of items.

 */
export interface UserConnection {
  pageInfo: PageInfo
  edges: UserEdge[]
  aggregate: AggregateUser
}

export interface FileSubscriptionPayload {
  mutation: MutationType
  node?: File
  updatedFields?: String[]
  previousValues?: FilePreviousValues
}

/*
 * A connection to a list of items.

 */
export interface CreationConnection {
  pageInfo: PageInfo
  edges: CreationEdge[]
  aggregate: AggregateCreation
}

export interface AggregateCreation {
  count: Int
}

/*
 * An edge in a connection.

 */
export interface FileEdge {
  node: File
  cursor: String
}

/*
A type 4 UUID according to IETF RFC 4122.
*/
export type UUID = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The `Long` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
*/
export type Long = string

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string