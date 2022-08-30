import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../utils/Messenger.json";

const contractAddress = "0xC3c90d7093712840c62ef806B1a026377A293286";
const contractABI = abi.abi;

type sendMessengerProps = {
  text: string;
  receiver: string;
  token: number; // numberでいいのかわからん！
};

type ReturnUseMessengerContract = {
  mining: boolean;
  sendMessage: (props: sendMessengerProps) => void;
};

export const useMessengerContract = (): ReturnUseMessengerContract => {
  const [mining, setMining] = useState<boolean>(false);
  const [messengerContract, setMessengerContract] = useState<ethers.Contract>();

  function getMessageContract() {
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

  async function sendMessage({ text, receiver, token }: sendMessengerProps) {
    try {
      if (messengerContract) {
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
        console.log("messenger doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMessageContract();
  }, []);

  return { mining, sendMessage };
};
