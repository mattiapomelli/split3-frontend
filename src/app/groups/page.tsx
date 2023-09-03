"use client";

import Link from "next/link";

import { Button } from "@components/basic/button";
import { GroupCard } from "@components/groups/group-card";
import { Spinner } from "@components/spinner";
import { useGroups } from "@lib/group/use-groups";
import { useInvitedGroups } from "@lib/group/use-invited-groups";

export default function Home() {
  const { data: groups, isLoading } = useGroups();
  const { data: invitedGroups, isLoading: isLoadingInvited } =
    useInvitedGroups();

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-2xl font-bold">Groups</h3>
        <Link href={"/new"}>
          <Button>New Group</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-5 w-5" />
        </div>
      ) : (
        <>
          {!groups?.length && (
            <div className="rounded-box mt-6 border border-base-300 py-14 text-center">
              No groups yet
            </div>
          )}
          <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {groups?.map((group) => (
              <GroupCard key={group.id} group={group} className="flex-1" />
            ))}
          </div>
        </>
      )}

      <h3 className="mt-8 text-2xl font-bold">Invitations</h3>
      {isLoadingInvited ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-5 w-5" />
        </div>
      ) : (
        <>
          {!invitedGroups?.length && (
            <div className="rounded-box mt-6 border border-base-300 py-14 text-center">
              No invitations yet
            </div>
          )}
          <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {invitedGroups?.map((group) => (
              <GroupCard key={group.id} group={group} className="flex-1" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
