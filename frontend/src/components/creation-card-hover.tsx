import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import clsx from "clsx";
import { FunctionalComponent } from "preact";
import { Heart } from "preact-feather";
import { Link } from "preact-router";
import { Creation } from "../gql/types";

const anim = keyframes`
  from {
    transform: scale(0.5) translateZ(0);
  }
  
  to {
    transform: scale(1) translateZ(0);
  }
`;

const transition = "transition: transform 250ms ease-in-out;";

const CreationCardContainer = styled(Link)<{ href?: string }>`
  border-radius: 1rem;
  box-shadow: 0px 0px 51px 0px rgba(0, 0, 0, 0.32),
    0px 6px 18px 0px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  max-width: 40rem;
  max-height: 14rem;
  display: inline-block;
  transform: scale(1);
  ${transition};

  &:hover {
    transform: scale(1.1);
    article {
      opacity: 1;
      transform: scale(1);
    }
    img {
      transform: scale(1.15);
    }
    .background {
      opacity: 1;
    }
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    display: block;
    transform: scale(1);
    position: relative;
    pointer-events: none;
    ${transition};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .background {
    content: "";
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    ${transition};
    transition-property: opacity;
  }

  article {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: scale(0.9);
    border-radius: 1rem;
    overflow: hidden;
    ${transition};
    transition-property: all;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    header {
      display: flex;
      align-items: flex-end;
      transition: opacity 200ms ease-in;
      width: 100%;
      opacity: 1;

      h4 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #f1f5f8;
        margin-right: 0.5rem;
        flex-grow: 1;
        font-size: 1.2rem;
        line-height: 1.4;
      }
    }

    footer {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      width: 100%;

      button {
        border: none;
        background: none;
        color: white;
        cursor: pointer;
        transition: transform 150ms ease-out;
        will-change: transform;
        position: relative;

        svg {
          display: inline-block;
          transform: scale(1);
          will-change: transform;
          filter: none;
        }

        &:focus {
          outline: none;
        }

        &.like {
          span {
            position: absolute;
            bottom: 100%;
            left: 50%;
            display: block;
            color: currentColor;
            text-shadow: 0 0 4px currentColor;
            content: attr(data-likes);
            transform: translateX(-50%);
          }

          &:hover {
            //transform: translateY(-0.15rem);
            color: rgb(255, 140, 130);

            svg {
              filter: drop-shadow(0 0 4px currentColor);
            }
          }

          &.liked {
            color: rgb(239, 87, 83);

            span {
              color: currentColor;
            }

            svg {
              animation: ${anim};
              animation-duration: 200ms;
              animation-play-state: running;
              fill: currentColor;
              stroke: currentColor;
              filter: drop-shadow(0 0 4px currentColor);
            }
          }
        }
      }
    }
  }
`;

interface CreationCardProps {
  creation: Creation;
  onLiked: (liked: boolean) => void;
}

export const CreationCard: FunctionalComponent<CreationCardProps> = ({
  creation: { id, name, pictures, liked, likes },
  onLiked,
}) => (
  <CreationCardContainer key={id} href={`/creation/${id}`}>
    <img src={pictures[0].url} />
    <div class="background" />
    <article>
      <header>
        <h4>{name}</h4>
      </header>
      <footer>
        <button
          class={clsx({ like: true, liked })}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onLiked(!liked);
          }}
        >
          <Heart size={26} />
          <span>{likes}</span>
        </button>
      </footer>
      {/*<HeartButton onClick={onLiked} liked={liked} />*/}
    </article>
  </CreationCardContainer>
);
