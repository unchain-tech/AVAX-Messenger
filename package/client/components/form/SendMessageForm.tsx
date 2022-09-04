import { SendMessage } from "../../hooks/useMessengerContract";
import styles from "./Form.module.css";
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
        <textarea
          name="text"
          placeholder="text"
          id="input_text"
          onChange={(e) => setTextValue(e.target.value)}
          className={styles.text}
        />

        <input
          name="address"
          placeholder="receiver address: 0x..."
          id="input_address"
          className={styles.address}
          onChange={(e) => setReceiverAccountValue(e.target.value)}
        />

        <input
          type="number"
          name="avax"
          placeholder="AVAX"
          id="input_avax"
          min={0}
          className={styles.avax}
          onChange={(e) => setTokenValue(e.target.value)}
        />

        <div className={styles.button}>
          <button
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
