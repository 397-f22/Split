import { useState } from "react";
import { Modal, Button, FloatingLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useDbUpdate } from "../../utilities/firebase";
import { v4 as uuidv4 } from "uuid";

export const useFormData = (values = {}) => {
  const [state, setState] = useState(() => ({ values }));
  const change = (evt) => {
    const { id, value } = evt.target;
    if (id === "deadline") {
      const newDate = new Date(value)
      const newValues = { [id]: newDate.toJSON().split('.')[0] };  
      setState({ values: newValues });
    } 
  };
  return [state, change];
};

const InputDatetimeField = ({ name, state, change }) => {
  console.log(state.values)
  return (
    <div>
      <label htmlFor={name} className="form-label">
        Pick a time
      </label>
      <input
        type="datetime-local"
        className="form-control mb-3"
        id={name}
        name={name}
        defaultValue={state.values.deadline}
        onChange={change}
      ></input>
    </div>
  );
};

const AddEventFormModal = ({
  show,
  handleClose,
  currentUser,
  currentUserEventIds,
}) => {
  const date = (new Date()).toJSON().split('.')[0]
  const [state, setState] = useFormData({ deadline: date });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updateData] = useDbUpdate("/");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.length > 0) {
      const data = {
        attendees: { 0: currentUser.uid },
        deadline: state.values.deadline,
        description: description,
        organizer: currentUser.uid,
        payments: {},
        title: title,
      };
      const eventId = uuidv4();
      console.log(data)
      updateData({ ["events/" + eventId]: data });
      updateData({
        ["users/" + currentUser.uid + "/events/"]: [
          ...currentUserEventIds,
          eventId,
        ],
      });
    }
    handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create A New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <InputDatetimeField
            name="deadline"
            text="Deadline"
            state={state}
            change={(e) => {
              setState(e);
            }}
          />
          <FloatingLabel controlId="floatingTextarea2" label="Event Title">
            <Form.Control
              placeholder="Event title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </FloatingLabel>
          <br />
          <FloatingLabel controlId="floatingTextarea2" label="Description">
            <Form.Control
              as="textarea"
              placeholder="Description"
              style={{ height: "100px" }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FloatingLabel>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={(e) => handleSubmit(e)}>
          Save Changes
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEventFormModal;
