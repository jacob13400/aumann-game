import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

import NProgress from 'nprogress';
import Button from '../Button';
import { getUsers } from '../../pages/api/users';
import { getRoom } from '../../lib/roomGet';
import { getQuestions } from '../../lib/questionsGet';
import { convertData } from '../../lib/encryptDecrypt';
import { assignQuestionsRoom } from '../../lib/assignQuestionsRoom';
import { assignQuestionsUser } from '../../lib/assignQuestionsUser';

export default function Buffer(props) {
  const [userList, setUserList] = useState([{ id: 0, username: 'jozdien'}]);
  const [questions, setQuestions] = useState({
    "questions" : {
      "1" : {
        "question" : "What was the name of the first front-wheel-drive car produced by Datsun (now Nissan)?",
        "1" : "Cherry",
        "2" : "Sunny",
        "3" : "Bluebird",
        "4" : "Skyline"
      }}});
  const [admin, setAdmin] = useState(false);
  const [roomID, setRoomID] = useState(false);
  const [username, setUsername] = useState(false);
  const [onEnter, setOnEnter] = useState(true);

  const getQuestionsFunction = async () => {
    var questions = await getQuestions();
    setQuestions(questions); 
  };

  const getUsersList = async () => {
    var users = await getUsers(roomID);
    setUserList(users);
  };
  
  const makeQuestion = async () => {
    // Progress bar start
    NProgress.start()

    var questionList = questions["questions"];
    var number = Object.keys(questionList).length;
    var num_players = Object.keys(userList).length;
    var num_ans = 4;
    
    var question_no = Object.keys(questionList)[Math.floor(Math.random() * number)];
    questionList = questionList[question_no];

    var answers = {};
    var answersCorrect = {"Correct": questionList["1"]};
    answersCorrect["question"] = questionList["question"];
    answersCorrect["questionID"] = question_no;

    // Array of the form: [1, 2, ... num_players]
    var player_indices = Array.from(new Array(num_players), (x, i) => i + 1);
    // Array of the form: [2, 3, ... num_ans]
    var ans_indices = Array.from(new Array(num_ans - 1), (x, i) => i + 2);

    var finalAns = player_indices.splice(Math.random() * num_players, 1);
    answers[finalAns] = questionList["1"];
    answersCorrect["CorrectIndex"] = finalAns[0];

    for (var i = 0; i < num_players - 1; i++)
    {
      var player_index = player_indices.splice(Math.random() * player_indices.length, 1);
      var ans_index = ans_indices.splice(Math.random() * ans_indices.length, 1);

      answers[player_index.toString()] = questionList[ans_index.toString()];
    };

    var query = {roomID: roomID, username: username};
    var tempassignQuestion1 = await assignQuestionsRoom(query, answers, answersCorrect);
    
    var answersIterate = Object.keys(answers);
    var tempUserList = userList;
    for (var iter = 0; iter < tempUserList.length; iter++)
    {
      query = {roomID: roomID, username: tempUserList[iter].username, index: answersIterate[iter], answer: answers[answersIterate[iter]]};

      var tempassignQuestion2 = await assignQuestionsUser(query, answersCorrect);

    }

    props.setShowBuffer(false);
    
    // Progress bar end
    NProgress.done()
  };


  const checkBuffer = async () => {
    if (onEnter || roomID == 0) return;

    var query = {roomID: Number(roomID)}
    var room = await getRoom(query);
    
    if (!room.isBuffer){
      // Progress bar start
      NProgress.start()

      props.setShowBuffer(false);
      
      // Progress bar end
      NProgress.done()
    }
  }

  const onEnterUpdate = async () => {
    var query = {flag: false, message: props.room};
    var roomIDCoverted = await convertData(query);

    var query = {flag: false, message: props.user};
    var usernameCoverted = await convertData(query);

    var query = {roomID: Number(roomIDCoverted)}

    var room = await getRoom(query);

    if (room.admin == usernameCoverted){
      setAdmin(true);
    }

    setRoomID(roomIDCoverted);
    setUsername(usernameCoverted);

    getQuestionsFunction();

    if (!room.isBuffer){
      // Progress bar start
      NProgress.start()
      
      props.setShowBuffer(false);
   
      // Progress bar end
      NProgress.done()
    }
  }

  useEffect(() => {
    if (onEnter) {
      setOnEnter(false);
      onEnterUpdate();
    }
    setTimeout(function(){
      getUsersList();
      checkBuffer();
    }, 1000);
  });


  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.title}>
          Waiting Room
        </div>
        <div className={styles.button}>
          <Button type={"buffer"} flag={admin} text={"Start"} action={makeQuestion}/>
        </div>
        <div className={styles.description}>
          <div className={styles.subtitle}>
            Players can join until the admin starts the game.
          </div>
          <div className={styles.roomID}>
            Room ID: {roomID}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.players}>
            Players: {userList.map(a => a.username).join(", ")}
          </div>
        </div>
      </div>
    </div>
  )
}