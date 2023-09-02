"use client";

import { GroupCard } from "@components/groups/group-card";
import { useGroups } from "@lib/group/use-groups";
import { useInvitedGroups } from "@lib/group/use-invited-groups";

export default function Home() {
  const { data: groups } = useGroups();
  const { data: invitedGroups } = useInvitedGroups();

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">Groups</h3>
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} className="flex-1" />
        ))}
      </div>
      <h3 className="mb-4 mt-8 text-2xl font-bold">Invitations</h3>
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {invitedGroups?.map((group) => (
          <GroupCard key={group.id} group={group} className="flex-1" />
        ))}
      </div>
    </div>
  );
}
