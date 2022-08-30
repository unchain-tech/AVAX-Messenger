import { useState } from "react";
import Layout from "../../components/layout";
import WalletLayout from "../../components/walletLayout";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import abi from "../../utils/Messenger.json";

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
      // 予期せぬ処理ブロックなどでガス量が無理にならないための上限を設定
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

export default function SendMessagePage() {
  const [textValue, setTextValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [receiverAccountValue, setReceiverAccountValue] = useState("");
  const { currentAccount } = useWallet();

  return (
    <Layout>
      <WalletLayout>
        <div>
          <div>First Page !</div>
          <div>wallet is {currentAccount}</div>
          {/* テキストボックス */}
          {currentAccount && (
            <textarea
              name="messageArea"
              placeholder="type here"
              id="content"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
          )}
          {textValue}
          {/* 受信者ボックス */}
          {currentAccount && (
            <textarea
              name="messageArea"
              placeholder="type here"
              id="content"
              value={receiverAccountValue}
              onChange={(e) => setReceiverAccountValue(e.target.value)}
            />
          )}
          {receiverAccountValue}
          {/* トークンボックス */}
          {currentAccount && (
            <textarea
              name="messageArea"
              placeholder="type here"
              id="content"
              value={tokenValue}
              onChange={(e) => setTokenValue(e.target.value)}
            />
          )}
          {parseInt(tokenValue, 10)}
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
      </WalletLayout>
    </Layout>
  );
}
