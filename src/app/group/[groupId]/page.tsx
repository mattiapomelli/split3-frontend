"use client";

import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useAccount } from "wagmi";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { CopyButton } from "@components/copy-button";
import { DebtsList } from "@components/debts/debts-list";
import { ExpensesList } from "@components/expenses/expenses-list";
import { NewExpenseModal } from "@components/expenses/new-expense-modal";
import { Spinner } from "@components/spinner";
import { useCloseGroup } from "@lib/group/use-close-group";
import { useGroup } from "@lib/group/use-group";
import { useJoinGroup } from "@lib/group/use-join-group";
import { GroupWithInfo } from "app/db/types";

interface GroupPageInnerProps {
  group: GroupWithInfo;
  onSuccess?: () => void;
}

const GroupPageInner = ({ group, onSuccess }: GroupPageInnerProps) => {
  const { address } = useAccount();
  const router = useRouter();
  const [newExpenseModalOpen, setNewExpenseModalOpen] = useState(false);

  const { mutate: closeGroup, isLoading } = useCloseGroup();

  const onCloseGroup = () => {
    closeGroup({
      groupId: group.id,
    });
  };

  const groupMembers = group.members.filter(
    (member) => member.status === "active",
  );

  const invitedMembers = group.members.filter(
    (member) => member.status === "inactive",
  );

  const currentUserStatus = group.members.find(
    (u) => u.user_address.toLowerCase() === address?.toLowerCase(),
  )?.status;

  const { mutate: joinGroup, isLoading: isLoadingJoin } = useJoinGroup({
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
      <div className="flex justify-between">
        <div>
          <h1 className="mb-4 text-3xl font-bold">{group.name}</h1>
          <span>Members: </span>
          {groupMembers.map((member, index) => (
            <Fragment key={member.user_address}>
              <span>
                <Address address={member.user_address as `0x${string}`} />
              </span>
              {index < groupMembers.length - 1 ? ", " : ""}
            </Fragment>
          ))}
          <br />
          <span>Pending Invites: </span>
          {invitedMembers.map((member, index) => (
            <Fragment key={member.user_address}>
              <span>
                <Address address={member.user_address as `0x${string}`} />
              </span>
              {index < invitedMembers.length - 1 ? ", " : ""}
            </Fragment>
          ))}
        </div>
        {currentUserStatus === "active" ? (
          <CopyButton text={`http://localhost:3000/join/${group.id}`}>
            Copy Invite Link
          </CopyButton>
        ) : (
          <Button
            onClick={onJoinGroup}
            loading={isLoadingJoin}
            disabled={isLoading}
          >
            Join
          </Button>
        )}
      </div>
      <div className="mb-2 mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <h2 className="mb-4 text-2xl font-bold">Debts</h2>

        {!group.closed && currentUserStatus === "active" && (
          <Button
            onClick={onCloseGroup}
            loading={isLoading}
            disabled={isLoading}
          >
            Close debts
          </Button>
        )}
      </div>
      <DebtsList
        group={group}
        onSuccess={onSuccess}
        currentUserStatus={currentUserStatus || "inactive"}
      />
      <div className="mb-2 mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <h2 className="mb-4 text-2xl font-bold">Expenses</h2>
        {currentUserStatus === "active" && (
          <Button
            rightIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setNewExpenseModalOpen(true)}
          >
            New Expense
          </Button>
        )}
        <NewExpenseModal
          open={newExpenseModalOpen}
          onClose={() => setNewExpenseModalOpen(false)}
          group={group}
          onCreate={onSuccess}
        />
      </div>
      <ExpensesList group={group} currentUserStatus={currentUserStatus} />
    </div>
  );
};

interface ProjectPageProps {
  params: { groupId: string };
  onCreate?: () => void;
}

export default function GroupPage({ params }: ProjectPageProps) {
  const {
    data: group,
    isLoading,
    refetch,
  } = useGroup({
    groupId: Number(params.groupId),
  });

  return (
    <div>
      <Link href="/groups" tabIndex={-1}>
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
      {isLoading || !group ? (
        <Spinner />
      ) : (
        <GroupPageInner group={group} onSuccess={refetch} />
      )}
    </div>
  );
}
