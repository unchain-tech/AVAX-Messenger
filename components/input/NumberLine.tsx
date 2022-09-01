type Props = {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function NumberLine({ name, onChange }: Props) {
  return (
    <div>
      <div>{name}</div>
      <input
        type="number"
        name={name}
        placeholder="type here"
        id="text line"
        onChange={onChange}
      />
    </div>
  );
}
