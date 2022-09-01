import Head from "next/head";
import styles from "./BasicLayout.module.css";
import Link from "next/link";

export const siteTitle = "Messenger";

type Props = {
  children: React.ReactNode;
  home?: boolean;
};

export default function BasicLayout({ children, home }: Props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
