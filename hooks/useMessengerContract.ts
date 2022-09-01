import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import abi from "../utils/Messenger.json";

const contractAddress = "0x75e1cF6cD73659A3dd17a303DC5087EDC9Cc391c";
const contractABI = abi.abi;

export type Message = {
  deposit: BigNumber;
  timestamp: Date;
  text: string;
  isPending: boolean;
  sender: string;
  receiver: string;
};

type MessageFromContract = {
  deposit: BigNumber;
  timestamp: BigNumber;
  text: string;
  isPending: boolean;
  sender: BigNumber;
  receiver: BigNumber;
};

type SendMessageProps = {
  text: string;
  receiver: string;
  token: BigNumber;
};

type ConfirmMessageProps = {
  index: number;
};

type ReturnUseMessengerContract = {
  mining: boolean;
  ownMessages: Message[];
  getOwnMessages: () => void;
  sendMessage: (props: SendMessageProps) => void;
  acceptMessage: (props: ConfirmMessageProps) => void;
  denyMessage: (props: ConfirmMessageProps) => void;
};

type Props = {
  currentAccount: string | undefined;
};

export const useMessengerContract = ({
  currentAccount,
}: Props): ReturnUseMessengerContract => {
  const [mining, setMining] = useState<boolean>(false);
  const [messengerContract, setMessengerContract] = useState<ethers.Contract>();
  const [ownMessages, setOwnMessages] = useState<Message[]>([]);

  function getMessengerContract() {
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
        setMessengerContract(MessengerContract);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getOwnMessages() {
    if (!messengerContract) return;
    try {
      const OwnMessages = await messengerContract.getOwnMessages({
        gasLimit: 300000,
      });
      const messagesCleaned: Message[] = OwnMessages.map(
        (message: MessageFromContract) => {
          return {
            deposit: message.deposit,
            timestamp: new Date(message.timestamp.toNumber() * 1000),
            text: message.text,
            isPending: message.isPending,
            sender: message.sender.toString(),
            receiver: message.receiver.toString(),
          };
        }
      );
      setOwnMessages(messagesCleaned);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage({ text, receiver, token }: SendMessageProps) {
    if (!messengerContract) return;
    try {
      console.log(
        "call post with receiver:[%s], token:[%s]",
        receiver,
        token.toString()
      );
      // MAX_ETH = gas_fee * gasLimit
      const postTxn = await messengerContract.post(text, receiver, {
        gasLimit: 300000,
        value: token, //TODO: check in wei
      });
      console.log("Mining...", postTxn.hash);
      setMining(true);
      await postTxn.wait();
      console.log("Mined -- ", postTxn.hash);
      setMining(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptMessage({ index }: ConfirmMessageProps) {
    if (!messengerContract) return;
    try {
      console.log("call accept with index [%d]", index);
      // MAX_ETH = gas_fee * gasLimit
      const postTxn = await messengerContract.accept(index, {
        gasLimit: 300000,
      });
      console.log("Mining...", postTxn.hash);
      setMining(true);
      await postTxn.wait();
      console.log("Mined -- ", postTxn.hash);
      setMining(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function denyMessage({ index }: ConfirmMessageProps) {
    if (!messengerContract) return;
    try {
      console.log("call deny with index [%d]", index);
      // MAX_ETH = gas_fee * gasLimit
      const postTxn = await messengerContract.deny(index, {
        gasLimit: 300000,
      });
      console.log("Mining...", postTxn.hash);
      setMining(true);
      await postTxn.wait();
      console.log("Mined -- ", postTxn.hash);
      setMining(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMessengerContract();
  }, [currentAccount]);

  useEffect(() => {
    // NewMessageのイベントリスナ
    const onNewMessage = (
      deposit: BigNumber,
      timestamp: BigNumber,
      text: string,
      isPending: boolean,
      sender: BigNumber,
      receiver: BigNumber
    ) => {
      console.log("NewMessage");
      if (receiver.toString().toLocaleLowerCase() === currentAccount) {
        setOwnMessages((prevState) => [
          ...prevState,
          {
            deposit: deposit,
            timestamp: new Date(timestamp.toNumber() * 1000),
            text: text,
            isPending: isPending,
            sender: sender.toString(),
            receiver: receiver.toString(),
          },
        ]);
      }
    };

    const onMessageConfirmed = (receiver: BigNumber, index: BigNumber) => {
      console.log("MessageConfirmed", receiver, index.toNumber());
      if (receiver.toString().toLocaleLowerCase() === currentAccount) {
        setOwnMessages((prevState) => {
          prevState[index.toNumber()].isPending = false;
          return [...prevState];
        });
      }
    };

    /* イベントリスナーの登録をします */
    if (messengerContract) {
      messengerContract.on("NewMessage", onNewMessage);
      messengerContract.on("MessageConfirmed", onMessageConfirmed);
    }

    /* イベントリスナーの登録を解除します */
    return () => {
      if (messengerContract) {
        messengerContract.off("NewMessage", onNewMessage);
        messengerContract.off("MessageConfirmed", onMessageConfirmed);
      }
    };
  }, [messengerContract]);

  return {
    mining,
    ownMessages,
    getOwnMessages,
    sendMessage,
    acceptMessage,
    denyMessage,
  };
};
