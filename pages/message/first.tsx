import Link from "next/link";

export default function First() {
  return (
    <div>
      <div>First Page !</div>
      <div>
        <Link href="/">
          <a>← Back to home</a>
        </Link>
      </div>
    </div>
  );
}
