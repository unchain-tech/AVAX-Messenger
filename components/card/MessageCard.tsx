import { ethers } from "ethers";
import { Message } from "../../hooks/useMessengerContract";
import styles from "./MessageCard.module.css";

type Props = {
  message: Message;
  onClickAccept: () => void;
  onClickDeny: () => void;
};

export default function MessageCard({
  message,
  onClickAccept,
  onClickDeny,
}: Props) {
  const depositInEther = ethers.utils.formatEther(message.depositInWei);

  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <p className={styles.title}>from {message.sender}</p>
        <p>{message.timestamp.toDateString()}</p>
      </div>
      <p>text: {message.text}</p>
      <p>depositInWei: {depositInEther}</p>
      {message.isPending && (
        <div>
          <button onClick={onClickAccept}>accept</button>
          <button onClick={onClickDeny}>deny</button>
        </div>
      )}
    </div>
  );
}
