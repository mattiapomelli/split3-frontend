"use client";

import { UserGroupIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import Link from "next/link";

import { GroupWithMembers } from "app/db/types";

interface ProjectCardProps {
  group: GroupWithMembers;
  className?: string;
}

export const GroupCard = ({ group, className }: ProjectCardProps) => {
  const membersCount = group.members.filter(
    (member) => member.status === "active",
  ).length;

  return (
    <Link
      href={`/group/${group.id}`}
      className={cx(
        "flex flex-col justify-between gap-6",
        "rounded-box border border-base-300 bg-base-100 p-6 hover:shadow-[0_4px_6px_hsl(var(--bc)/0.06)]",
        className,
      )}
    >
      <div>
        <div className="mb-3 flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5" />
          <h2 className="font-semibold">{group.name}</h2>
        </div>
        <p className="text-base-content-neutral">{membersCount} members</p>
      </div>
    </Link>
  );
};
