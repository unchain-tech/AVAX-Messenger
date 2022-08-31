type Props = {
  connectWallet: () => void;
};

export default function ConnectWalletButton({ connectWallet }: Props) {
  return (
    <div>
      <button className="waveButton" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
}
