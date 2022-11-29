import { Modal, Button } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDbUpdate } from '../../utilities/firebase';

const InviteModal = (props) => {
    const navigate = useNavigate();
    const [update] = useDbUpdate("/");

    const joinEvent = () => {
        // update the database
        var event = props.events[props.inviteID];
        var user = props.users[props.currentUserID];

        if (!user.events) {
            user.events = { 0: props.inviteID };
        } else {
            user.events[user.events.length] = props.inviteID;
        }
        event.attendees[event.attendees.length] = props.currentUserID;
        if (event.payments) {
            event.payments[event.payments.length] = {
                user: props.currentUserID,
                amount: 0,
                paid: false,
            }
        } else {
            event.payments = {
                0: {
                    user: props.currentUserID,
                    amount: 0,
                    paid: false,
                }
            }
        }

        update({ [`/events/${props.inviteID}`]: event, [`/users/${props.currentUserID}`]: user });

        // close the modal
        console.log('update');
        navigate('/');
    }

    const ContentText = ({ inviteID, currentUser, events, users }) => {
        if (!inviteID) {
            return <div>Invalide invitation!</div>
        }
        if (!currentUser) {
            return <div>Invalide User!</div>
        }
        if (!events) {
            return <div>No events!</div>
        }
        const event = events[inviteID];
        if (!event) {
            return <div>Event not found!</div>
        } else if (event.users && event.users[currentUser.id]) {
            return <div>You are already a member of this event!</div>
        } else {
            return <div>
                You are invited by #
                <strong className='text-primary'>
                    {users[event.organizer].displayName}
                </strong>
                &nbsp;to join the event&nbsp;
                <strong className='text-info'>
                    {event.title}
                </strong>
                !
            </div>
        }
    }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Invite</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ContentText inviteID={props.inviteID} currentUser={props.currentUser} events={props.events} users={props.users} />
                <Outlet />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => joinEvent()}>
                    Join
                </Button>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InviteModal;