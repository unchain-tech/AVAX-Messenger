import styles from "./ConfirmMessageButton.module.css";

type Props = {
  name: string;
  onClick: () => void;
};

export default function ConfirmMessageButton({ name, onClick }: Props) {
  return (
    <button className={styles.item} onClick={onClick}>
      {name}
    </button>
  );
}
