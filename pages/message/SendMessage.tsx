import Layout from "../../components/layout";
import WalletLayout from "../../components/walletLayout";
import { useWallet } from "../../hooks/useWallet";

export default function SendMessage() {
  const { currentAccount } = useWallet();

  return (
    <Layout>
      <WalletLayout>
        <div>
          <div>First Page !</div>
          <div>wallet is {currentAccount}</div>
        </div>
      </WalletLayout>
    </Layout>
  );
}
