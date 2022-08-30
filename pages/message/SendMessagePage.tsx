import { useState } from "react";
import Layout from "../../components/layout";
import WalletLayout from "../../components/walletLayout";
import { useWallet } from "../../hooks/useWallet";

function SendMessage() {
  alert("send");
}

export default function SendMessagePage() {
  const [textValue, setTextValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const { currentAccount } = useWallet();

  return (
    <Layout>
      <WalletLayout>
        <div>
          <div>First Page !</div>
          <div>wallet is {currentAccount}</div>
          {/* 投稿ボックスを実装*/}
          {currentAccount && (
            <textarea
              name="messageArea"
              placeholder="type here"
              id="content"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
          )}
          {textValue}
          {currentAccount && (
            <textarea
              name="messageArea"
              placeholder="type here"
              id="content"
              value={tokenValue}
              onChange={(e) => setTokenValue(e.target.value)}
            />
          )}
          {parseInt(tokenValue, 10)}
          {/* sendボタンにsend関数を連動 */}
          {currentAccount && (
            <button className="postButton" onClick={SendMessage}>
              send
            </button>
          )}
        </div>
      </WalletLayout>
    </Layout>
  );
}

//const post = async () => {
//  try {
//    const { ethereum } = window;
//    if (ethereum) {
//      const provider = new ethers.providers.Web3Provider(ethereum);
//      const signer = provider.getSigner();
//      const snsPortalContract = new ethers.Contract(
//        contractAddress,
//        contractABI,
//        signer
//      );
//      // 予期せぬ処理ブロックなどでガス量が無理にならないための上限を設定
//      // MAX_ETH = gas_fee * gasLimit
//      const postTxn = await snsPortalContract.post(postValue, {
//        gasLimit: 300000,
//      });
//      console.log("Mining...", postTxn.hash);
//      await postTxn.wait();
//      console.log("Mined -- ", postTxn.hash);
//    } else {
//      console.log("Ethereum object doesn't exist!");
//    }
//  } catch (error) {
//    console.log(error);
//  }
//};
