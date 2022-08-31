import { Message } from "../pages/message/ConfirmMessagePage";

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
  return (
    <div>
      <div>index: {index}</div>
      <div>deposit: {message.deposit}</div>
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
