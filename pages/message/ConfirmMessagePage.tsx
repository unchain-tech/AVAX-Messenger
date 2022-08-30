import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import WalletLayout from "../../components/WalletLayout";
import { useWallet } from "../../hooks/useWallet";
import { BigNumber, ethers } from "ethers";
import abi from "../../utils/Messenger.json";

const contractAddress = "0xC3c90d7093712840c62ef806B1a026377A293286";
const contractABI = abi.abi;

type Props = {
  setter: (messages: Message[]) => void;
};

// numberでいいのか
type contractMessage = {
  deposit: BigNumber;
  timestamp: BigNumber;
  text: string;
  isPending: boolean;
  sender: BigNumber;
  receiver: BigNumber;
};

async function GetMessages({ setter }: Props) {
  alert("confirm");
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
      const messages = await MessengerContract.getOwnMessages({
        gasLimit: 300000,
      });
      const messagesCleaned: Message[] = messages.map(
        (message: contractMessage) => {
          return {
            deposit: message.deposit.toString(),
            timestamp: message.timestamp.toString(), //timestampの表示方法
            text: message.text,
            isPending: message.isPending,
            sender: message.sender.toString(),
            receiver: message.receiver.toString(),
          };
        }
      );
      setter(messagesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
}

// numberでいいのか
type Message = {
  deposit: number;
  timestamp: number;
  text: string;
  isPending: boolean;
  sender: number;
  receiver: number;
};

export default function ConfirmMessagePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentAccount } = useWallet();

  useEffect(() => {
    GetMessages({
      setter: (messages: Message[]) => {
        setMessages(messages);
      },
    });
  }, []);

  return (
    <Layout>
      <WalletLayout>
        <div>
          <div>Confirm Message Page !</div>
          <div>wallet is {currentAccount}</div>
          {/* メッセージの一覧表示 */}
          {currentAccount &&
            messages.map((message, index) => {
              return (
                <div key={index}>
                  <div>index: {index}</div>
                  <div>deposit: {message.deposit}</div>
                  <div>timestamp: {message.timestamp}</div>
                  <div>text: {message.text}</div>
                  <div>isPending: {message.isPending}</div>
                  <div>sender: {message.sender}</div>
                  <div>receiver: {message.receiver}</div>
                </div>
              );
            })}
        </div>
      </WalletLayout>
    </Layout>
  );
}
