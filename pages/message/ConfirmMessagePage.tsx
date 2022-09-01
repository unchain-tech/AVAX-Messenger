import MessageCard from "../../components/card/MessageCard";
import BasicLayout from "../../components/layout/BasicLayout";
import RequireWalletLayout from "../../components/layout/RequireWalletLayout";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { useWallet } from "../../hooks/useWallet";
import { useEffect } from "react";

export default function ConfirmMessagePage() {
  const { currentAccount, connectWallet } = useWallet();
  const { ownMessages, mining, getOwnMessages, acceptMessage, denyMessage } =
    useMessengerContract({
      currentAccount: currentAccount,
    });

  useEffect(() => {
    getOwnMessages();
  }, [currentAccount]);

  return (
    <BasicLayout>
      <RequireWalletLayout
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <div>
          <div>Confirm Message Page !</div>
          <div>wallet is {currentAccount}</div>
          {mining && <div>mining...</div>}
          {ownMessages.map((message, index) => {
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
