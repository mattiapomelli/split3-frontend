"use client";

import cx from "classnames";
import { ethers } from "ethers";
import { Fragment } from "react";
import { useAccount } from "wagmi";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { useSyncGroupDebts } from "@lib/debt/use-sync-debts";
import { useConfirmAndExecuteTransaction } from "@lib/safe/use-confirm-and-execute-transaction";
import { useConfirmTransaction } from "@lib/safe/use-confirm-transaciont";
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
      });
    } else {
      confirmTransaction({
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
