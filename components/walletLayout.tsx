import Head from "next/head";
import styles from "./layout.module.css";
import ConnectWalletButton from "./connectWalletButton";
import { useWallet } from "../hooks/useWallet";

export const siteTitle = "Welcome to the Messenger";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentAccount, connectWallet } = useWallet();

  return (
    <div className={styles.container}>
      {currentAccount ? (
        <main>{children}</main>
      ) : (
        <ConnectWalletButton connectWallet={connectWallet} />
      )}
    </div>
  );
}
