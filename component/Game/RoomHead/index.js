import React from 'react';
import styles from './styles.module.css';

import Timer from '../Timer';

export default function RoomHead(props) {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <a className={styles.logoLink} href="../" target="_blank"/>
      </div>
      <div className={styles.title}>
        Round 1
      </div>
      <div className={styles.timer}>
        <Timer time={props.time}/>
      </div>
    </div>
  )
}