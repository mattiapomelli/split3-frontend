"use client";

// import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// import Link from "next/link";
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

  const membersCount = group.members.filter(
    (member) => member.status === "active",
  ).length;

  return (
    <div className="rounded-box mx-auto mt-8 flex max-w-[500px] flex-col items-center gap-8 bg-base-200 p-4 text-center">
      <p className="text-base-content-neutral">
        <Address address={group.owner as `0x${string}`} className="font-bold" />{" "}
        invited you to join
      </p>

      <div>
        <h1 className="mb-4 text-3xl font-bold">{group.name}</h1>
        <p>{membersCount} members</p>
      </div>

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
      {/* <Link href="/" tabIndex={-1}>
        <Button
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
          color="neutral"
          variant="outline"
          size="sm"
          className="mb-8"
        >
          Back{" "}
        </Button>
      </Link> */}
      {isLoading || !group ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <JoinGroupPageInner group={group} />
      )}
    </div>
  );
}
