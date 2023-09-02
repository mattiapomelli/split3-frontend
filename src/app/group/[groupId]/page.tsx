"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { Button } from "@components/basic/button";
import { CopyButton } from "@components/copy-button";
import { Spinner } from "@components/spinner";
import { useGroup } from "@lib/group/use-group";
import { GroupWithMembers } from "app/db/types";

interface ProjectPageProps {
  params: { groupId: string };
}

const GroupPageInner = ({ group }: { group: GroupWithMembers }) => {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="mb-4 text-3xl font-bold">{group.name}</h1>
        <CopyButton text={`http://localhost:3000/join/${group.id}`}>
          Copy Invite Link
        </CopyButton>
      </div>

      <h3 className="text-lg font-bold">Members</h3>
      <div>
        {group.members.map((member) => (
          <div key={member.user_address}>
            <p>{member.user_address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GroupPage({ params }: ProjectPageProps) {
  const { data: group, isLoading } = useGroup({
    groupId: Number(params.groupId),
  });

  return (
    <div>
      <Link href="/" tabIndex={-1}>
        <Button
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
          color="neutral"
          variant="outline"
          size="sm"
          className="mb-8"
        >
          Back{" "}
        </Button>
      </Link>
      {isLoading || !group ? <Spinner /> : <GroupPageInner group={group} />}
    </div>
  );
}
