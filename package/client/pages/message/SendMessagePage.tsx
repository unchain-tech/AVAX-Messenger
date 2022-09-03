import Layout from "../../components/layout/Layout";
import RequireWallet from "../../components/layout/RequireWallet";
import { useWallet } from "../../hooks/useWallet";
import { useMessengerContract } from "../../hooks/useMessengerContract";
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
        {mining ? (
          <div>mining...</div>
        ) : (
          <SendMessageForm sendMessage={sendMessage} />
        )}
      </RequireWallet>
    </Layout>
  );
}
