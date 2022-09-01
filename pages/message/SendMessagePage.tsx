import { useState } from "react";
import BasicLayout from "../../components/layout/BasicLayout";
import RequireWalletLayout from "../../components/layout/RequireWalletLayout";
import { useWallet } from "../../hooks/useWallet";
import TextBox from "../../components/input/TextBox";
import TextLine from "../../components/input/TextLine";
import NumberLine from "../../components/input/NumberLine";
import SendMessageButton from "../../components/button/SendMessageButton";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { BigNumber } from "ethers";
import HandleTransactionLayout from "../../components/layout/HandleTransactionLayout";

export default function SendMessagePage() {
  const [textValue, setTextValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [receiverAccountValue, setReceiverAccountValue] = useState("");
  const { currentAccount, connectWallet } = useWallet();
  const { mining, sendMessage } = useMessengerContract({
    currentAccount: currentAccount,
  });

  return (
    <BasicLayout>
      <RequireWalletLayout
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div>
          <div>send message !</div>
          <div>wallet is {currentAccount}</div>
          <HandleTransactionLayout mining={mining}>
            <div>
              <TextBox
                name="text"
                onChange={(e) => setTextValue(e.target.value)}
              />
              <TextLine
                name="account address to send"
                onChange={(e) => setReceiverAccountValue(e.target.value)}
              />
              <NumberLine
                name="amount of avax to attach"
                onChange={(e) => setTokenValue(e.target.value)}
              />
              <SendMessageButton
                name="send message"
                onClick={() => {
                  sendMessage({
                    text: textValue,
                    receiver: receiverAccountValue,
                    token: BigNumber.from(tokenValue),
                  });
                }}
              />
            </div>
          </HandleTransactionLayout>
        </div>
      </RequireWalletLayout>
    </BasicLayout>
  );
}
