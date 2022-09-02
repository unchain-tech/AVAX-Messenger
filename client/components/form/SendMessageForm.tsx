import { SendMessage } from "../../hooks/useMessengerContract";
import styles from "./SendMessageForm.module.css";
import { useState } from "react";

type Props = {
  sendMessage: SendMessage;
};

export default function SendMessageForm({ sendMessage }: Props) {
  const [textValue, setTextValue] = useState("");
  const [receiverAccountValue, setReceiverAccountValue] = useState("");
  const [tokenValue, setTokenValue] = useState("0");

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.title}>Send your message !</div>
        <div className={styles.input_container}>
          <textarea
            name="text"
            placeholder="text"
            id="input_text"
            onChange={(e) => setTextValue(e.target.value)}
            className={styles.text}
          />
        </div>

        <div className={styles.input_container}>
          <input
            name="address"
            placeholder="receiver address: 0x..."
            id="input_address"
            className={styles.address}
            onChange={(e) => setReceiverAccountValue(e.target.value)}
          />
        </div>

        <div className={styles.input_container}>
          <input
            type="number"
            name="avax"
            placeholder="avax"
            id="input_avax"
            min={0}
            className={styles.avax}
            onChange={(e) => setTokenValue(e.target.value)}
          />
        </div>

        <div className={styles.button_container}>
          <button
            className="SendMessageButton"
            onClick={() => {
              sendMessage({
                text: textValue,
                receiver: receiverAccountValue,
                tokenInEther: tokenValue,
              });
            }}
          >
            send{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
