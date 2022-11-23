import { useState } from "react";
import { Modal, Button, InputGroup, FloatingLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Badge } from "react-bootstrap";
import { useDbUpdate, updateData } from "../../utilities/firebase";

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
  console.log("this is the deadline stored in state");
  console.log(state.values?.[name]);
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
        defaultValue={""}
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
  );
};

const AddEventForm = ({}) => {
  const [state, change] = useFormData();
  return (
    <div>
      <InputDatetimeField
        name="deadline"
        text="Deadline"
        state={state}
        change={(e) => {
          change(e);
          // console.log(state);
          // updateData({ ["/events/" + eventId + "/deadline"]: state.values.deadline });
        }}
      />
      <FloatingLabel controlId="floatingTextarea2" label="Description">
        <Form.Control
          as="textarea"
          placeholder="Description"
          style={{ height: "100px" }}
        />
      </FloatingLabel>
    </div>
  );
};

const AddEventFormModal = ({ show, handleClose, currentUser }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create A New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>        
        <AddEventForm />        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEventFormModal;
