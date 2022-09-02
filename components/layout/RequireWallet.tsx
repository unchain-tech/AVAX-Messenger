import ConnectWalletButton from "../button/ConnectWalletButton";
import styles from "./RequireWallet.module.css";

type Props = {
  children: React.ReactNode;
  currentAccount: string | undefined;
  connectWallet: () => void;
};

export default function RequireWallet({
  children,
  currentAccount,
  connectWallet,
}: Props) {
  return (
    <div>
      {currentAccount ? (
        <div>
          <div className={styles.wallet}>
            <p className={styles.title}>Your connecting address: </p>
            <p>{currentAccount}</p>
          </div>
          <main>{children}</main>
        </div>
      ) : (
        <ConnectWalletButton connectWallet={connectWallet} />
      )}
    </div>
  );
}
