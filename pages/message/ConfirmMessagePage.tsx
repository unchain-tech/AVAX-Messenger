import MessageCard from "../../components/MessageCard";
import BasicLayout from "../../components/Layout/BasicLayout";
import RequireWalletLayout from "../../components/Layout/RequireWalletLayout";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { useWallet } from "../../hooks/useWallet";

// TODO:numberでいいのか
export type Message = {
  deposit: number;
  timestamp: Date;
  text: string;
  isPending: boolean;
  sender: number;
  receiver: number;
};

//TODO: callbackとか使う

export default function ConfirmMessagePage() {
  const { currentAccount, connectWallet } = useWallet();
  const { ownMessages, acceptMessage, denyMessage } = useMessengerContract({
    currentAccount: currentAccount,
  });

  return (
    <BasicLayout>
      <RequireWalletLayout
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div>
          <div>Confirm Message Page !</div>
          <div>wallet is {currentAccount}</div>
          {/* メッセージの一覧表示 */}
          {currentAccount &&
            ownMessages.map((message, index) => {
              return (
                <div key={index}>
                  <MessageCard
                    message={message}
                    index={index}
                    onClickAccept={() => {
                      acceptMessage({ index });
                    }}
                    onClickDeny={() => denyMessage({ index })}
                  />
                </div>
              );
            })}
        </div>
      </RequireWalletLayout>
    </BasicLayout>
  );
}
