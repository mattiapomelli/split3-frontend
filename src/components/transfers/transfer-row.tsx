"use client";

import cx from "classnames";
import { ethers } from "ethers";

import { Button } from "@components/basic/button";
import { useConfirmAndExecuteTransaction } from "@lib/safe/use-confirm-and-execute-transaction";
import { useConfirmTransaction } from "@lib/safe/use-confirm-transaction";
import { useExecuteTransaction } from "@lib/safe/use-execute-transaction";
import { useGetSafeTransaction } from "@lib/safe/use-get-safe-transacion";
import { GroupTransfer, GroupWithMembers } from "app/db/types";

// import { PostModal } from "./post-modal";

interface TransferRowProps {
  transfer: GroupTransfer;
  group: GroupWithMembers;
  shouldShowApproveButton: boolean;
  onSuccess?: () => void;

  className?: string;
}

export const TransferRow = ({
  transfer,
  group,
  className,
  shouldShowApproveButton,
}: TransferRowProps) => {
  const { data: transaction, refetch } = useGetSafeTransaction({
    txnHash: transfer.tx_hash || "",
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
      },
    });
  const { mutate: confirmAndExecute, isLoading: isLoadingConfirmAndExecute } =
    useConfirmAndExecuteTransaction({
      onSuccess() {
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
        txnHash: transfer.tx_hash || "",
      });
    } else if (confirmationsLeft === 1) {
      confirmAndExecute({
        groupOwner: group.owner,
        txnHash: transfer.tx_hash || "",
        transaction,
      });
    } else {
      confirmTransaction({
        groupOwner: group.owner,
        txnHash: transfer.tx_hash || "",
        transaction,
      });
    }
  };

  return (
    <div
      className={cx(
        "flex min-h-[4.625rem] flex-col gap-x-4 gap-y-5 border border-base-300 bg-base-100 px-5 py-8 md:flex-row md:items-center md:py-4 justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center">
        {ethers.utils.formatEther(transfer.amount!.toString())} $ETH{" "}
      </div>

      <div>to {transfer.recipient_address} </div>

      <div>
        {transaction?.isExecuted ? (
          "Approved"
        ) : (
          <div>
            {transaction?.confirmations?.length} /{" "}
            {transaction?.confirmationsRequired} Signatures{" "}
            {!transaction?.isExecuted && shouldShowApproveButton && (
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
