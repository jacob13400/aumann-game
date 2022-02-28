import React from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from './styles.module.css';

import Button from '../../Button';

export default function GameEndModal(props) {
  var correctText = "wrong";
  var points = 100 * Math.log2(props.count / (props.count - 1) * (1 - props.estimate / 100));
  if (props.correct) {
    correctText = "right";
    if (props.count == 1) {
      points = 100;
    }
    else {
      points = 100 * Math.log2(props.count * props.estimate / 100);
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
          End of Round
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You had the {correctText} answer.  You gave a {props.estimate}% chance of your answer being right, so you get {points.toFixed(2)} points.
      </Modal.Body>
      <Modal.Footer>
        <Button type={"modal"} text={"Next"} action={props.onHide}></Button>
      </Modal.Footer>
    </Modal>
  );
}