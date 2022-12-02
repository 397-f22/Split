import React from "react";
import { useState } from 'react';
import { Button, Container } from "react-bootstrap";
import EventTimeline from "../components/EventTimeline/EventTimeline";
import { useDbData } from "../utilities/firebase";
import { useProfile } from "../utilities/userProfile";
import EventCard from "../components/EventCard/EventCard";
import Menubar from "../components/NavBar/Menubar";
import { useSearchParams } from "react-router-dom";
import InviteModal from "../components/InviteModal/InviteModal";
import AddEventFormModal from "../components/AddEventFormModal/AddEventFormModal";



const Home = () => {
  const [events, errorEvents, isLoadingEvents] = useDbData("/events");
  const [users, errorUsers, isLoadingUsers] = useDbData("/users");
  const [currentUser, error, isLoading] = useProfile();
  const [urlParams, setUrlParams] = useSearchParams();
  const [addEventShow, setAddEventShow] = useState(false);
  const handleAddEventClose = () => setAddEventShow(false);
  const handleAddEventShow = () => setAddEventShow(true);

  if (errorEvents || errorUsers || error)
    return <h1>Error loading data: {`${errorUsers}`}</h1>;
  if (isLoadingEvents || isLoadingUsers || isLoading)
    return <h1>Loading data...</h1>;

  if (!currentUser) return;
  if (!users) return <div> No Users </div>;

  const currentUserInformation = Object.entries(users).filter(
    ([id, user]) => id === currentUser.uid
  )[0][1];
  
  const currentUserEventIds = Object.entries(events).map((e) => e[0] ).filter((id) => events[id].attendees.includes(currentUser.uid))
  var currentUserEvents = currentUserEventIds.map((eid) => [eid, events[eid]])
  currentUserEvents = currentUserEvents.sort(
    (a, b) => new Date(a[1].deadline) - new Date(b[1].deadline)
  ).reverse()

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
            <Button variant="success" onClick={handleAddEventShow}>
              <i className="bi bi-plus-circle"></i>
            </Button>
          </div>
        </div>
        <EventTimeline 
          currentUserEvents = {currentUserEvents}
          users = {users}
          currentUser = {currentUser}
          />
        <AddEventFormModal
          show={addEventShow}
          handleClose={handleAddEventClose}
          handleShow={handleAddEventShow}
          currentUser={currentUser}
          currentUserEventIds = {currentUserEventIds}
        />
      </Container>
    </div>
  );
};

export default Home;
