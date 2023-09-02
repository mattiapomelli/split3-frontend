import Link from "next/link";

import { NewGroupForm } from "@components/new-group-form";

export const metadata = {
  title: "Login",
};

export default function NewGroupPage() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="mb-4 text-center text-3xl font-bold">New Group</h1>
      <NewGroupForm />
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
