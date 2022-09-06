import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import abi from "../utils/Messenger.json";
import { getEthereum } from "../utils/ethereum";
import { Messenger as MessengerType } from "../typechain-types";

const contractAddress = "0x226fc34e54cdc0a27C4E6B93a7e6D6d5c38dc4B4";
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

type ReturnUseMessengerContract = {
  processing: boolean;
  ownMessages: Message[];
  messengerContract: MessengerType | undefined;
  owner: string | undefined;
  numOfPendingLimits: BigNumber | undefined;
  getOwnMessages: () => void;
  sendMessage: (props: PropsSendMessage) => void;
  acceptMessage: (index: BigNumber) => void;
  denyMessage: (index: BigNumber) => void;
  getOwner: () => void;
  getNumOfPendingLimits: () => void;
  changeNumOfPendingLimits: (limits: BigNumber) => void;
};

type PropsUseMessengerContract = {
  currentAccount: string | undefined;
};

export const useMessengerContract = ({
  currentAccount,
}: PropsUseMessengerContract): ReturnUseMessengerContract => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [messengerContract, setMessengerContract] = useState<MessengerType>();
  const [ownMessages, setOwnMessages] = useState<Message[]>([]);
  const [owner, setOwner] = useState<string>();
  const [numOfPendingLimits, setNumOfPendingLimits] = useState<BigNumber>();
  const ethereum = getEthereum();

  function getMessengerContract() {
    try {
      if (ethereum) {
        // @ts-ignore: ethereum as ethers.providers.ExternalProvider
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const MessengerContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        ) as MessengerType;
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
      const OwnMessages = await messengerContract.getOwnMessages();
      const messagesCleaned: Message[] = OwnMessages.map((message) => {
        return {
          depositInWei: message.depositInWei,
          timestamp: new Date(message.timestamp.toNumber() * 1000),
          text: message.text,
          isPending: message.isPending,
          sender: message.sender,
          receiver: message.receiver,
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
      const txn = await messengerContract.post(text, receiver, {
        gasLimit: 300000,
        value: tokenInWei,
      });
      console.log("Processing...", txn.hash);
      setProcessing(true);
      await txn.wait();
      console.log("Mined -- ", txn.hash);
      setProcessing(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptMessage(index: BigNumber) {
    if (!messengerContract) return;
    try {
      console.log("call accept with index [%d]", index);
      const txn = await messengerContract.accept(index, {
        gasLimit: 300000,
      });
      console.log("Processing...", txn.hash);
      setProcessing(true);
      await txn.wait();
      console.log("Mined -- ", txn.hash);
      setProcessing(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function denyMessage(index: BigNumber) {
    if (!messengerContract) return;
    try {
      console.log("call deny with index [%d]", index);
      const txn = await messengerContract.deny(index, {
        gasLimit: 300000,
      });
      console.log("Processing...", txn.hash);
      setProcessing(true);
      await txn.wait();
      console.log("Mined -- ", txn.hash);
      setProcessing(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getOwner() {
    if (!messengerContract) return;
    try {
      console.log("call getter of owner");
      const owner = await messengerContract.owner();
      setOwner(owner.toLocaleLowerCase());
    } catch (error) {
      console.log(error);
    }
  }

  async function getNumOfPendingLimits() {
    if (!messengerContract) return;
    try {
      console.log("call getter of numOfPendingLimits");
      const limits = await messengerContract.numOfPendingLimits();
      setNumOfPendingLimits(limits);
    } catch (error) {
      console.log(error);
    }
  }

  async function changeNumOfPendingLimits(limits: BigNumber) {
    if (!messengerContract) return;
    try {
      console.log("call changeNumOfPendingLimits with [%d]", limits.toNumber());
      const txn = await messengerContract.changeNumOfPendingLimits(limits, {
        gasLimit: 300000,
      });
      console.log("Processing...", txn.hash);
      setProcessing(true);
      await txn.wait();
      console.log("Mined -- ", txn.hash);
      setProcessing(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMessengerContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, ethereum]);

  useEffect(() => {
    // NewMessageのイベントリスナ
    const onNewMessage = (
      depositInWei: BigNumber,
      timestamp: BigNumber,
      text: string,
      isPending: boolean,
      sender: BigNumber, // stringではログの出力がされずイベントリスナが動いていないと判断
      receiver: BigNumber // stringではログの出力がされずイベントリスナが動いていないと判断
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

    // NumOfPendingLimitsChangedのイベントリスナ
    const onNumOfPendingLimitsChanged = (limitsChanged: BigNumber) => {
      console.log(
        "NumOfPendingLimitsChanged limits:[%d]",
        limitsChanged.toNumber()
      );
      setNumOfPendingLimits(limitsChanged);
    };

    /* イベントリスナーの登録をします */
    if (messengerContract) {
      messengerContract.on("NewMessage", onNewMessage);
      messengerContract.on("MessageConfirmed", onMessageConfirmed);
      messengerContract.on(
        "NumOfPendingLimitsChanged",
        onNumOfPendingLimitsChanged
      );
    }

    /* イベントリスナーの登録を解除します */
    return () => {
      if (messengerContract) {
        messengerContract.off("NewMessage", onNewMessage);
        messengerContract.off("MessageConfirmed", onMessageConfirmed);
        messengerContract.off(
          "NumOfPendingLimitsChanged",
          onNumOfPendingLimitsChanged
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messengerContract]);

  return {
    processing,
    ownMessages,
    messengerContract,
    owner,
    numOfPendingLimits,
    getOwnMessages,
    sendMessage,
    acceptMessage,
    denyMessage,
    getOwner,
    getNumOfPendingLimits,
    changeNumOfPendingLimits,
  };
};
