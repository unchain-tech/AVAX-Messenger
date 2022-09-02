import Layout from "../../components/layout/Layout";
import RequireWallet from "../../components/layout/RequireWallet";
import { useWallet } from "../../hooks/useWallet";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import Head from "next/head";
import SendMessageForm from "../../components/form/SendMessageForm";

export default function SendMessagePage() {
  const { currentAccount, connectWallet } = useWallet();
  const { mining, sendMessage } = useMessengerContract({
    currentAccount: currentAccount,
  });

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <Head>
          <title>Messenger</title>
        </Head>
        {mining ? (
          <div>mining...</div>
        ) : (
          <SendMessageForm sendMessage={sendMessage} />
        )}
      </RequireWallet>
    </Layout>
  );
}
