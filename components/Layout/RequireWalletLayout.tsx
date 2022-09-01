import ConnectWalletButton from "../button/ConnectWalletButton";

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
        <main>{children}</main>
      ) : (
        <ConnectWalletButton connectWallet={connectWallet} />
      )}
    </div>
  );
}
