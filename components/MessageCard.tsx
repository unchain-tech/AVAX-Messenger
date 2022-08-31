import { Message } from "../pages/message/ConfirmMessagePage";

type Props = {
  message: Message;
  index: number;
};

export default function MessageCard({ message, index }: Props) {
  return (
    <div>
      <div>index: {index}</div>
      <div>deposit: {message.deposit}</div>
      <div>timestamp: {message.timestamp.toDateString()}</div>
      <div>text: {message.text}</div>
      {message.isPending && <button>accept or deny</button>}
      <div>sender: {message.sender}</div>
      <div>receiver: {message.receiver}</div>
    </div>
  );
}
