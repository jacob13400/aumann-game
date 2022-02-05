import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

import UserList from '../UserList';
import Game from '../Game';

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
        <Game userList={props.userList} username={props.username} roomID={props.roomID} time={props.time} endFlag={props.endFlag}/>
      </div>
      {/* <UserList userList={userList} username={username}/> */}
      {/* <Game userList={userList} username={username} roomID={roomID} minutes={timer.minutes} seconds={timer.seconds}/> */}
    </div>
  )
}