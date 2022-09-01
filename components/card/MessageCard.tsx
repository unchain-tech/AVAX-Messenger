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
        <span className={styles.title}>from {message.sender}</span>
        <span>{message.timestamp.toDateString()}</span>
      </div>
      <span>text: {message.text}</span>
      <span>depositInWei: {depositInEther}</span>
      {message.isPending && (
        <div>
          <button onClick={onClickAccept}>accept</button>
          <button onClick={onClickDeny}>deny</button>
        </div>
      )}
    </div>
  );
}
