"use client";

import cx from "classnames";

import { TransferRow } from "@components/transfers/transfer-row";
import { GroupWithInfo } from "app/db/types";

interface TransfersListProps {
  group: GroupWithInfo;
  currentUserStatus: string;
  onSuccess?: () => void;
}

export const TransfersList = ({
  group,
  onSuccess,
  currentUserStatus,
}: TransfersListProps) => {
  if (!group.transfers?.length)
    return (
      <div className="rounded-box mt-6 border border-base-300 py-14 text-center">
        No transfers yet
      </div>
    );

  return (
    <div className="flex flex-col">
      {group.transfers.map((transfer, index) => (
        <TransferRow
          key={transfer.id}
          transfer={transfer}
          group={group}
          onSuccess={onSuccess}
          shouldShowApproveButton={currentUserStatus === "active"}
          className={cx(
            { "-mt-px": index !== 0 },
            { "rounded-t-box": index === 0 },
            { "rounded-b-box": index === group.transfers.length - 1 },
          )}
        />
      ))}
    </div>
  );
};
