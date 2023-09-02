"use client";

import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Fragment, useState } from "react";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { CopyButton } from "@components/copy-button";
import { ExpensesList } from "@components/expenses/expenses-list";
import { NewExpenseModal } from "@components/expenses/new-expense-modal";
import { Spinner } from "@components/spinner";
import { useGroup } from "@lib/group/use-group";
import { GroupWithExpenses } from "app/db/types";

interface GroupPageInnerProps {
  group: GroupWithExpenses;
  onCreate?: () => void;
}

const GroupPageInner = ({ group, onCreate }: GroupPageInnerProps) => {
  const [newExpenseModalOpen, setNewExpenseModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="mb-4 text-3xl font-bold">{group.name}</h1>
          <span>Members: </span>
          {group.members.map((member, index) => (
            <Fragment key={member.user_address}>
              <span>
                <Address address={member.user_address as `0x${string}`} />
              </span>
              {index < group.members.length - 1 ? ", " : ""}
            </Fragment>
          ))}
        </div>
        <CopyButton text={`http://localhost:3000/join/${group.id}`}>
          Copy Invite Link
        </CopyButton>
      </div>
      <div className="mb-2 mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <h2 className="mb-4 text-2xl font-bold">Debts</h2>
        <Button
        // onClick={() => setNewExpenseModalOpen(true)}
        >
          Close debts
        </Button>
      </div>
      <ExpensesList group={group} />
      <div className="mb-2 mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <h2 className="mb-4 text-2xl font-bold">Expenses</h2>
        <Button
          rightIcon={<PlusIcon className="h-5 w-5" />}
          onClick={() => setNewExpenseModalOpen(true)}
        >
          New Expense
        </Button>
        <NewExpenseModal
          open={newExpenseModalOpen}
          onClose={() => setNewExpenseModalOpen(false)}
          group={group}
          onCreate={onCreate}
        />
      </div>
      <ExpensesList group={group} />
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
        <GroupPageInner group={group} onCreate={refetch} />
      )}
    </div>
  );
}
