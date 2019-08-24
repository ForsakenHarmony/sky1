import { css, keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import { useMutation, useQuery } from "@pql/boost";
import { ChevronLeft, ChevronRight, Download, Heart } from "preact-feather";
import {
  creation as fetchCreation,
  like as likeMut,
  unlike as unlikeMut,
} from "../gql/index.gql";
import { Creation as CreationType } from "../gql/types";

interface CreationData {
  creation: CreationType;
}

const CreationWrapper = styled.article`
  //padding: 20px 50px;
`;

const CreationHeader = styled.header`
  display: flex;
  flex-direction: row;
`;

const CreationMisc = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  button {
  }
`;

const Button = styled.button`
  border: 2px red solid;
  border-radius: 9999px;
  background: none;
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: left;
  > *:not(:last-child) {
    padding-right: 5px;
  }
`;

const slidein = keyframes`
  0% {
    opacity: 0.01;
    transform: translateX(20%);
  }
  20 % {
    opacity: 0.9;
  }
  50 % {
    opacity: 1;
  }
  100% {
    opacity: 1.0;
    transform: translateX(0);
  }
`;

const slideout = keyframes`
  0% {
    opacity: 1.0;
    transform: translateX(0);
  }
  20 % {
    opacity: 0.1;
  }
  100% {
    opacity: 0.01;
    transform: translateX(-20%);
  }
`;

const CarouselRadio = styled.input`
  display: none;
`;
const CarouselItemButton = styled.label<{ for: string }>`
  color: white;
  opacity: 0;
  position: absolute;
  top: 50%;
  transition: all 0.4s;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;

  svg {
    filter: none;
  }

  &.prev {
    left: 1rem;
  }
  &.next {
    right: 1rem;
  }
`;

const CarouselItem = styled.figure`
  border-radius: 1rem;
  overflow: hidden;
  img {
    opacity: 0;
    animation: ${slideout} 300ms ease-in 1;
    will-change: transform, opacity;
  }
  height: 100%;
  left: 0;
  margin: 0;
  //opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
  //will-change: transform, opacity;
  //transition: opacity ease-in-out 300ms;

  img {
    border-radius: 1rem;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: wheel(5px);
  }

  &:hover {
    ${CarouselItemButton} {
      opacity: 0.6;
    }
  }

  ${CarouselItemButton} {
    &:hover {
      opacity: 1;
      svg {
        filter: drop-shadow(0 0 4px white);
      }
    }
  }
`;

const CarouselContainer = styled.div`
  height: 100%;
  left: 0;
  &::before {
    content: "";
    display: block;
    padding-bottom: 56.25%;
  }
`;
const CarouselNavItem = styled.label<{ for: string }>`
  color: white;
  opacity: 0.7;
  display: block;
  flex: 1 0 auto;
  height: 1.6rem;
  margin: 0.2rem;
  max-width: 1.5rem;
  position: relative;

  background: 0 0;
  border: 0;
  font-size: 0;
  line-height: 0;
  text-shadow: none;
  cursor: pointer;

  transition: opacity 200ms;

  &::before {
    content: "";
    display: block;
    height: 0.2rem;
    position: absolute;
    top: 0.5rem;
    width: 100%;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.5);
  }

  &::after {
    background: currentColor;
    content: "";
    display: block;
    height: 0.2rem;
    position: absolute;
    top: 0.5rem;
    width: 100%;
  }
`;
const CarouselNav = styled.footer`
  top: auto;
  height: auto;
  bottom: 2rem;
  left: 50%;

  display: flex;
  justify-content: center;
  position: absolute;
  transform: translateX(-50%);
  width: auto;
  z-index: 2;
`;
const CarouselWrapper = styled.div`
  display: block;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 0;
  overflow-scrolling: touch;
  border-radius: 1rem;
  //max-height: 80vh;

  &:before {
    content: "";
    display: block;
    height: 0;
    width: 0;
    padding-bottom: 56.25%;
  }

  > * {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  ${CarouselRadio} {
    ${Array.from(
      { length: 10 },
      (_, n) => css`      
      &:nth-of-type(${n + 1}):checked {
        & ~ ${CarouselContainer} ${CarouselItem}:nth-of-type(${n + 1}) {
          img {
            animation: ${slidein} 300ms ease-out 1;
            opacity: 1;
          }
          z-index: 2;
        }
        & ~ ${CarouselNav} ${CarouselNavItem}:nth-of-type(${n + 1}) {
          opacity: 1;
          &::after {
            box-shadow: 0 0 4px white;
          }
        }
      }
    `
    )}
  }
`;

const Carousel = ({ items }: { items: Array<{ id: string; url: string }> }) => (
  <CarouselWrapper>
    {/* carousel locator */}
    {items.map((pic, i) => (
      <CarouselRadio
        type="radio"
        name="carousel"
        id={pic.id}
        checked={i === 0}
      />
    ))}
    {/* carousel container */}
    <CarouselContainer>
      {/* carousel item */}
      {items.map((pic, i, arr) => (
        <CarouselItem>
          <CarouselItemButton
            className="prev"
            for={arr[(i - 1 + arr.length) % arr.length].id}
          >
            <ChevronLeft size={50} />
          </CarouselItemButton>
          <CarouselItemButton
            className="next"
            for={arr[(i + 1) % arr.length].id}
          >
            <ChevronRight size={50} />
          </CarouselItemButton>
          <img src={pic.url} alt=":(" />
        </CarouselItem>
      ))}
    </CarouselContainer>
    {/* carousel navigation */}
    <CarouselNav>
      {items.map((pic, i) => (
        <CarouselNavItem for={pic.id}>{i + 1}</CarouselNavItem>
      ))}
    </CarouselNav>
  </CarouselWrapper>
);

export default function Creation({ id }: { id: string }) {
  const [{ data }] = useQuery<CreationData>({
    query: fetchCreation,
    variables: { id },
  });
  const creation = data && data.creation;
  // @ts-ignore
  const [, like] = useMutation(likeMut);
  // @ts-ignore
  const [, unlike] = useMutation(unlikeMut);

  if (!creation) { return <p>Loading ... </p>; }
  // if (!data || !creation) return <p>Nothing? {error}</p>;

  return (
    <div class="container">
      <CreationWrapper>
        <CreationHeader>
          <Carousel items={creation.pictures} />
          <CreationMisc>
            <Button>
              <Heart /> <span>Like</span>
            </Button>
            <Button>
              <Download /> <span>Download</span>
            </Button>
            <footer>
              <h2>Tags</h2>
              <ul>
                <li>Wow</li>
                <li>Thing</li>
                <li>Kek</li>
              </ul>
            </footer>
          </CreationMisc>
        </CreationHeader>
        <section>
          <h2>{creation.name}</h2>
        </section>
      </CreationWrapper>
    </div>
  );
}
