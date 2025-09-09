import Link from "next/link";

export default function Home() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      <p className="mb-4">
        This demo shows JWT auth, Google OAuth, password reset and CRUD.
      </p>
      <ul className="space-y-2">
        <li>
          <Link href="/register">Register</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/profile">Profile (protected)</Link>
        </li>
        <li>
          <Link href="/items">Items CRUD</Link>
        </li>
      </ul>
    </section>
  );
}
