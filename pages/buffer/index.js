import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NProgress from 'nprogress';
import ButtonBuffer from '../../component/ButtonBuffer';

import { getRoom } from '../../lib/roomGet';
import { getQuestions } from '../../lib/questionsGet';
import { getUsers } from '../api/users';
import { convertData } from '../../lib/encryptDecrypt';
import { assignQuestionsRoom } from '../../lib/assignQuestionsRoom';
import { assignQuestionsUser } from '../../lib/assignQuestionsUser';

export default function Buffer(props) {

  const Router = useRouter();
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
    
    // console.log(questionList);

    var answers = {};
    var answersCorrect = {"Correct": questionList["1"]};
    answersCorrect["question"] = questionList["question"];
    answersCorrect["questionID"] = question_no;

    // player_indices is an array that goes: [1, 2, ... num_players]
    var player_indices = Array.from(new Array(num_players), (x, i) => i + 1);
    // ans_indices is an array that goes: [2, 3, ... num_ans]
    var ans_indices = Array.from(new Array(num_ans - 1), (x, i) => i + 2);

    var finalAns = player_indices.splice(Math.random() * num_players, 1);
    answers[finalAns] = questionList["1"];
    answersCorrect["CorrectIndex"] = finalAns[0];

    for (var i = 0; i < num_players - 1; i++) {
      var player_index = player_indices.splice(Math.random() * player_indices.length, 1);
      var ans_index = ans_indices.splice(Math.random() * ans_indices.length, 1);

      answers[player_index.toString()] = questionList[ans_index.toString()];
    };

    var query = {roomID: roomID, username: username};
    var tempassignQuestion1 = await assignQuestionsRoom(query, answers, answersCorrect);
    // console.log("Answers: ", answers, answersCorrect);
    
    var answersIterate = Object.keys(answers);
    var tempUserList = userList;
    for (var iter = 0; iter < tempUserList.length; iter++){
      query = {roomID: roomID, username: tempUserList[iter].username, index: answersIterate[iter], answer: answers[answersIterate[iter]]};
      // console.log("User Data Update: ", query)

      var tempassignQuestion2 = await assignQuestionsUser(query, answersCorrect);

    }

    Router.push({pathname: "/room", query: {droom2021: props.droom2021, duser2021: props.duser2021}});
    
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

      Router.push({pathname: "/room", query: {droom2021: props.droom2021, duser2021: props.duser2021}});
      
      // Progress bar end
      NProgress.done()
    }
  }

  const onEnterUpdate = async () => {
    var query = {flag: false, message: props.droom2021};
    var roomIDCoverted = await convertData(query);

    var query = {flag: false, message: props.duser2021};
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
      
      Router.push({pathname: "/room", query: {droom2021: props.droom2021, duser2021: props.duser2021}});
   
      // Progress bar end
      NProgress.done()
    }

    // console.log("Update Room on Enter: ", room);
  }

  useEffect(() => {
    if (onEnter){
      setOnEnter(false);
      onEnterUpdate();
    }

    setTimeout(function(){
      getUsersList();
      checkBuffer();
      // console.log("User List: ", userList);
    }, 1000);
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Waiting Room</title>
        <link rel="icon" href="../icons/logo.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.body}>
          <div className={styles.title}>
            Waiting Room
          </div>
          <div className={styles.button}>
            <ButtonBuffer isAdmin={admin} text={"Start"} action={() => {makeQuestion();}}></ButtonBuffer>
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
      </main>
    </div>
  )
}

Buffer.getInitialProps = async (ctx) => {
  return ctx.query;
}