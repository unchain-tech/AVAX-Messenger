type Props = {
  statusCode: number;
};

export default function Error({ statusCode }: Props) {
  return <div>{statusCode}</div>;
}
