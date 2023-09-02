"use client";

import { Button } from "@components/basic/button";
import { useCreateGroup } from "@lib/group/use-create-group";
import { useGroupContract } from "@lib/group/use-group-contract";

export default function Home() {
  const groupContract = useGroupContract();
  const { mutate: createGroup, isLoading } = useCreateGroup();

  console.log("Group contract", groupContract);

  return (
    <div>
      <Button
        onClick={() => createGroup()}
        disabled={isLoading}
        loading={isLoading}
      >
        Create group
      </Button>
    </div>
  );
}
