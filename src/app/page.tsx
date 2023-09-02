"use client";

import { ethers } from "ethers";
import { useAccount } from "wagmi";

import { Button } from "@components/basic/button";
import { useCreateGroup } from "@lib/group/use-create-group";
import { useActiveMembers } from "@lib/group/use-group-members";
import { useJoinGroup } from "@lib/group/use-join-group";

export default function Home() {
  const { address } = useAccount();
  const { mutate: createGroup, isLoading } = useCreateGroup();

  const { mutate: joinGroup, isLoading: isLoadingJoin } = useJoinGroup({
    groupAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  });

  const { data: members } = useActiveMembers({
    groupAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  });

  const onCreateGroup = async () => {
    if (!address) return;

    const amount = ethers.utils.parseEther("0.1");
    createGroup({
      initialMembers: [address, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
      stakeAmount: amount,
    });
  };

  const onJoinGroup = async () => {
    if (!address) return;

    joinGroup();
  };

  return (
    <div>
      <Button onClick={onCreateGroup} disabled={isLoading} loading={isLoading}>
        Create group
      </Button>
      <Button
        onClick={onJoinGroup}
        disabled={isLoadingJoin}
        loading={isLoadingJoin}
      >
        Join group
      </Button>
      <h3>Members</h3>
      <div>
        {members?.map((member) => (
          <div key={member}>{member}</div>
        ))}
      </div>
    </div>
  );
}
