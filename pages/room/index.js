import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './styles.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Buffer from '../../component/Buffer';
import GameTemp from '../../component/GameTemp';

export default function Room(props) {
  const [showBuffer, setShowBuffer] = useState(true);

  return (
    <div className={styles.container}>
      <Head>
        <title>Room - Aumann's Game</title>
        <link rel="icon" href="/icons/logoBlack.png"/>
      </Head>

      {
        showBuffer ? 
          <Buffer room={props.droom2021} user={props.duser2021} setShowBuffer={setShowBuffer}/> 
        : 
          <GameTemp room={props.droom2021} user={props.duser2021}/>
      }
    </div>
  )
}

Room.getInitialProps = async (ctx) => {
  return ctx.query;
}