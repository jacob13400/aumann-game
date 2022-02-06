import styles from './styles.module.css';

export default function Timer(props) {
  var time = props.time;

  var minutes = Math.floor(time / 60).toLocaleString(undefined, {minimumIntegerDigits: 2});
  var seconds = Math.floor(time % 60).toLocaleString(undefined, {minimumIntegerDigits: 2});

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        {minutes} : {seconds}
      </div>
    </div>
  )
}