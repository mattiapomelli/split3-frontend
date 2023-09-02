"use client";

import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useAccount } from "wagmi";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { CopyButton } from "@components/copy-button";
import { DebtsList } from "@components/debts/debts-list";
import { ExpensesList } from "@components/expenses/expenses-list";
import { NewExpenseModal } from "@components/expenses/new-expense-modal";
import { Spinner } from "@components/spinner";
import { NewDepositModal } from "@components/transfers/new-deposit-modal";
import { NewTransferModal } from "@components/transfers/new-transfer-modal";
import { TransfersList } from "@components/transfers/transfers-list";
import { getAddressExplorerLink } from "@constants/urls";
import { useChainId } from "@hooks/use-chain-id";
import { useCloseGroup } from "@lib/group/use-close-group";
import { useGroupBalance } from "@lib/group/use-get-group-balance";
import { useGroup } from "@lib/group/use-group";
import { useJoinGroup } from "@lib/group/use-join-group";
import { useSetGroupClosed } from "@lib/group/use-set-group-closed";
import { useConfirmAndExecuteTransaction } from "@lib/safe/use-confirm-and-execute-transaction";
import { useConfirmTransaction } from "@lib/safe/use-confirm-transaction";
import { useExecuteTransaction } from "@lib/safe/use-execute-transaction";
import { useGetSafeTransaction } from "@lib/safe/use-get-safe-transacion";
import { GroupWithInfo } from "app/db/types";

