import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import UseWalletLayout from "../../components/UseWalletLayout";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import abi from "../../utils/Messenger.json";
import TextBox from "../../components/TextBox";

const contractAddress = "0xC3c90d7093712840c62ef806B1a026377A293286";
const contractABI = abi.abi;

type Props = {
  text: string;
  receiver: string;
  token: number; // numberでいいのかわからん！
};

async function SendMessage({ text, receiver, token }: Props) {
  alert("send");
  try {
    const { ethereum } = window as any;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const MessengerContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      // MAX_ETH = gas_fee * gasLimit
      const postTxn = await MessengerContract.post(text, receiver, {
        gasLimit: 300000,
        value: token, // check in wei
      });
      console.log("Mining...", postTxn.hash);
      await postTxn.wait();
      console.log("Mined -- ", postTxn.hash);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
}

//TODO: textarea以外も使う

export default function SendMessagePage() {
  const [textValue, setTextValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [receiverAccountValue, setReceiverAccountValue] = useState("");
  const { currentAccount, connectWallet } = useWallet();

  return (
    <PageLayout>
      <UseWalletLayout
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div>
          <div>send message !</div>
          <div>wallet is {currentAccount}</div>
          {/* テキストボックス */}
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
            </div>
          )}
          {/* sendボタンにsend関数を連動 */}
          {currentAccount && (
            <button
              className="postButton"
              onClick={() => {
                SendMessage({
                  text: textValue,
                  receiver: receiverAccountValue,
                  token: parseInt(tokenValue, 10),
                });
              }}
            >
              send
            </button>
          )}
        </div>
      </UseWalletLayout>
    </PageLayout>
  );
}
