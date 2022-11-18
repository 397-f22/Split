import React from "react";
import { Button, Modal } from "react-bootstrap";

const EventModal = ({ show, handleClose, event, users }) => {
  const attendeesIds = Object.values(event.attendees);
  const attendees = Object.entries(users).filter(([id, user]) =>
    attendeesIds.includes(id)
  );

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{event.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Attendees</h1>
        {attendees.map(([id, user]) => (
          <p key={id}>{user.displayName}</p>
        ))}
        <h1>Payments</h1>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
