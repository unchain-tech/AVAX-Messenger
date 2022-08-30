import styles from "./layout.module.css";
import ConnectWalletButton from "./ConnectWalletButton";

type Props = {
  children: React.ReactNode;
  currentAccount: string | undefined;
  connectWallet: () => void;
};

export default function UseWalletLayout({
  children,
  currentAccount,
  connectWallet,
}: Props) {
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
