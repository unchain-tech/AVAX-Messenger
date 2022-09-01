type Props = {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextLine({ name, onChange }: Props) {
  return (
    <div>
      <div>{name}</div>
      <input
        name={name}
        placeholder="type here"
        id="text line"
        onChange={onChange}
      />
    </div>
  );
}
