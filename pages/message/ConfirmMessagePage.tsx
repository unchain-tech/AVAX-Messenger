import PageLayout from "../../components/PageLayout";
import UseWalletLayout from "../../components/UseWalletLayout";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { useWallet } from "../../hooks/useWallet";

// numberでいいのか
export type Message = {
  deposit: number;
  timestamp: Date;
  text: string;
  isPending: boolean;
  sender: number;
  receiver: number;
};

export default function ConfirmMessagePage() {
  const { currentAccount, connectWallet } = useWallet();
  const { ownMessages } = useMessengerContract();

  return (
    <PageLayout>
      <UseWalletLayout
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div>
          <div>Confirm Message Page !</div>
          <div>wallet is {currentAccount}</div>
          {/* メッセージの一覧表示 */}
          {ownMessages.map((message, index) => {
            return (
              <div key={index}>
                <div>index: {index}</div>
                <div>deposit: {message.deposit}</div>
                <div>timestamp: {message.timestamp.toDateString()}</div>
                <div>text: {message.text}</div>
                <div>isPending: {message.isPending}</div>
                <div>sender: {message.sender}</div>
                <div>receiver: {message.receiver}</div>
              </div>
            );
          })}
        </div>
      </UseWalletLayout>
    </PageLayout>
  );
}
