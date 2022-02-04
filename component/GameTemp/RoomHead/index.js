import React from 'react';
import styles from './styles.module.css';

import Timer from '../Timer';

export default function RoomHead(props) {
  // const [userListModalShow, setUserListModalShow] = React.useState(false);
  // var seconds = props.seconds.toString()
  // var minutes = props.minutes.toString();
  // if (seconds.length == 1) {
  //   seconds = "0" + seconds;
  // }
  // if (minutes.length == 1) {
  //   minutes = "0" + minutes;
  // }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <a className={styles.logoLink} href="../" target="_blank"/>
      </div>
      <div className={styles.title}>
        Round 1
      </div>
      <div className={styles.timer}>
        <Timer time={props.time} scale={0.75}/>
      </div>
{/*       <UserListModal */}
{/*         show={userListModalShow} */}
{/*         onHide={() => setUserListModalShow(false)} */}
{/*         userList={props.userList} */}
{/*         username={props.username} */}
{/*       /> */}
    </div>
  )
}