import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {useRouter} from 'next/router';
import styles from './styles.module.css';

import NProgress from 'nprogress';

import Button from '../../Button';
import { addUserRoom } from '../../../lib/roomUserAdd';
import { getUser } from '../../../lib/userCreate';
import { convertData } from '../../../lib/encryptDecrypt';
import AlertMessageModal from '../AlertMessageModal';

export default function JoinModal(props) { 
  const [formState, setFormState] = React.useState({roomID: "", username: ""});
  const [validated, setValidated] = React.useState(false);
  const [alertMessageModalShow, setAlertMessageModalShow] = React.useState(false);
  const [alertMessageDisplay, setAlertMessageDisplay] = React.useState("Default Message");

  const Router = useRouter();

  const handleSubmit = async () => {
    if (formState.roomID === "" || formState.username === "") {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true); // Triggers validation styles on form elements
    }
    else {
      // Progress bar start
      NProgress.start();

      localStorage.setItem("username", formState.username);
      localStorage.setItem("roomID", formState.roomID);

      var roomExists = await addUserRoom(formState);
      
      if (roomExists) {
        const userExists = await getUser(formState);
        var query = {flag: true, message: (formState.roomID).toString()};
        var roomIDCoverted = await convertData(query);

        var query = {flag: true, message: formState.username};
        var usernameCoverted = await convertData(query);

        Router.push({pathname: "/buffer", query:{droom2021: roomIDCoverted, duser2021: usernameCoverted}});
        
        // Progress bar end
        NProgress.done()
      }
      else {
        // Progress bar end
        NProgress.done();

        setAlertMessageDisplay("This room does not exist, or has already begun the game.");
        setAlertMessageModalShow(true);
        return;
      }
    }
  }

  return (
    <div>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Join a Room
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group controlId="roomID">
              <Form.Label>Room ID</Form.Label>
              <Form.Control
                required
                type="text" 
                placeholder="eg: AEF123" 
                onChange={(e) => 
                  setFormState({...formState, roomID: e.target.value})
                }
                value={formState.roomID}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a room ID.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                required
                type="text" 
                placeholder="Enter display name" 
                onChange={(e) => 
                  setFormState({...formState, username: e.target.value})
                }
                value={formState.username}
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type={"modal"} text={"Enter"} action={handleSubmit}/>
        </Modal.Footer>
      </Modal>

      <AlertMessageModal
        show={alertMessageModalShow}
        onHide={() => setAlertMessageModalShow(false)}
        message={alertMessageDisplay}
      />
    </div>
  );
}