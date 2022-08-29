import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Messenger !</h1>

        <div className={styles.grid}>
          <Link href="/message/first" className={styles.card}>
            <h2>first page &rarr;</h2>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
