import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import abi from "../utils/Messenger.json";

const contractAddress = "0xa725B1bE9c6b43A66962B7047508AcfaFD2C76aC";
const contractABI = abi.abi;

export type Message = {
  depositInWei: BigNumber;
  timestamp: Date;
  text: string;
  isPending: boolean;
  sender: string;
  receiver: string;
};

type PropsSendMessage = {
  text: string;
  receiver: string;
  tokenInEther: string;
};

export type SendMessage = (props: PropsSendMessage) => void;

type PropsConfirmMessage = {
  index: number;
};

type ReturnUseMessengerContract = {
  mining: boolean;
  ownMessages: Message[];
  messengerContract: ethers.Contract | undefined;
  getOwnMessages: () => void;
  sendMessage: (props: PropsSendMessage) => void;
  acceptMessage: (props: PropsConfirmMessage) => void;
  denyMessage: (props: PropsConfirmMessage) => void;
};

type PropsUseMessengerContract = {
  currentAccount: string | undefined;
};

export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
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
      const messagesCleaned: Message[] = OwnMessages.map((message: any) => {
        return {
          depositInWei: message.depositInWei,
          timestamp: new Date(message.timestamp.toNumber() * 1000),
          text: message.text,
          isPending: message.isPending,
          sender: message.sender.toString(),
          receiver: message.receiver.toString(),
        };
      });
      setOwnMessages(messagesCleaned);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage({
    text,
    receiver,
    tokenInEther,
  }: PropsSendMessage) {
    if (!messengerContract) return;
    try {
      const tokenInWei = ethers.utils.parseEther(tokenInEther);
      console.log(
        "call post with receiver:[%s], token:[%s]",
        receiver,
        tokenInWei.toString()
      );
      const postTxn = await messengerContract.post(text, receiver, {
        gasLimit: 300000,
        value: tokenInWei,
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

  async function acceptMessage({ index }: PropsConfirmMessage) {
    if (!messengerContract) return;
    try {
      console.log("call accept with index [%d]", index);
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

  async function denyMessage({ index }: PropsConfirmMessage) {
    if (!messengerContract) return;
    try {
      console.log("call deny with index [%d]", index);
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
      depositInWei: BigNumber,
      timestamp: BigNumber,
      text: string,
      isPending: boolean,
      sender: BigNumber,
      receiver: BigNumber
    ) => {
      console.log("NewMessage from %s", sender.toString());
      if (receiver.toString().toLocaleLowerCase() === currentAccount) {
        setOwnMessages((prevState) => [
          ...prevState,
          {
            depositInWei: depositInWei,
            timestamp: new Date(timestamp.toNumber() * 1000),
            text: text,
            isPending: isPending,
            sender: sender.toString(),
            receiver: receiver.toString(),
          },
        ]);
      }
    };

    // MessageConfirmedのイベントリスナ
    const onMessageConfirmed = (receiver: BigNumber, index: BigNumber) => {
      console.log(
        "MessageConfirmed index:[%d] receiver: [%s]",
        index.toNumber(),
        receiver.toString()
      );
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
  }, [currentAccount, messengerContract]);

  return {
    mining,
    ownMessages,
    messengerContract,
    getOwnMessages,
    sendMessage,
    acceptMessage,
    denyMessage,
  };
};
