import Layout from "../../components/layout";
import WalletLayout from "../../components/walletLayout";
import { useWallet } from "../../hooks/useWallet";

// junさんのやつみたいにlibからcurrentaccount取ってくる

export default function First() {
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
