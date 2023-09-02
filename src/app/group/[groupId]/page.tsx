"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { Button } from "@components/basic/button";
import { Spinner } from "@components/spinner";
import { useGroup } from "@lib/group/use-group";
import { GroupWithMembers } from "app/db/types";

interface ProjectPageProps {
  params: { groupId: string };
}

const GroupPageInner = ({ group }: { group: GroupWithMembers }) => {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">{group.name}</h1>
      <h3 className="text-lg font-bold">Members</h3>
      <div>
        {group.members.map((member) => (
          <div key={member.address}>
            <p>{member.address}</p>
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
