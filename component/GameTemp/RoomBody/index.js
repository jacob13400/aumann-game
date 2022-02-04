import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function RoomBody(props) {
  useEffect(() => {
    const timerSet = setTimeout(() => {
      
    }, 1000);
  });

  return (
    <div className={styles.container}>
      <UserList userList={userList} username={username}/>
      <Game userList={userList} username={username} roomID={roomID} minutes={timer.minutes} seconds={timer.seconds}/>
    </div>
  )
}