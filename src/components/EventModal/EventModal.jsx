import React from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { useDbUpdate } from "../../utilities/firebase";
import { Form, InputGroup } from "react-bootstrap";
import { InputDatetimeField, useFormData } from "../AddEventFormModal/AddEventFormModal";
import toast, { Toaster } from 'react-hot-toast';


const EventModal = ({
  show,
  handleClose,
  event,
  eventId,
  users,
  currentUser,
}) => {
  const [updateData] = useDbUpdate("/");
  const [state, change] = useFormData({ deadline: event.deadline });
  const attendeesIds = event.attendees ? Object.values(event.attendees) : [];
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
  // const notify = () => toast('Here is your toast.');
  const shareLink = () => {
    var eventLink = window.location.href + "?invite=" + eventId;
    navigator.clipboard.writeText(eventLink);
    toast.success('Successfully copied!.', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#333',
      },
    });
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
          {event.organizer === currentUser.uid ? (
            <InputDatetimeField
              name="deadline"
              text="Deadline"
              state={state}
              change={(e) => {
                change(e);
                updateData({
                  ["/events/" + eventId + "/deadline"]: state.values.deadline,
                });
              }}
            />
          ) : (
            <p className="modal-deadline">
              Deadline: {new Date(event.deadline).toLocaleString()}
            </p>
          )}
        </div>
        <div className="modal-attendees">
          <div className="d-flex justify-content-between">
            <p className="modal-title">
              Attendees <Badge bg="primary">{attendees.length}</Badge>
            </p>
            <Toaster />
            {event.organizer === currentUser.uid ? (
              <Button variant="outline-dark" onClick={shareLink}>
                <i className="bi bi-link-45deg"></i>
              </Button>
            ) : (
              ""
            )}
          </div>
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
          {event.payments
            ? event.payments.map((payment, i) => (
                <div key={i} className="modal-user-payment-container">
                  <div>
                    {users[payment.user].displayName}
                    <br />
                    <strong>Amount: </strong>
                    {event.organizer === currentUser.uid ? (
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1"> $ </InputGroup.Text>
                        <Form.Control
                          placeholder={payment.amount}
                          aria-label="Amount"
                          onChange={(e) => {
                            event.payments[i].amount = e.target.value;
                            updateData({
                              ["/events/" + eventId + "/payments"]:
                                event.payments,
                            });
                          }}
                        />
                      </InputGroup>
                    ) : (
                      payment.amount
                    )}
                  </div>
                  <div>
                    {payment.isPaid ? (
                      <Badge bg="success" className="modal-payment-badges">
                        Already made payment!
                      </Badge>
                    ) : (
                      <div className="modal-payments-pending">
                        {payment.user !== currentUser.uid && (
                          <div>
                            <Badge
                              bg="warning"
                              text="dark"
                              className="modal-payment-badges-pending"
                            >
                              Payment is pending!
                            </Badge>
                          </div>
                        )}
                        {payment.user === currentUser.uid && (
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
              ))
            : null}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {event.organizer === currentUser.uid ? (
          <Button variant="danger" onClick={handleClose}>
            Delete event
          </Button>
        ) : (
          ""
        )}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
