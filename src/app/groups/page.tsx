"use client";

import { useAccount } from "wagmi";

import { useGroups } from "@lib/group/use-groups";

export default function Home() {
  const { address } = useAccount();

  const { data: groups } = useGroups();

  console.log("Groups: ", groups);

  return (
    <div>
      <h3>Groups</h3>
      <div>
        <div>
          {groups?.map((group) => (
            <div key={group.id}>
              {group.name}

              {/* <div>
                {group.members.map((member) => (
                  <div key={member.address}>{member.address}</div>
                ))}
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
