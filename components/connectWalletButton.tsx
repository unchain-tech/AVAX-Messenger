type connectWalletFunc = () => void;

export default function ConnectWalletButton({
  connectWallet,
}: {
  connectWallet: connectWalletFunc;
}) {
  return (
    <div>
      <button className="waveButton" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
}
