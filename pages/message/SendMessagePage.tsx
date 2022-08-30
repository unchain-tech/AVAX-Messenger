import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import UseWalletLayout from "../../components/UseWalletLayout";
import { useWallet } from "../../hooks/useWallet";
import TextBox from "../../components/TextBox";
import SendMessageButton from "../../components/SendMessageButton";
import { useMessengerContract } from "../../hooks/useMessengerContract";

//TODO: textarea以外も使う
//TODO: eventを受け付ける

export default function SendMessagePage() {
  const [textValue, setTextValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [receiverAccountValue, setReceiverAccountValue] = useState("");
  const { currentAccount, connectWallet } = useWallet();
  const { mining, sendMessage } = useMessengerContract();

  return (
    <PageLayout>
      <UseWalletLayout
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div>
          <div>send message !</div>
          <div>wallet is {currentAccount}</div>
          {currentAccount && (
            <div>
              <TextBox
                name="text"
                onChange={(e) => setTextValue(e.target.value)}
              />
              <TextBox
                name="account address to send"
                onChange={(e) => setReceiverAccountValue(e.target.value)}
              />
              <TextBox
                name="amount of avax to attach"
                onChange={(e) => setTokenValue(e.target.value)}
              />
              <SendMessageButton
                name="send message"
                onClick={() => {
                  sendMessage({
                    text: textValue,
                    receiver: receiverAccountValue,
                    token: parseInt(tokenValue, 10),
                  });
                }}
              />
            </div>
          )}
        </div>
      </UseWalletLayout>
    </PageLayout>
  );
}
