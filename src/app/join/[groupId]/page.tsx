"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { Spinner } from "@components/spinner";
import { useGroup } from "@lib/group/use-group";
import { useJoinGroup } from "@lib/group/use-join-group";
import { GroupWithMembers } from "app/db/types";

interface ProjectPageProps {
  params: { groupId: string };
}

const JoinGroupPageInner = ({ group }: { group: GroupWithMembers }) => {
  const router = useRouter();
  const { mutate: joinGroup, isLoading: isLoading } = useJoinGroup({
    onSuccess() {
      router.push(`/group/${group.id}`);
    },
  });

  const onJoinGroup = async () => {
    joinGroup({
      groupId: group.id,
    });
  };

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">
        <Address address={group.owner as `0x${string}`} className="font-bold" />{" "}
        invited you to join {group.name}
      </h1>
      <Button onClick={onJoinGroup} loading={isLoading} disabled={isLoading}>
        Join
      </Button>
    </div>
  );
};

export default function JoinGroupPage({ params }: ProjectPageProps) {
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
      {isLoading || !group ? <Spinner /> : <JoinGroupPageInner group={group} />}
    </div>
  );
}
