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
    try {
      if (messengerContract) {
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
      } else {
        console.log("messenger contract doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage({ text, receiver, token }: SendMessageProps) {
    try {
      if (messengerContract) {
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
      } else {
        console.log("messenger contract doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptMessage({ index }: ConfirmMessageProps) {
    try {
      if (messengerContract) {
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
      } else {
        console.log("messenger contract doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function denyMessage({ index }: ConfirmMessageProps) {
    try {
      if (messengerContract) {
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
      } else {
        console.log("messenger contract doesn't exist!");
      }
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
      deposit: any,
      timestamp: any,
      text: any,
      isPending: any,
      sender: any,
      receiver: any
    ) => {
      console.log(
        "NewMessage",
        deposit,
        timestamp,
        text,
        isPending,
        sender,
        receiver
      );
      if ((receiver as string).toLocaleLowerCase() === currentAccount) {
        setOwnMessages((prevState) => [
          ...prevState,
          {
            deposit: deposit.toString(),
            timestamp: new Date((timestamp as any) * 1000), //TODO: any
            text: text,
            isPending: isPending,
            sender: sender.toString(),
            receiver: receiver.toString(),
          },
        ]);
      }
    };

    const onMessageConfirmed = (receiver: any, index: any) => {
      console.log("MessageConfirmed", receiver, index.toNumber());
      if (receiver.toLocaleLowerCase() === currentAccount) {
        setOwnMessages((prevState) => {
          prevState[index.toNumber()].isPending = false;
          return [...prevState];
        });
      }
    };

    /* NewMessageイベントがコントラクトから発信されたときに、情報を受け取ります */
    if (messengerContract) {
      messengerContract.on("NewMessage", onNewMessage);
      messengerContract.on("MessageConfirmed", onMessageConfirmed);
    }

    /*メモリリークを防ぐために、NewMessageのイベントを解除します*/
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
