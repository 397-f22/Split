import { useState } from "react";
import { Modal, Button, InputGroup, FloatingLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Badge } from "react-bootstrap";
import { useDbUpdate } from "../../utilities/firebase";
import { v4 as uuidv4 } from "uuid";


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
  );
};

const AddEventFormModal = ({ show, handleClose, currentUser }) => {
  const [state, change] = useFormData({deadline: new Date()});
  const [description, setDescription] = useState("")
  const [updateData] = useDbUpdate("/");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.length > 0) {
      const data = {
        attendees: {},
        deadline: "",
        description: description,
        organizer: currentUser.uid,
        payments: {},
        title: "title"
      };
      updateData({ ["events/" + uuidv4()  ]: data });
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
        // change={(e) => {
        //   change(e);
        //   // console.log(state);
        //   updateData({ ["events/" +  + "/deadline"]: state.values.deadline });
        // }}
      />
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
