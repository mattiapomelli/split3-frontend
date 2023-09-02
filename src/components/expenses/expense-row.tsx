"use client";

import cx from "classnames";
import { ethers } from "ethers";
import { Fragment } from "react";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { useSyncGroupDebts } from "@lib/debt/use-sync-debts";
import { useConfirmAndExecuteTransaction } from "@lib/safe/use-confirm-and-execute-transaction";
import { useConfirmTransaction } from "@lib/safe/use-confirm-transaciont";
import { useGetSafeTransaction } from "@lib/safe/use-get-safe-transacion";
import { Group, GroupExpense } from "app/db/types";

// import { PostModal } from "./post-modal";

interface ExpenseRowProps {
  expense: GroupExpense;
  group: Group;
  className?: string;
}

export const ExpenseRow = ({ expense, group, className }: ExpenseRowProps) => {
  const { data: transaction, refetch } = useGetSafeTransaction({
    txnHash: expense.tx_hash || "",
  });

  const { mutate } = useSyncGroupDebts({
    onSuccess: () => {
      console.log("Synced");
    },
  });

  const { mutate: executeTransaction, isLoading: isLoadingConfirm } =
    useConfirmTransaction({
      onSuccess() {
        refetch();
      },
    });
  const { mutate: confirmAndExecute, isLoading: isLoadingExecute } =
    useConfirmAndExecuteTransaction({
      onSuccess() {
        mutate({
          groupId: group.id,
          groupAddress: group.owner,
        });
        refetch();
      },
    });

  const onApproveTransaction = () => {
    const isOneConfirmationLeft =
      transaction?.confirmationsRequired &&
      transaction?.confirmations?.length ===
        transaction?.confirmationsRequired - 1;

    if (isOneConfirmationLeft) {
      confirmAndExecute({
        groupOwner: group.owner,
        txnHash: expense.tx_hash || "",
      });
    } else {
      executeTransaction({
        groupOwner: group.owner,
        txnHash: expense.tx_hash || "",
      });
    }
  };

  const debtorAddresses = expense.debtor_addresses.split(",");

  return (
    <div
      className={cx(
        "flex min-h-[4.625rem] flex-col gap-x-4 gap-y-5 border border-base-300 bg-base-100 px-5 py-8 md:flex-row md:items-center md:py-4 justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center">
        {expense.title}
      </div>

      <div>
        <Address address={expense.user_address as `0x${string}`} /> paid{" "}
        {expense.amount && (
          <span className="font-medium">
            {ethers.utils.formatEther(expense.amount.toString())} USDC
          </span>
        )}
      </div>

      <div>
        for{" "}
        {debtorAddresses.map((user, index) => (
          <Fragment key={user}>
            <span>
              <Address address={user as `0x${string}`} />
            </span>
            {index < debtorAddresses.length - 1 ? ", " : ""}
          </Fragment>
        ))}
      </div>

      <div>
        {transaction?.isExecuted ? (
          "Approved"
        ) : (
          <div>
            {transaction?.confirmations?.length} /{" "}
            {transaction?.confirmationsRequired} Confirmations{" "}
            {!transaction?.isExecuted && (
              <Button
                onClick={onApproveTransaction}
                loading={isLoadingConfirm || isLoadingExecute}
                disabled={isLoadingConfirm || isLoadingExecute}
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
