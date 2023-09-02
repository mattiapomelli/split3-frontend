"use client";

import { ethers } from "ethers";
import { useAccount } from "wagmi";

import { Button } from "@components/basic/button";
import { useIsSignedIn } from "@lib/auth/use-is-signed-in";
import { useSignIn } from "@lib/auth/use-sign-in";
import { useCreateGroup } from "@lib/group/use-create-group";
// import { useActiveMembers } from "@lib/group/use-group-members";
import { useGroup } from "@lib/group/use-group";
import { useGroups } from "@lib/group/use-groups";
import { useJoinGroup } from "@lib/group/use-join-group";

export default function Home() {
  const { address } = useAccount();

  const { isSignedIn } = useIsSignedIn();
  const { mutate: signIn, isLoading: isLoadingSignIn } = useSignIn();

  const { mutate: createGroup, isLoading } = useCreateGroup();
  const { data: groups } = useGroups();

  const { data: group } = useGroup({
    groupId: 1,
  });

  console.log("Group: ", group);

  const { mutate: joinGroup, isLoading: isLoadingJoin } = useJoinGroup();

  // const { data: members } = useActiveMembers({
  //   groupAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  // });

  const onSignIn = () => {
    signIn();
  };

  const onCreateGroup = async () => {
    if (!address) return;

    const amount = ethers.utils.parseEther("0.1");
    createGroup({
      initialMembers: [address, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
      stakeAmount: amount,
      name: "Group 1",
    });
  };

  const onJoinGroup = async (groupId: number) => {
    if (!address) return;

    joinGroup({
      groupId,
    });
  };

  return (
    <div>
      {isSignedIn ? (
        <div>Signed in</div>
      ) : (
        <Button
          onClick={onSignIn}
          disabled={isLoadingSignIn}
          loading={isLoadingSignIn}
        >
          Sign in
        </Button>
      )}
      <Button onClick={onCreateGroup} disabled={isLoading} loading={isLoading}>
        Create group
      </Button>

      <h3>Groups</h3>
      <div>
        <div>
          {groups?.map((group) => (
            <div key={group.id}>
              {group.name}

              <div>
                {group.members.map((member) => (
                  <div key={member.address}>{member.address}</div>
                ))}
              </div>

              <Button
                onClick={() => onJoinGroup(group.id)}
                disabled={isLoadingJoin}
                loading={isLoadingJoin}
              >
                Join
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
