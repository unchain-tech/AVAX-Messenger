import { SendMessage } from "../../hooks/useMessengerContract";
import styles from "./SendMessageForm.module.css";
import { useState } from "react";

type Props = {
  sendMessage: SendMessage;
};

export default function SendMessageForm({ sendMessage }: Props) {
  const [textValue, setTextValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [receiverAccountValue, setReceiverAccountValue] = useState("");

  return (
    <div>
      <div className={styles.item}>
        <div>text to send</div>
        <textarea
          name="text"
          placeholder="hello"
          id="input_text"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </div>

      <div className={styles.item}>
        <div>address to send</div>
        <input
          name="address"
          placeholder="0x..."
          id="input_address"
          onChange={(e) => setReceiverAccountValue(e.target.value)}
        />
      </div>

      <div className={styles.item}>
        <div>amount of avax to attach</div>
        <input
          type="number"
          name="avax"
          placeholder="1"
          id="input_avax"
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
