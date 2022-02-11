import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

import Timer from '../Timer';
import Button from '../../Button';
import UserListModal from '../../Modals/UserListModal';

export default function RoomFooter(props) {
  const [userModalShow, setUserModalShow] = React.useState(false);

  const handleClick = () => {
    setUserModalShow(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <Timer time={props.time}/>
      </div>
      <div className={styles.modalButton}>
        <Button type={"userModalShow"} text={"Leaderboard"} action={handleClick}/>
      </div>
      <UserListModal
        show={userModalShow}
        onHide={() => setUserModalShow(false)}
        userList={props.userList}
        username={props.username}
      />
    </div>
  )
}