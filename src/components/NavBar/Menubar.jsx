import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { signOut } from "../../utilities/firebase";

const SignOutButton = () => (
  <Button
    className="ml-5 p-2 w-10 btn navbar-signout-button"
    variant="light"
    onClick={signOut}
  >
    Sign out
  </Button>
);

const Menubar = ({ user }) => {
  return (
    <Navbar className="navbar-container p-3">
      <Container>
        <div>
          <Navbar.Brand href="/" className="navbar-title">
            Split
          </Navbar.Brand>
        </div>
        <div className="navbar-content">
          {user && (
            <Nav className="navbar-username">Welcome! {user.displayName}</Nav>
          )}
          <SignOutButton />
        </div>
      </Container>
    </Navbar>
  );
};

export default Menubar;
