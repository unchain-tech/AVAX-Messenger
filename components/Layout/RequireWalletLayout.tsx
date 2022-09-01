import ConnectWalletButton from "../button/ConnectWalletButton";
import styles from "./RequireWalletLayout.module.css";

type Props = {
  children: React.ReactNode;
  currentAccount: string | undefined;
  connectWallet: () => void;
};

export default function RequireWalletLayout({
  children,
  currentAccount,
  connectWallet,
}: Props) {
  return (
    <div>
      {currentAccount ? (
        <div>
          <h3>wallet address connecting:</h3>
          <span>{currentAccount}</span>
          <main>{children}</main>
        </div>
      ) : (
        <ConnectWalletButton connectWallet={connectWallet} />
      )}
    </div>
  );
}
