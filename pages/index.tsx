import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import RequireWalletLayout from "../components/layout/RequireWalletLayout";
import BasicLayout from "../components/layout/BasicLayout";
import { useWallet } from "../hooks/useWallet";
import Head from "next/head";

const Home: NextPage = () => {
  const { currentAccount, connectWallet } = useWallet();
  return (
    <BasicLayout home>
      <RequireWalletLayout
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <Head>
          <title>Messenger</title>
        </Head>
        <div className={styles.container}>
          <h2 className={styles.title}>Welcome to Messenger !</h2>
          <main className={styles.main}>
            <div className={styles.card}>
              <Link href="/message/SendMessagePage">
                <h2>send &rarr;</h2>
              </Link>
              <p>send messages and avax to other accounts</p>
            </div>

            <div className={styles.card}>
              <Link href="/message/ConfirmMessagePage">
                <h2>check &rarr;</h2>
              </Link>
              <p>Check messages from other accounts</p>
            </div>
          </main>
        </div>
      </RequireWalletLayout>
    </BasicLayout>
  );
};

export default Home;
