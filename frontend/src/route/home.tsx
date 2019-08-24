import {
  fetchCreations,
  like as likeMut,
  unlike as unlikeMut,
} from "../gql/index.gql";
import { Creation } from "../gql/types";

import styled from "@emotion/styled";
import { useMutation, useQuery } from "@pql/boost";
import { VNode } from "preact";
import { CreationCard } from "../components/creation-card-hover";

const Content = styled.main`
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));

  @media (min-width: 480px) {
  }
  @media (min-width: 600px) {
  }
  @media (min-width: 840px) {
  }
  @media (min-width: 960px) {
  }
  @media (min-width: 1280px) {
  }
`;

const HomeHeader = styled.header`
  padding: 20px 0;

  select {
    background: transparent;
    color: currentColor;
    border: none;
    font-size: 1.4rem;
    -webkit-appearance: button;
    -moz-appearance: button;
    appearance: button;
    align-items: center;
    cursor: pointer;
    white-space: unset;
    font-weight: 500;
    line-height: 1.2;

    option {
      border: none;
      background: #161b27;
    }
  }

  h3 {
    display: inline-block;
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 0;
  }
`;

export default function Home(): VNode<any> {
  const [{ data, error }] = useQuery({
    query: fetchCreations,
  });
  const creations = data && data.creations;
  const [, like] = useMutation(likeMut);
  const [, unlike] = useMutation(unlikeMut);
  // let { creations, error } = useQuery(query(fetchCreations));
  // const { mutate: like } = useMutation(mutation(likeMut));
  // const { mutate: unlike } = useMutation(mutation(unlikeMut));

  return (
    <>
      <HomeHeader>
        <select>
          <option>Hot</option>
          <option>Top</option>
          <option>New</option>
        </select>
        <h3>creations</h3>
      </HomeHeader>
      <Content className="container">
        {error && <p>Error :(</p>}
        {creations ? (
          creations.map((creation: Creation) => (
            <CreationCard
              key={creation.id}
              creation={creation}
              onLiked={liked => {
                (liked ? like : unlike)!({
                  creationId: creation.id,
                });
              }}
            />
          ))
        ) : (
          <p>Loading ...</p>
        )}
      </Content>
    </>
  );
}
