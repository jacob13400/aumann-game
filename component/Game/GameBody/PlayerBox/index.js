import styles from './styles.module.css';

export default function PlayerBox({color, estimate, username}) {
  return (
    <div className={styles.container} style={{borderColor: color}}>
      <div className={styles.estimate}>
        {estimate}%
      </div>
      <div className={styles.name}>
        {username}
      </div>
    </div>
  )
}