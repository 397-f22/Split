import React from "react";
import { ListGroup } from "react-bootstrap";
import { useDbData } from "../utilities/firebase";
import { useProfile } from "../utilities/userProfile";
import EventCard from "../components/EventCard/EventCard";

const Home = () => {
  const [events, errorEvents, isLoadingEvents] = useDbData("/events");
  const [users, errorUsers, isLoadingUsers] = useDbData("/users");
  const [currentUser, error, isLoading] = useProfile();

  if (errorEvents || errorUsers)
    return <h1>Error loading data: {`${errorUsers}`}</h1>;
  if (isLoadingEvents || isLoadingUsers) return <h1>Loading data...</h1>;

  if (!currentUser) return;
  if (!users) return <div> No Users </div>;

  const currentUserInformation = Object.entries(users).filter(
    ([id, user]) => id === currentUser.uid
  )[0][1];
  const currentUserEventIds = Object.values(currentUserInformation.events);

  const currentUserEvents = Object.entries(events).filter(([id, event]) =>
    currentUserEventIds.includes(id)
  );

  return (
    <div>
      <h1>Split App</h1>
      <ListGroup variant="flush">
        {currentUserEvents.map(([id, eventData]) => {
          return (
            <ListGroup.Item key={id}>
              <EventCard event={eventData} users={users} />
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default Home;
