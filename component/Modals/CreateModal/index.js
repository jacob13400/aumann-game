import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {useRouter} from 'next/router';
import styles from './styles.module.css';

import NProgress from 'nprogress';

import Button from '../../Button';
import { getRoom } from '../../../lib/roomCreate';
import { getUser } from '../../../lib/userCreate';
import { convertData } from '../../../lib/encryptDecrypt';

export default function CreateModal(props) { 
  const [formState, setFormState] = React.useState({username: ""});
  const [validated, setValidated] = React.useState(false);

  const Router = useRouter();

  const handleSubmit = async () => {
    if (formState.username === "") {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true); // Triggers validation styles on form elements
    }
    else {
      // Progress bar start
      NProgress.start()

      const roomID = await getRoom(formState);
      var query = {username: formState.username, roomID: roomID};
      const userExists = await getUser(query);
      
      localStorage.setItem("username", formState.username);
      localStorage.setItem("roomID", formState.roomID);
      
      if (userExists){
        console.log('User Exists');
      }
      else{  
        var query = {flag: true, message: roomID.toString()};
        var roomIDCoverted = await convertData(query);
        
        var query = {flag: true, message: formState.username};
        var usernameCoverted = await convertData(query);

        Router.push({pathname: "/room", query:{droom2021: roomIDCoverted, duser2021: usernameCoverted}});
      }

      // Progress bar end
      NProgress.done()
    }
  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a Room
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
  );
}