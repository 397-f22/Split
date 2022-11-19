import React, { useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import EventModal from "../EventModal/EventModal";

const EventCard = ({ event, eventId, users, currentUser }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Card>
        <Card.Body>
          <Container>
            <Card.Header>
              <Row bg="light">
                <Col xs={8} md={10} className="my-auto">
                  <Card.Title className="my-auto mx-auto">
                    {event.title}
                  </Card.Title>
                </Col>
              </Row>
            </Card.Header>
          </Container>
          <div className="user-interests-container"></div>
          <button onClick={handleShow}>Event Details</button>
        </Card.Body>
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
