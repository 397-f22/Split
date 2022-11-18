import React from "react";
import { Button, Modal } from "react-bootstrap";

const EventModal = ({ show, handleClose, event, users }) => {
  const attendeesIds = Object.values(event.attendees);
  const attendees = Object.entries(users).filter(([id, user]) =>
    attendeesIds.includes(id)
  );

  console.log(event)

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
        {event.payments.map(e => {
          return (
            <div>
              <h3>Amount:</h3>
              {e.amount}
              <h3>Sender</h3>
              {users[e.user].displayName}
            </div>
          )
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button>
          Pay your portion
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
