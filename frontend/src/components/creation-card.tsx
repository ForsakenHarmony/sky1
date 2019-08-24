import styled from "@emotion/styled";
import clsx from "clsx";
import { FunctionalComponent } from "preact";
import { Heart } from "preact-feather";
import { Creation } from "../gql/types";
import { prevent } from "../util";

const Button = styled.button`
  z-index: 1;
  border-radius: 9999px;
  background-color: rgba(61, 72, 82, 0.6);
  backface-visibility: hidden;
  transform: translateZ(0);
  color: white;
  transition: background-color 300ms;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;

  svg {
    display: inline-block;
  }

  &::before {
    content: "";

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;

    border-radius: 9999px;
    background-color: rgb(239, 87, 83, 0.65);

    transform: scale(0);

    transition: 200ms ease-out;
    transition-property: transform;
  }

  &.liked {
    color: white;
  }

  &.liked:before {
    transform: scale(1);
  }

  &:hover,
  &:focus {
    background-color: rgba(239, 87, 83, 0.6);
  }
`;

interface HeartButtonProps {
  onClick: (liked: boolean) => void;
  liked: boolean;
  className?: string;
}

const HeartButton: FunctionalComponent<HeartButtonProps> = ({
  onClick,
  liked,
}) => (
  <Button
    className={clsx({ liked })}
    onMouseDown={prevent}
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      onClick(!liked);
    }}
  >
    <Heart fill={liked ? "red" : "none"} stroke={liked ? "red" : "white"} />
  </Button>
);

const CreationCardContainer = styled.a`
  transition: box-shadow 400ms;
  box-shadow: 1px 3px 8px 0 rgba(0, 0, 0, 0.27);
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  max-width: 40rem;
  display: inline-block;

  &:hover {
    box-shadow: 1px 3px 8px 0px rgba(0, 0, 0, 0.7);

    footer {
      opacity: 0;
    }
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    right: 0;
    top: 0;
    position: absolute;
    padding: 0.5rem;
    margin: 0.5rem;
    z-index: 2 !important;
  }

  footer {
    padding: 0.5rem 1rem;
    align-items: flex-end;
    display: flex;
    transition: opacity 200ms ease-in;
    position: absolute;
    bottom: 0;
    width: 100%;
    opacity: 1;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    );

    h4 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #f1f5f8;
      margin-right: 0.5rem;
      flex-grow: 1;
    }
  }
`;

interface CreationCardProps {
  creation: Creation;
  onLiked: (liked: boolean) => void;
}

export const CreationCard: FunctionalComponent<CreationCardProps> = ({
  creation: { id, name, pictures, liked },
  onLiked,
}) => (
  <CreationCardContainer key={id} href={`/creation/${id}`}>
    <img src={pictures[0].url} />
    <HeartButton onClick={onLiked} liked={liked} />
    <footer>
      <h4>{name}</h4>
    </footer>
  </CreationCardContainer>
);