interface GroupPageInnerProps {
  group: GroupWithInfo;
  onSuccess?: () => void;
}
const GroupPageInner = ({ group, onSuccess }: GroupPageInnerProps) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [newExpenseModalOpen, setNewExpenseModalOpen] = useState(false);
  const [newTransferModalOpen, setNewTransferModalOpen] = useState(false);
  const [newDepositModalOpen, setNewDepositModalOpen] = useState(false);

  const { data: transaction, refetch } = useGetSafeTransaction({
    txnHash: group.close_txn_hash || "",
  });

  const { data: balance } = useGroupBalance({ groupAddress: group.address });

  const hasConfirmed = transaction?.confirmations?.find(
    (confirmation) =>
      confirmation.owner.toLowerCase() === address?.toLowerCase(),
  );

  const { mutate: setGroupClosed } = useSetGroupClosed({
    onSuccess() {
      onSuccess?.();
    },
  });

  const { mutate: closeGroup, isLoading } = useCloseGroup({
    onSuccess() {
      refetch();
    },
  });

  const { mutate: confirmTransaction, isLoading: isLoadingConfirm } =
    useConfirmTransaction({
      onSuccess() {
        refetch();
      },
    });

  const { mutate: execute, isLoading: isLoadingExecute } =
    useExecuteTransaction({
      onSuccess() {
        refetch();
        setGroupClosed({ groupId: group.id });
      },
    });
  const { mutate: confirmAndExecute, isLoading: isLoadingConfirmAndExecute } =
    useConfirmAndExecuteTransaction({
      onSuccess() {
        refetch();
        setGroupClosed({ groupId: group.id });
      },
    });

  const onApproveTransaction = () => {
    if (!transaction?.confirmationsRequired || !group.close_txn_hash) return;

    const confirmationsLeft =
      transaction?.confirmationsRequired -
      (transaction?.confirmations?.length || 0);

    if (confirmationsLeft === 0) {
      execute({
        groupOwner: group.owner,
        txnHash: group.close_txn_hash,
      });
    } else if (confirmationsLeft === 1) {
      confirmAndExecute({
        groupOwner: group.owner,
        txnHash: group.close_txn_hash,
        transaction,
      });
    } else {
      confirmTransaction({
        groupOwner: group.owner,
        txnHash: group.close_txn_hash,
      });
    }
  };

  const onCloseGroup = () => {
    closeGroup({
      groupId: group.id,
      group_contract: group.address,
      group_owner: group.owner,
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
      onSuccess?.();
    },
  });

  const onJoinGroup = async () => {
    joinGroup({
      groupId: group.id,
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <div className="mb-4 flex flex-col gap-x-2 gap-y-4 sm:flex-row sm:items-center">
            <h1 className="text-3xl font-bold sm:text-4xl">{group.name}</h1>
            <div className="flex items-center gap-2">
              <a
                href={getAddressExplorerLink(chainId, group.address)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="rounded-box bg-secondary px-3 py-0.5 text-secondary-content">
                  <Address address={group.address as `0x${string}`} />
                </div>
              </a>
              {group.closed && (
                <span className="rounded-box bg-info px-3 py-0.5 text-info-content">
                  Closed
                </span>
              )}
            </div>
          </div>
          <span className="font-bold">Members: </span>
          {groupMembers.map((member, index) => (
            <Fragment key={member.user_address}>
              <span>
                <Address address={member.user_address as `0x${string}`} />
              </span>
              {index < groupMembers.length - 1 ? ", " : ""}
            </Fragment>
          ))}
          <br />
          <span className="font-bold">Pending Invites: </span>
          {invitedMembers.map((member, index) => (
            <Fragment key={member.user_address}>
              <span>
                <Address address={member.user_address as `0x${string}`} />
              </span>
              {index < invitedMembers.length - 1 ? ", " : ""}
            </Fragment>
          ))}
          <br />
          {balance && (
            <span className="font-bold">
              Balance: <span className="font-normal">{balance} $ETH</span>
            </span>
          )}
        </div>
        <div className="mt-4 flex justify-start gap-2">
          <Button
            onClick={() => setNewDepositModalOpen(true)}
            variant="outline"
          >
            Deposit
          </Button>
          <NewDepositModal
            open={newDepositModalOpen}
            onClose={() => setNewDepositModalOpen(false)}
            group={group}
            onCreate={onSuccess}
          />
          {currentUserStatus === "active" && (
            <CopyButton text={`${window.location.origin}/join/${group.id}`}>
              Copy Invite Link
            </CopyButton>
          )}

          {currentUserStatus === "inactive" && (
            <Button
              onClick={onJoinGroup}
              loading={isLoadingJoin}
              disabled={isLoadingJoin || group.closed}
            >
              Join
            </Button>
          )}
        </div>
      </div>
      <div className="mb-4 mt-10 flex flex-row items-center justify-between gap-6">
        <h2 className="text-2xl font-bold">Debts</h2>
        <div>
          {!group.closed && currentUserStatus === "active" && (
            <div>
              {group.close_txn_hash ? (
                <div className="flex items-center gap-2">
                  <div>
                    {transaction?.confirmations?.length} /{" "}
                    {transaction?.confirmationsRequired} Signatures{" "}
                  </div>
                  {!hasConfirmed && (
                    <Button
                      onClick={onApproveTransaction}
                      loading={
                        isLoadingConfirm ||
                        isLoadingExecute ||
                        isLoadingConfirmAndExecute
                      }
                      disabled={
                        isLoadingConfirm ||
                        isLoadingExecute ||
                        isLoadingConfirmAndExecute
                      }
                    >
                      Approve Close Group
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={onCloseGroup}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Close group
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <DebtsList
        group={group}
        onSuccess={onSuccess}
        currentUserStatus={currentUserStatus || "inactive"}
      />
      <div className="mb-4 mt-10 flex flex-row items-center justify-between gap-6">
        <h2 className="text-2xl font-bold">Expenses</h2>
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
      <ExpensesList
        group={group}
        onSuccess={onSuccess}
        currentUserStatus={currentUserStatus || ""}
      />
      <div className="mb-4 mt-10 flex flex-row items-center justify-between gap-6">
        <h2 className="text-2xl font-bold">Transfers</h2>
        {currentUserStatus === "active" && (
          <Button
            rightIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setNewTransferModalOpen(true)}
          >
            New Transfer
          </Button>
        )}
        <NewTransferModal
          open={newTransferModalOpen}
          onClose={() => setNewTransferModalOpen(false)}
          group={group}
          onCreate={onSuccess}
        />
      </div>
      <TransfersList
        group={group}
        onSuccess={onSuccess}
        currentUserStatus={currentUserStatus || ""}
      />
    </div>
  );
};

interface ProjectPageProps {
  params: { groupId: string };
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
    <div className="mt-4">
      <Link href="/groups" tabIndex={-1}>
        <Button
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
          color="neutral"
          variant="outline"
          size="sm"
          className="mb-4"
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
