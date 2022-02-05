import styles from './styles.module.css';

export default function UserList(props) {
  const colors = ["#EF476F", "#06D6A0", "#FB9F89", "#8EEDF7"];

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Players
      </div>
      <div className={styles.list}>
        {
          props.userList ? props.userList.map((player, index) => 
            <div className={styles.player} key={index}>
              <div className={styles.id}>
                #{index + 1}
              </div>
              <div className={styles.details}>
                <div className={styles.name} style={{color: colors[index]}}>
                  {player.username} {player.username == props.username ? " (You)" : null}
                </div>
                <div className={styles.points}>
                  Points: {player.points}
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}