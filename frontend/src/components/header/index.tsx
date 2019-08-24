import styled from "@emotion/styled";
import { useQuery } from "@pql/boost";
import clsx from "clsx";
import { RenderableProps } from "preact";
import { LogOut, Search, Upload, User } from "preact-feather";
import { Link } from "preact-router";
import { getMe } from "../../gql/index.gql";
// import styles from "./header.block.css";

const NavbarSection = styled.section`
  align-items: center;
  display: flex;
  flex: 1 0 0;
`;

const Navbar = styled.header`
  background-color: transparent;
  //border-radius: 5px;
  //padding: 0.4rem;
  //margin: 0.4rem;
  height: 60px;

  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  ${NavbarSection} {
    align-items: center;
    display: flex;
    flex: 1 0 0;

    &:not(:first-of-type):last-child {
      justify-content: flex-end;
    }
  }

  .btn {
    margin-left: 5px;
  }

  .navbar-center {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
  }
`;

const NavbarTitle = styled(Link)<{ href?: string }>`
  font-size: 0.9rem;
  text-decoration: none;
  margin-right: 0.4rem !important;
  font-weight: bold;
  color: currentColor;

  &:visited {
    color: currentColor;
  }

  &:hover {
    text-decoration: none;
  }
`;

export interface HeaderProps {
  logout: () => void;
}

function login() {
  location.href = `/api/oauth`;
}

export function Header({ logout }: RenderableProps<HeaderProps>) {
  const [{ data, fetching }] = useQuery({
    query: getMe,
  });
  const me = data && data.me;
  const loaded = !fetching;

  return (
    <Navbar className="container">
      <NavbarSection>
        <NavbarTitle href="/">Sky1 Showcase</NavbarTitle>
      </NavbarSection>
      <NavbarSection>
        {me ? (
          <>
            <Link href="/create" className="btn btn-primary">
              <Upload />
            </Link>
            <Link href={`/profile/${me.id}`} className="btn btn-primary">
              <User />
            </Link>
            <button className="btn btn-primary" onClick={logout}>
              <LogOut />
            </button>
          </>
        ) : (
          <>
            <button
              className={clsx({
                "btn btn-primary": true,
                loading: !loaded,
              })}
              onClick={login}
            >
              Log In
            </button>
          </>
        )}
        <Link href="/search" className="btn btn-primary">
          <Search />
        </Link>
      </NavbarSection>
    </Navbar>
  );
}
