import { ethers } from "ethers";
import { Message } from "../../hooks/useMessengerContract";

type Props = {
  message: Message;
  index: number;
  onClickAccept: () => void;
  onClickDeny: () => void;
};

export default function MessageCard({
  message,
  index,
  onClickAccept,
  onClickDeny,
}: Props) {
  const depositInEther = ethers.utils.formatEther(message.depositInWei);

  return (
    <div>
      <div>index: {index}</div>
      <div>depositInWei: {depositInEther}</div>
      <div>timestamp: {message.timestamp.toDateString()}</div>
      <div>text: {message.text}</div>
      {message.isPending && (
        <div>
          <button onClick={onClickAccept}>accept</button>
          <button onClick={onClickDeny}>deny</button>
        </div>
      )}
      <div>sender: {message.sender}</div>
      <div>receiver: {message.receiver}</div>
    </div>
  );
}
