"use client";

import cx from "classnames";
import { ethers } from "ethers";
import { Fragment } from "react";
import { useAccount } from "wagmi";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { useSyncGroupDebts } from "@lib/debt/use-sync-debts";
import { useConfirmAndExecuteTransaction } from "@lib/safe/use-confirm-and-execute-transaction";
import { useConfirmTransaction } from "@lib/safe/use-confirm-transaction";
import { useExecuteTransaction } from "@lib/safe/use-execute-transaction";
import { useGetSafeTransaction } from "@lib/safe/use-get-safe-transacion";
import { GroupExpense, GroupWithMembers } from "app/db/types";

// import { PostModal } from "./post-modal";

interface ExpenseRowProps {
  expense: GroupExpense;
  group: GroupWithMembers;
  shouldShowApproveButton: boolean;
  onSuccess?: () => void;

  className?: string;
}

export const ExpenseRow = ({
  expense,
  group,
  className,
  shouldShowApproveButton,
  onSuccess,
}: ExpenseRowProps) => {
  const { address } = useAccount();
  const { data: transaction, refetch } = useGetSafeTransaction({
    txnHash: expense.tx_hash || "",
  });

  const { mutate: syncDebts } = useSyncGroupDebts({
    onSuccess: () => {
      onSuccess?.();
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
        syncDebts({
          group,
          expense,
        });
        refetch();
      },
    });
  const { mutate: confirmAndExecute, isLoading: isLoadingConfirmAndExecute } =
    useConfirmAndExecuteTransaction({
      onSuccess() {
        syncDebts({
          group,
          expense,
        });
        refetch();
      },
    });

  const onApproveTransaction = () => {
    if (!transaction?.confirmationsRequired) return;

    const confirmationsLeft =
      transaction?.confirmationsRequired -
      (transaction?.confirmations?.length || 0);

    if (confirmationsLeft === 0) {
      execute({
        groupOwner: group.owner,
        txnHash: expense.tx_hash || "",
      });
    } else if (confirmationsLeft === 1) {
      confirmAndExecute({
        groupOwner: group.owner,
        txnHash: expense.tx_hash || "",
        transaction,
      });
    } else {
      confirmTransaction({
        groupOwner: group.owner,
        txnHash: expense.tx_hash || "",
        transaction,
      });
    }
  };

  const debtorAddresses = expense.debtor_addresses.split(",");

  return (
    <div
      className={cx(
        "flex min-h-[4.625rem] flex-col gap-x-4 gap-y-5 border border-base-300 bg-base-100 px-5 py-8 md:flex-row md:items-center md:py-4",
        className,
      )}
    >
      <div className="flex min-w-[1px] flex-1 flex-col gap-2 font-bold sm:flex-row sm:items-center">
        {expense.title}
      </div>

      <div className="md:basis-[200px] lg:basis-[300px]">
        <Address
          className="font-semibold"
          address={expense.user_address as `0x${string}`}
        />{" "}
        <i>paid </i>
        {expense.amount && (
          <span className="font-semibold">
            {ethers.utils.formatEther(expense.amount.toString())} FAU
          </span>
        )}
      </div>

      <div className="md:basis-[180px] lg:basis-[300px]">
        <i>for </i>
        {debtorAddresses.map((user, index) => (
          <Fragment key={user}>
            <span>
              <Address
                className="font-semibold"
                address={user as `0x${string}`}
              />
            </span>
            {index < debtorAddresses.length - 1 ? ", " : ""}
          </Fragment>
        ))}
      </div>

      <div className="flex justify-end md:basis-[100px] lg:basis-[200px]">
        {transaction?.isExecuted ? (
          <span className="rounded-box bg-primary/30 px-4 py-0.5">
            Approved
          </span>
        ) : (
          <div className="flex-col gap-2">
            <div>
              {transaction?.confirmations?.length} /{" "}
              {transaction?.confirmationsRequired} Signatures{" "}
            </div>
            {!transaction?.isExecuted &&
              expense.user_address !== address?.toLowerCase() &&
              shouldShowApproveButton && (
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
                  Approve
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
