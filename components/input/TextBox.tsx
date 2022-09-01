type Props = {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextBox({ name, onChange }: Props) {
  return (
    <div>
      <div>{name}</div>
      <textarea
        name={name}
        placeholder="type here"
        id="text box"
        onChange={onChange}
      />
    </div>
  );
}
