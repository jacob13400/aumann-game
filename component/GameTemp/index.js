import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

import RoomHead from './RoomHead';
import RoomBody from './RoomBody';
import RoomFooter from './RoomFooter';
// import UserList from './UserList';
// import Game from './Game';
import { getUsers } from '../../pages/api/users';
import { convertData } from '../../lib/encryptDecrypt';
import { getRoom } from '../../lib/roomGet';

var flag = false;
// var finalCheck = 5;
// var counter = 10; // Necessary because the first updates of lockFlag happen after the first checks for some reason

export default function GameTemp(props) {
  const [roomID, setRoomID] = useState(props.room);
  const [username, setUsername] = useState(props.user);
  const [userList, setUserList] = useState([{ id: 0, username: 'jozdien', roomID: 0, points: 0, estimate: "75", lock: false, 
                                              color: "#0FFFFF", question: "What is the air-speed velocity of an unladen swallow?"},
                                              { id: 1, username: 'zeref', roomID: 0, points: 0, estimate: "75", lock: false, 
                                              color: "#FFFFFF", question: "What is the air-speed velocity of an unladen swallow?"}]);
  const [room, setRoom] = useState({"questionID": "0","updatedAt": {"seconds": 1629388503,"nanoseconds": 722000000},"users": [{"username": "verd"}],
                                    "createdAt": {"seconds": 1629355142,"nanoseconds": 838000000},"id": "werds"});
  const [startTime, setStartTime] = useState();
  // const [timer, setTimer] = useState({"minutes": 5, "seconds": 0});
  const [endFlag, setEndFlag] = useState(false);
  const [time, setTime] = useState(300);
  // const [time, setTime] = useState(props.timeLimit);


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

//   const timeLeft = () => {
//     var startTime = new Date(interval);
//     var currTime = new Date();
// 
//     var seconds = 300 - (currTime - startTime) / 1000;
// 
//     if(Math.floor(seconds) <= 0) {
//       return {"minutes": 0, "seconds": 0};
//     }
//     else {
//       return {"minutes": Math.floor(seconds / 60), "seconds": Math.floor(seconds % 60)};
//     }
//   };
  
  // NOTE: Whatever state variables need to be updated constantly (such as userList), move OUTSIDE the flag check block.
  // I just put it inside so that the console doesn't get flooded during development.
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
    
    // const timerSet = setTimeout(() => {
    //   var lockFlag = true;
    //   for (const user in userList) {
    //     if (!userList[user].lock) {
    //       lockFlag = false;
    //       break;
    //     }
    //   }
    //   if(lockFlag && counter <= 0) {
    //     setTimer({"minutes": 0, "seconds": 0});
    //     console.log("Test");
    //   }
    //   else {
    //     setTimer(timeLeft());
    //     counter--;
    //   }
    // }, 1000);

    const updateUsers = setTimeout(() => {
      getUsersList();
    }, 1000);

    // if (timer.seconds % 5 == 0 && timer.minutes > 0) {
    //   getUsersList();
    // }
    // else if (timer.minutes <= 0 && timer.seconds > 10) {
    //   getUsersList();
    // }
    // else if (timer.minutes <= 0 && timer.seconds <= 0 && finalCheck > 0) {
    //   finalCheck--;
    //   getUsersList();
    // }
  });


  return (
    <div className={styles.container}>
      <RoomHead time={time}/>
      <RoomBody userList={userList} username={username} roomID={roomID} startTime={startTime} setTime={setTime} timeLimit={300} endFlag={endFlag} setEndFlag={setEndFlag}/>
      <RoomFooter time={time}/>
      {/* <RoomHead userList={userList} username={username} roomID={roomID} minutes={timer.minutes} seconds={timer.seconds}/> */}
      {/* <div className={styles.body}> */}
      {/*   <UserList userList={userList} username={username}/> */}
      {/*   <Game userList={userList} username={username} roomID={roomID} minutes={timer.minutes} seconds={timer.seconds}/> */}
      {/* </div> */}
      {/* <div className={styles.padBodyBottom}/> */}
      {/* <RoomFooter minutes={timer.minutes} seconds={timer.seconds}/> */}
    </div>
  )
}