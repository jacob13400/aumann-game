import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

import RoomHead from './RoomHead';
import RoomBody from './RoomBody';
import RoomFooter from './RoomFooter';
import { getUsers } from '../../pages/api/users';
import { convertData } from '../../lib/encryptDecrypt';
import { getRoom } from '../../lib/roomGet';

var flag = false;

export default function Game(props) {
  const [roomID, setRoomID] = useState(props.room);
  const [username, setUsername] = useState(props.user);
  const [userList, setUserList] = useState();
  const [room, setRoom] = useState({"questionID": "0","updatedAt": {"seconds": 1629388503,"nanoseconds": 722000000},"users": [{"username": "verd"}],
                                    "createdAt": {"seconds": 1629355142,"nanoseconds": 838000000},"id": "werds"});
  const [startTime, setStartTime] = useState();
  const [endFlag, setEndFlag] = useState(false);
  const [time, setTime] = useState(300);


  const getUsersList = async () => {
    var users = await getUsers(roomID);
    setUserList(users); 
  };

  const getRoomDetails = async () => {
    var query = {flag: false, message: props.room};
    var roomIDCoverted = await convertData(query);

    query = {flag: false, message: props.user};
    var usernameConverted = await convertData(query);
    
    setRoomID(roomIDCoverted);
    setUsername(usernameConverted);
    
    query = {roomID: Number(roomIDCoverted)};
    var room = await getRoom(query);

    setRoom(room);
    setStartTime(room.createdAt.seconds*1000+(room.createdAt.nanoseconds*(10**-6)));
  };

  useEffect(() => {
    if(!flag){
      // Progress bar start
      NProgress.start()

      getUsersList();
      getRoomDetails();
      flag = true;

      // Progress bar end
      NProgress.done()
    }

    const updateUsers = setTimeout(() => {
      getUsersList();
    }, 1000);
  });


  return (
    <div className={styles.container}>
      <RoomHead time={time}/>
      <RoomBody userList={userList} username={username} roomID={roomID} startTime={startTime} setTime={setTime} timeLimit={300} endFlag={endFlag} setEndFlag={setEndFlag}/>
      <RoomFooter time={time} userList={userList} username={username}/>
    </div>
  )
}