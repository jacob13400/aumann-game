import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './styles.module.css';

import PlayerBox from './PlayerBox';
import Button from '../../../component/Button';
import LockModal from '../../../component/Modals/LockModal';
import AlertEmptyModal from '../../../component/Modals/AlertEmptyModal';
import AlertLimitModal from '../../../component/Modals/AlertLimitModal';
import GameEndModal from '../../../component/Modals/GameEndModal';
import { updateUserEstimate } from '../../../lib/userEstimate';
import { updateUserPoints } from '../../../lib/userPoints';


// Function to handle locking of the estimate input field
const handleLock = async (estimateValue, setLockModalShow, setLock, setAlertEmptyModalShow, setAlertLimitModalShow, props) => {
  setLockModalShow(false);
  // If the estimate field was empty
  if (estimateValue == "")
  {
    setAlertEmptyModalShow(true);
  }
  // If estimate was 0 or greater than 100
  else if (estimateValue == 0 || estimateValue >= 100)
  {
    setAlertLimitModalShow(true);
  }
  else
  {
    setLock(true);
    const query = {username: props.username, roomID: Number(props.roomID), estimate: estimateValue, lock: true};
    const points = await updateUserEstimate(query);
  }
}

var questionFlag = false;

export default function GameBody(props) {
  const [playersNum, setPlayersNum] = React.useState(1);
  const [question, setQuestion] = React.useState("Please wait while the question is loaded.");
  const [answer, setAnswer] = React.useState("42");
  const [answerBool, setAnswerBool] = React.useState(false); // true if answer correct
  const [estimate, setEstimate] = React.useState("75");
  const [lock, setLock] = React.useState(false);
  const [lockModalShow, setLockModalShow] = React.useState(false);
  const [alertEmptyModalShow, setAlertEmptyModalShow] = React.useState(false);
  const [alertLimitModalShow, setAlertLimitModalShow] = React.useState(false);
  const [gameEndModalShow, setGameEndModalShow] = React.useState(false);

  const decodeHTML = (str) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  // Function to handle changing of value in the estimate input field - some values aren't allowed, like characters, etc.
  const handleChange = async (estimate) => {
    if (!estimate || estimate.match(/^\d{1,}(\.\d{0,4})?$/)) {
      setEstimate(estimate);
      if (estimate > 0 && estimate < 100) {   
        const query = {username: props.username, roomID: Number(props.roomID), estimate: estimate};
        const points = await updateUserEstimate(query);
      }
    }
  }

  const updateEstimate = async (estimate) => {
    const query = {username: props.username, roomID: Number(props.roomID), estimate: estimate};
    const points = await updateUserEstimate(query);
  };

  const updatePoints = async () => {
    const query = {username: props.username, roomID: Number(props.roomID), estimate: Number(estimate), answerBool: answerBool};
    const points = await updateUserPoints(query);
  };

  useEffect(() => {
    if (props.endFlag) {
      setLock(true);
      setGameEndModalShow(true);
      updatePoints(); // Calculating user score
    }

    if (props.userList && props.userList[0] && props.userList.every(player => player.lock)) {
      props.setEndFlag(true);
    }

    if(props.userList && props.userList[0]) {
      props.userList.map((player, index) => {
        if(player.username == props.username) {
          setLock(player.lock);
        }
      })
    }

    if(!questionFlag) {
      if(props.userList && props.userList[0]) {
        setPlayersNum(props.userList.length);
        setQuestion(decodeHTML(props.userList[0].question));
        props.userList.map((player, index) => {
          if(player.username == props.username) {
            setAnswer(decodeHTML(player.answer));
            setAnswerBool(player.answerBool);
            setEstimate(player.estimate);
          }
        })
        questionFlag = true;
      }
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.question}>
        {question}
      </div>
      <div className={styles.answer}>
        <div className={styles.answerTitle}>
          Your Answer: 
        </div>
        <div className={styles.answerText}>
          {answer}
        </div>
      </div>
      <div className={styles.estimate}>
        <div className={styles.estimateTitle}>
          Your Estimate: 
        </div>
        <div className={styles.estimateInput}>
          <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group controlId="estimate">
              <Form.Control className={styles.number} type="text" placeholder="75" disabled={lock} value={estimate} 
                onChange={(e) => {handleChange(e.target.value)}}/>
            </Form.Group>
          </Form>
        </div>
        <div className={styles.estimateLock}>
          <Button type={"lock"} text={"Lock"} flag={lock} action={() => setLockModalShow(true)}/>
        </div>
      </div>
      <div className={styles.players}>
        {
          props.userList ? props.userList.map((player, index) =>
            player.lock ?
              <PlayerBox color={"#90EE90"} estimate={player.estimate} username={player.username} key={index}/>
            :
              <PlayerBox color={"#FFFFFF"} estimate={player.estimate} username={player.username} key={index}/>
          ) : null
        }
      </div>
      <LockModal
        show={lockModalShow}
        onConfirm={() => handleLock(estimate, setLockModalShow, setLock, setAlertEmptyModalShow, setAlertLimitModalShow, props)}
        onHide={() => setLockModalShow(false)}
      />
      <AlertEmptyModal
        show={alertEmptyModalShow}
        onHide={() => setAlertEmptyModalShow(false)}
      />
      <AlertLimitModal
        show={alertLimitModalShow}
        onHide={() => setAlertLimitModalShow(false)}
      />
      <GameEndModal
        show={gameEndModalShow}
        correct={answerBool}
        estimate={estimate}
        count={playersNum}
        onHide={() => setGameEndModalShow(false)}
      />
    </div>
  )
}