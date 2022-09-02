import MessageCard from "../../components/card/MessageCard";
import Layout from "../../components/layout/Layout";
import RequireWallet from "../../components/layout/RequireWallet";
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
    <Layout>
      <RequireWallet
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
      </RequireWallet>
    </Layout>
  );
}
