import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import EventModal from "../EventModal/EventModal";

const EventCard = ({ event, eventId, users, currentUser }) => {
  const [show, setShow] = useState(false);

  const attendeesIds = Object.values(event.attendees);
  const attendees = Object.entries(users).filter(([id, user]) =>
    attendeesIds.includes(id)
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Card border="light">
        <Card.Header>
          <Card.Title>{event.title}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Subtitle className="mb-3 text-muted">
            Organizer: {users[event.organizer].displayName}
          </Card.Subtitle>
          <Card.Text>{event.description}</Card.Text>
          {attendees.map(([id, user]) => (
            <Badge key={id} bg="info" className="modal-badges">
              {user.displayName}
            </Badge>
          ))}
        </Card.Body>
        <Card.Footer>
          <Button variant="success" onClick={handleShow}>
            Event Details
          </Button>
        </Card.Footer>
      </Card>
      <EventModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        event={event}
        eventId={eventId}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
};

export default EventCard;