import Head from "next/head";
import styles from "./layout.module.css";
import { useEffect, useState } from "react";
import LinkWallet from "./account";

export const siteTitle = "Welcome to the Messenger";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Messenger dApp" />
      </Head>
      {currentAccount ? (
        <main>{children}</main>
      ) : (
        <LinkWallet setCurrentAccount={setCurrentAccount} />
      )}
    </div>
  );
}
