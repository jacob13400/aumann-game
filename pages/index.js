import React, { useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from '../component/Button';
import InfoModal from '../component/Modals/InfoModal';
import CreateModal from '../component/Modals/CreateModal';
import JoinModal from '../component/Modals/JoinModal';
import Credits from '../component/Credits';
import { deleteRoom } from '../lib/deleteOldDataRoom';
import { deleteUser } from '../lib/deleteOldDataUser';


export default function Home(props) {
  const [infoModalShow, setInfoModalShow] = React.useState(false);
  const [createModalShow, setCreateModalShow] = React.useState(false);
  const [joinModalShow, setJoinModalShow] = React.useState(false);

  const checkDataDelete = async () => {
    const deleteRoomData = await deleteRoom();
    const deleteUserData = await deleteUser();
  };

  useEffect(() => {
    checkDataDelete();
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Aumann's Game</title>
        <link rel="icon" href="/icons/logoBlack.png"/>
      </Head>

      <main className={styles.main}>
        <div className={styles.title}>
          Aumann's Game
        </div>
        <div className={styles.subtitle}>
          Aumann’s Agreement Theorem says that rational agents with common knowledge of each others' beliefs cannot agree to disagree.
          This assumes not only perfect rationality, but perfect trust in each other’s rationality, trust in that trust, and so on. 
          This game is about seeing how things play out given the imperfect trust between you and your friends.
        </div>
        <div className={styles.buttons}>
          <Button type={"info"} text={"How To Play"} action={() => setInfoModalShow(true)}/>
          <Button type={"play"} text={"Create Room"} action={() => setCreateModalShow(true)}/>
          <Button type={"play"} text={"Join Room"} action={() => setJoinModalShow(true)}/>
        </div>
        <Credits/>
        <InfoModal
          show={infoModalShow}
          onHide={() => setInfoModalShow(false)}
        />
        <CreateModal
          show={createModalShow}
          onHide={() => setCreateModalShow(false)}
        />
        <JoinModal
          show={joinModalShow}
          onHide={() => setJoinModalShow(false)}
        />
      </main>
    </div>
  )
}