import styles from './styles.module.css';

import Timer from '../Timer';
import UserListModal from '../../Modals/UserListModal'; // Add button to view userlist modal here in mobile view

export default function RoomFooter(props) {
  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <Timer time={props.time}/>
      </div>
      {/* <div className={styles.timer}> */}
      {/*   {minutes} : {seconds} */}
      {/* </div> */}
    </div>
  )
}