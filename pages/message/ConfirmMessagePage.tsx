import MessageCard from "../../components/card/MessageCard";
import BasicLayout from "../../components/layout/BasicLayout";
import RequireWalletLayout from "../../components/layout/RequireWalletLayout";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { useWallet } from "../../hooks/useWallet";
import { useEffect } from "react";
import Head from "next/head";

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
        <Head>
          <title>Messenger</title>
        </Head>
        {mining && <div>mining...</div>}
        {ownMessages.map((message, index) => {
          return (
            <div key={index}>
              <MessageCard
                message={message}
                onClickAccept={() => {
                  acceptMessage({ index });
                }}
                onClickDeny={() => denyMessage({ index })}
              />
            </div>
          );
        })}
      </RequireWalletLayout>
    </BasicLayout>
  );
}
