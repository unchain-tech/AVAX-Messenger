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
    <div>
      <div className={styles.item}>
        <div>text</div>
        <textarea
          name="text"
          placeholder="hello"
          id="input_text"
          onChange={(e) => setTextValue(e.target.value)}
          className={styles.text}
        />
      </div>

      <div className={styles.item}>
        <div>address to send</div>
        <input
          name="address"
          placeholder="0x..."
          id="input_address"
          className={styles.address}
          onChange={(e) => setReceiverAccountValue(e.target.value)}
        />
      </div>

      <div className={styles.item}>
        <div>avax to attach</div>
        <input
          type="number"
          name="avax"
          placeholder="1"
          id="input_avax"
          className={styles.avax}
          onChange={(e) => setTokenValue(e.target.value)}
        />
      </div>

      <div className={styles.button}>
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
  );
}
