export default function LinkWallet({
  setCurrentAccount,
}: {
  setCurrentAccount: any;
}) {
  const connectWallet = async () => {
    try {
      // ユーザーが認証可能なウォレットアドレスを持っているか確認
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="waveButton" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
}
