import styles from './styles.module.css';

export default function UserList(props) {
  const colours = ["#EF476F", "#06D6A0", "#FB9F89", "#8EEDF7"];

  return (
    <div className={styles.listContainer}>
      <div className={styles.list}>
        <div className={styles.listTitle}>
          Players
        </div>
        <div className={styles.listPlayers}>
          {
            props.userList.map((player, index) => 
              <div className={styles.player}>
                <div className={styles.playerNo}>
                  #{index + 1}
                </div>
                <div className={styles.playerDetails}>
                  <div style={{color: colours[index]}}>
                    {player.username}
                    {player.username == props.username ? " (You)" : null}
                  </div>
                  <div className={styles.playerPoints}>
                    Points: {player.points}
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}