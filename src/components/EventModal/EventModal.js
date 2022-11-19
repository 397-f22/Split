import React from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { useDbUpdate } from "../../utilities/firebase";

const EventModal = ({
  show,
  handleClose,
  event,
  eventId,
  users,
  currentUser,
}) => {
  const [updateData] = useDbUpdate("/");

  const attendeesIds = Object.values(event.attendees);
  const attendees = Object.entries(users).filter(([id, user]) =>
    attendeesIds.includes(id)
  );

  const makePayment = () => {
    //Go trough each of the indices of the payments object and where user = currentUser.uid, change isPaid to true
    event.payments.forEach((ev) => {
      if (ev.user === currentUser.uid) {
        ev.isPaid = true;
      }
    });
    updateData({ ["/events/" + eventId + "/payments"]: event.payments });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{event.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-description-container">
          <p className="modal-description">{event.description}</p>
          <p className="modal-organizer">
            Organizer: {users[event.organizer].displayName}
          </p>
        </div>
        <div className="modal-attendees">
          <p className="modal-title">Attendees</p>
          <div className="modal-badges-container">
            {attendees.map(([id, user]) => (
              <Badge key={id} bg="info" className="modal-badges">
                {user.displayName}
              </Badge>
            ))}
          </div>
        </div>
        <div className="modal-payments-container">
          <p className="modal-title">Payments</p>
          {event.payments.map((e, i) => (
            <div key={i} className="modal-user-payment-container">
              <div>
                {users[e.user].displayName}
                <br />
                <strong>Amount: </strong>${e.amount}
              </div>
              <div>
                {e.isPaid ? (
                  <Badge bg="success" className="modal-payment-badges">
                    Already made payment!
                  </Badge>
                ) : (
                  <div className="modal-payments-pending">
                    <div>
                      <Badge
                        bg="warning"
                        text="dark"
                        className="modal-payment-badges-pending"
                      >
                        Payment is pending!
                      </Badge>
                    </div>
                    {e.user === currentUser.uid && (
                      <div>
                        <Button
                          variant="danger"
                          size="sm"
                          className="modal-payment-button"
                          onClick={makePayment}
                        >
                          Pay now!
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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
