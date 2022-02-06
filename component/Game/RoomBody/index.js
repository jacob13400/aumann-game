import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

import UserList from '../UserList';
import GameBody from '../GameBody';

export default function RoomBody(props) {
  const timeLeft = () => {
    if (props.endFlag) {
      return 0;
    }

    var timeRemaining = Math.floor(props.timeLimit - (new Date() - new Date(props.startTime)) / 1000);

    if (timeRemaining <= 0) {
      timeRemaining = 0;
      props.setEndFlag(true);
    }

    return timeRemaining;
  }

  useEffect(() => {
    const timerSet = setTimeout(() => {
      props.setTime(timeLeft());
    }, 1000);
  });

  return (
    <div className={styles.container}>
      <div className={styles.users}>
        <UserList userList={props.userList} username={props.username}/>
      </div>
      <div className={styles.game}>
        <GameBody userList={props.userList} username={props.username} roomID={props.roomID} time={props.time} endFlag={props.endFlag} setEndFlag={props.setEndFlag}/>
      </div>
    </div>
  )
}