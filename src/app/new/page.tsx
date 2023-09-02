import { NewGroupForm } from "@components/new-group-form";

export const metadata = {
  title: "New Group",
};

export default function NewGroupPage() {
  return (
    <div className="mx-auto mt-10 w-full max-w-sm">
      <h1 className="mb-4 text-center text-3xl font-bold">New Group</h1>
      <NewGroupForm />
    </div>
  );
}
