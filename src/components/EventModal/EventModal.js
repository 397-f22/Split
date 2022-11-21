import React, {useState} from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { useDbUpdate } from "../../utilities/firebase";
import { Form, InputGroup } from "react-bootstrap";


export const useFormData = (values = {}) => {
  const [state, setState] = useState(() => ({ values }));
  const change = (evt) => {
    const { id, value } = evt.target;
    if (id === "deadline") {
      // parse the datetime value
      var date = new Date(value);
      date = new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
      const newValues = { ...state.values, [id]: date.replace(",", " @") };
      setState({ values: newValues });
    } else {
      const values = { ...state.values, [id]: value };
      setState({ values });
    }
  };
  return [state, change];
};

const InputDatetimeField = ({ name, state, change }) => {
  console.log('this is the deadline stored in state')
  console.log(state.values?.[name]);
  return(
  <div>
    <label htmlFor={name} className="form-label">
      Pick time
    </label>
    <input
      type="datetime-local"
      className="form-control mb-3"
      id={name}
      name={name}
      defaultValue={''}
      onChange={change}      
    ></input>
  </div>
  // <DatePicker
  //     selected={state.values.datetime}
  //     onChange={(date) => {
  //         change({ target: { id: name, value: date } })
  //     }}
  //     showTimeSelect
  //     dateFormat="Pp"
  // />
);}


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

  const shareLink = () => {
    var eventLink = window.location.href + "?invite=" + eventId;
    navigator.clipboard.writeText(eventLink);
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
          {event.organizer === currentUser.uid ? 
                  <InputDatetimeField name='deadline' text='Deadline' state={state} change={(e) => {
                    change(e);
                    // console.log(state);
                    updateData({ ["/events/" + eventId + "/deadline"]: state.values.deadline });
                  }} />                                                                          
                  : ""}
        </div>
        <div className="modal-attendees">
          <div className="d-flex justify-content-between">
            <p className="modal-title">Attendees <Badge bg="primary">{attendees.length}</Badge></p>
            {event.organizer === currentUser.uid ? 
              <Button variant="outline-dark" onClick={shareLink}>
                <i className="bi bi-link-45deg" ></i>
              </Button> 
              : ""}
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
          {event.payments.map((payment, i) => (
            <div key={i} className="modal-user-payment-container">
              <div>
                {users[payment.user].displayName}
                <br />
                <strong>Amount: </strong>
                {event.organizer === currentUser.uid ?
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"> $ </InputGroup.Text>
                    <Form.Control
                      placeholder={payment.amount}
                      aria-label="Amount"
                      onChange={(e) => {
                        event.payments[i].amount = e.target.value;
                        updateData({ ["/events/" + eventId + "/payments"]: event.payments });
                      }}
                    />
                  </InputGroup>
                  : payment.amount}
              </div>
              <div>
                {payment.isPaid ? (
                  <Badge bg="success" className="modal-payment-badges">
                    Already made payment!
                  </Badge>
                ) : (
                  <div className="modal-payments-pending">
                    {payment.user !== currentUser.uid &&
                    (<div>
                      <Badge
                        bg="warning"
                        text="dark"
                        className="modal-payment-badges-pending"
                      >
                        Payment is pending!
                      </Badge>
                    </div>)}
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
          ))}
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
