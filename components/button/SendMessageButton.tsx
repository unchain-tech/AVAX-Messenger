type Props = {
  name: string;
  onClick: () => void;
};

export default function SendMessageButton({ name, onClick }: Props) {
  return (
    <button className="SendMessageButton" onClick={onClick}>
      {name}
    </button>
  );
}
