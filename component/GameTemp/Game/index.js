import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './styles.module.css';

import PlayerBox from './PlayerBox';
import Button from '../../../component/Button';
import LockModal from '../../../component/Modals/LockModal';
import AlertEmptyModal from '../../../component/Modals/AlertEmptyModal';
import AlertLimitModal from '../../../component/Modals/AlertLimitModal';
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
    const query = {username: props.username, roomID: Number(props.roomID), estimate: estimateValue};
    const points = await updateUserEstimate(query);

  }
}

// Function to handle closing of the lock modal without confirmation
const handleLockClose = async (setLockModalShow) => {
  setLockModalShow(false);
}

var questionFlag = false;


export default function Game(props) {
  const [question, setQuestion] = React.useState("Please wait while the question is loaded.");
  const [answer, setAnswer] = React.useState("42");
  const [answerBool, setAnswerBool] = React.useState(false); // true if answer correct
  const [estimate, setEstimate] = React.useState("33");
  const [lock, setLock] = React.useState(false);
  const [lockModalShow, setLockModalShow] = React.useState(false);

  const decodeHTML = (str) => {
    return str.replace(/(&#(\d+);)/g, function(match, capture, charCode) {
      return String.fromCharCode(charCode);
    });
  }

  // Function to handle changing of value in the estimate input field - some values aren't allowed, like characters, etc.
  const handleChange = async (estimate) => {
    if (!estimate || estimate.match(/^\d{1,}(\.\d{0,4})?$/)) {
      setEstimate(value);
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
      updatePoints(); // Calculating user score
    }

    if(!questionFlag){
      if(props.userList && props.userList[0]){
        setQuestion(decodeHTML(props.userList[0].question));
        props.userList.map((player, index) => {
          if(player.username == props.username){
            setAnswer(decodeHTML(player.answer));
            setAnswerBool(player.answerBool);
            setEstimate(player.estimate);
          }
        })
        questionFlag = true;
      }
    }
  });
  // Hook for question
