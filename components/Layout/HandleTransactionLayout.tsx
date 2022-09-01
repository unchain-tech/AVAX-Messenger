import styles from "./BasicLayout.module.css";

type Props = {
  children: React.ReactNode;
  mining: boolean;
};

export default function HandleTransactionLayout({ children, mining }: Props) {
  return (
    <div className={styles.container}>
      {mining ? <div>mining...</div> : <main>{children}</main>}
    </div>
  );
}
