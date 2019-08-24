import { gql } from "@pql/boost";

export const addCreation = gql`
  mutation addCreation($creation: CreationInput!) {
    addCreation(creation: $creation) {
      __typename
      id
      name
      description
      status
      liked
      likes
      tags {
        name
      }
      file {
        __typename
        id
        url
      }
      pictures {
        __typename
        id
        url
      }
      creator {
        __typename
        id
        username
        avatar
        role
      }
      createdAt
      updatedAt
    }
  }
`;

export const fetchCreations = gql`
  query fetchCreations {
    creations {
      __typename
      id
      name
      description
      status
      liked
      likes
      tags {
        name
      }
      file {
        __typename
        id
        url
      }
      pictures {
        __typename
        id
        url
      }
      creator {
        __typename
        id
        username
        avatar
        role
      }
      createdAt
      updatedAt
    }
  }
`;

export const creation = gql`
  query fetchCreation($id: String!) {
    creation(creationId: $id) {
      __typename
      id
      name
      description
      status
      liked
      likes
      comments {
        __typename
        id
        text
        author {
          __typename
          id
          avatar
          username
        }
      }
      tags {
        name
      }
      file {
        __typename
        id
        url
      }
      pictures {
        __typename
        id
        url
      }
      creator {
        __typename
        id
        username
        avatar
        role
      }
      createdAt
      updatedAt
    }
  }
`;

export const getMe = gql`
  query getMe {
    me {
      __typename
      id
      username
      avatar
      role
      creations {
        __typename
        id
        name
      }
    }
  }
`;

export const like = gql`
  mutation like($creationId: String!) {
    rate(creationId: $creationId) {
      __typename
      id
      name
      description
      status
      liked
      likes
      tags {
        name
      }
      file {
        __typename
        id
        url
      }
      pictures {
        __typename
        id
        url
      }
      creator {
        __typename
        id
        username
        avatar
        role
      }
      createdAt
      updatedAt
    }
  }
`;

export const unlike = gql`
  mutation unlike($creationId: String!) {
    removeRating(creationId: $creationId) {
      __typename
      id
      name
      description
      status
      liked
      likes
      tags {
        name
      }
      file {
        __typename
        id
        url
      }
      pictures {
        __typename
        id
        url
      }
      creator {
        __typename
        id
        username
        avatar
        role
      }
      createdAt
      updatedAt
    }
  }
`;
