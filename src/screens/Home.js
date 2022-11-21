import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { useDbData } from "../utilities/firebase";
import { useProfile } from "../utilities/userProfile";
import EventCard from "../components/EventCard/EventCard";
import Menubar from "../components/NavBar/Menubar";
import { useSearchParams} from "react-router-dom";
import InviteModal from "../components/InviteModal/InviteModal";

const Home = () => {
  const [events, errorEvents, isLoadingEvents] = useDbData("/events");
  const [users, errorUsers, isLoadingUsers] = useDbData("/users");
  const [currentUser, error, isLoading] = useProfile();
  const [urlParams, setUrlParams] = useSearchParams();

  if (errorEvents || errorUsers || error)
    return <h1>Error loading data: {`${errorUsers}`}</h1>;
  if (isLoadingEvents || isLoadingUsers || isLoading)
    return <h1>Loading data...</h1>;

  if (!currentUser) return;
  if (!users) return <div> No Users </div>;

  const currentUserInformation = Object.entries(users).filter(
    ([id, user]) => id === currentUser.uid
  )[0][1];

  const currentUserEventIds = currentUserInformation.events ? Object.values(currentUserInformation.events) : [];

  const currentUserEvents = Object.entries(events).filter(([id, event]) =>
    currentUserEventIds.includes(id)
  );

  return (
    <div>
      <Menubar user={currentUser} />
      {urlParams.get("invite") && (
        <InviteModal 
          show={true}
          handleClose={() => setUrlParams({})}
          inviteID={urlParams.get("invite")}
          currentUser={currentUserInformation}
          currentUserID={currentUser.uid}
          events={events}
          users={users}
        />
      )}
      <Container className="container mt-3">
        <div className="home-header">
          <h1 className="home-title">My events</h1>
          <div className="home-add-event">
            <p className="home-add-event-title">Add new event</p>
            <Button variant="success">
              <i className="bi bi-plus-circle"></i>
            </Button>
          </div>
        </div>
        <ListGroup>
          {currentUserEvents.map(([id, eventData]) => {
            return (
              <ListGroup.Item className="mb-3 event-grid-container" key={id}>
                <EventCard
                  eventId={id}
                  event={eventData}
                  users={users}
                  currentUser={currentUser}
                />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Container>
    </div>
  );
};

export default Home;