//   const [question, setQuestion] = React.useState("What is the air-speed velocity of an unladen swallow?");
// 
//   // Hook for user's answer
//   const [answer, setAnswer] = React.useState("42");
//   const [answerBool, setAnswerBool] = React.useState(false);
// 
//   // Modal show/hide flags
//   const [lockModalShow, setLockModalShow] = React.useState(false);
//   const [alertEmptyModalShow, setAlertEmptyModalShow] = React.useState(false);
//   const [alertLimitModalShow, setAlertLimitModalShow] = React.useState(false);
// 
//   // Storing value entered in estimate input field
//   const [estimateValue, setEstimateValue] = React.useState("75");
// 
//   // Whether estimate input field is accepting input
//   const [lock, setLock] = React.useState(false);
// 
//   // Whether timer is still running - necessary to prevent infinite triggers of the setLock(true) call below
//   const [flag, setFlag] = React.useState(true);
// 
//   const updatePoints = async () => {
//     const query = {username: props.username, roomID: Number(props.roomID), estimate: Number(estimateValue), answerBool: answerBool};
//     const points = await updateUserPoints(query);
//     // console.log("User Updated - at Server: ", points);
//   };
// 
//   // If timer has reached zero, lock the input field
//   if(props.minutes == 0 && props.seconds == 0 && flag) {
//     setLock(true);
//     setFlag(false);
// 
//     // Calculating the user's score
//     updatePoints();
//   }
// 
//   const updateEstimate = async (estimate) => {
//     const query = {username: props.username, roomID: Number(props.roomID), estimate: estimate};
//     const points = await updateUserEstimate(query);
// 
//     // console.log("User Updated: ", points);
//   };
// 
//   useEffect(() => {
//     if(!questionFlag){
//       if(props.userList[0]){
//         if(props.userList[0].question != "What is the air-speed velocity of an unladen swallow?"){
//           setQuestion(props.userList[0].question.replaceAll("&quot;", "\""));
// 
//           props.userList.map((player, index) => {
//             if(player.username == props.username){
//               setAnswer(player.answer);
//               setAnswerBool(player.answerBool);
//               setEstimateValue(player.estimate)
//             }
//           })
// 
//           questionFlag = true;
//         }
//       }
//     }
//   });


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
              <Form.Control className={styles.number} type="text" placeholder="33.33" disabled={lock} value={estimate} 
                onChange={(e) => {handleChange(e.target.value)}}/>
            </Form.Group>
          </Form>
        </div>
        <div className={styles.estimateLock}>
          <Button type={"lock"} text={"Lock"} action={() => setLockModalShow(true)}/>
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
{/*       <div className={styles.question}>
{/*         <div className={styles.questionText}> */}
{/*           {question} */}
{/*         </div> */}
{/*       </div> */}
{/*       <div className={styles.answer}> */}
{/*         <div className={styles.yourAnswer}> */}
{/*           Your Answer: */}
{/*         </div> */}
{/*         <div className={styles.answerText}> */}
{/*           {answer} */}
{/*         </div> */}
{/*       </div> */}
{/*       <div className={styles.estimate}> */}
{/*         <div className={styles.yourEstimate}> */}
{/*           Your Estimate: */}
{/*         </div> */}
{/*         <div className={styles.estimateBoxes}> */}
{/*           <div className={styles.estimateInput}> */}
{/*             <Form onSubmit={(event) => {event.preventDefault()}}> */}
{/*               <Form.Group controlId="estimate"> */}
{/*                 <Form.Control className={styles.number} type="text" placeholder="33.33" disabled={lock} value={estimateValue}  */}
{/*                   onChange={(e) => {handleChange(e.target.value, setEstimateValue, props)}}/> */}
{/*               </Form.Group> */}
{/*             </Form> */}
{/*           </div> */}
{/*           <div className={styles.lockBox}> */}
{/*             <Button type={"lock"} text={"Lock"} action={() => {updateEstimate(estimateValue); setLockModalShow(true);}}></Button> */}
{/*           </div> */}
{/*         </div> */}
{/*       </div> */}
{/*       <div className={styles.others}> */}
{/*         <div className={styles.othersContainer}> */}
{/*           { */}
{/*             props.userList.map((player, index) =>  */}
{/*               // If player has locked in their choice, change colour of box border */}
{/*               player.lock ? */}
{/*                 <div className={styles.otherBoxActive}> */}
{/*                   <div className={styles.otherEstimate}> */}
{/*                     {player.estimate}% */}
{/*                   </div> */}
{/*                   <div className={styles.otherName}> */}
{/*                     {player.username} */}
{/*                   </div> */}
{/*                 </div> */}
{/*               : */}
{/*                 <div className={styles.otherBoxInactive}> */}
{/*                   <div className={styles.otherEstimate}> */}
{/*                     {player.estimate}% */}
{/*                   </div> */}
{/*                   <div className={styles.otherName}> */}
{/*                     {player.username} */}
{/*                   </div> */}
{/*                 </div> */}
{/*             ) */}
{/*           } */}
{/*         </div> */}
{/*       </div> */}
{/*  */}
{/*       <LockModal */}
{/*         show={lockModalShow} */}
{/*         onConfirm={() => handleLock(estimateValue, setLockModalShow, setLock, setAlertEmptyModalShow, setAlertLimitModalShow, props)} */}
{/*         onHide={() => handleLockClose(setLockModalShow)} */}
{/*       /> */}
{/*       <AlertEmptyModal */}
{/*         show={alertEmptyModalShow} */}
{/*         onHide={() => setAlertEmptyModalShow(false)} */}
{/*       /> */}
{/*       <AlertLimitModal */}
{/*         show={alertLimitModalShow} */}
{/*         onHide={() => setAlertLimitModalShow(false)} */}
{/*       /> */}
    </div>
  )
}