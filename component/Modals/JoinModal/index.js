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
  const [formState, setFormState] = React.useState({
    roomID: "",
    username: "",
  });
  const [alertMessageModalShow, setAlertMessageModalShow] = React.useState(false);
  const [alertMessageDisplay, setAlertMessageDisplay] = React.useState("Default Message");

  const Router = useRouter();

  const onEnter = async () => {

    // Progress bar start
    NProgress.start();

    localStorage.setItem("username", formState.username);
    localStorage.setItem("roomID", formState.roomID);

    // console.log("Sent: ", formState);

    var roomExists = await addUserRoom(formState);
    
    if (roomExists){
      const userExists = await getUser(formState);
      var query = {flag: true, message: (formState.roomID).toString()};
      var roomIDCoverted = await convertData(query);

      var query = {flag: true, message: formState.username};
      var usernameCoverted = await convertData(query);

      Router.push({pathname: "/buffer", query:{droom2021: roomIDCoverted, duser2021: usernameCoverted}});
    }
    else{
      console.log("Room does not Exists/Game has already started");
      // Progress bar end
      NProgress.done();
      setAlertMessageDisplay("Room does not Exists/Game has already started")
      setAlertMessageModalShow(true);
      return;
    }

    // Progress bar end
    NProgress.done()
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
        <Form>
          <Form.Group controlId="roomID">
            <Form.Label>Room ID</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="eg: AEF123" 
              onChange={(e) => 
                setFormState({ ...formState, roomID: e.target.value})
              }
              value={formState.roomID}
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter display name" 
              onChange={(e) => 
                setFormState({ ...formState, username: e.target.value})
              }
              value={formState.username}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type={"modal"} text={"Enter"} action={onEnter}>Close</Button>
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