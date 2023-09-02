"use client";

import cx from "classnames";
import { useAccount } from "wagmi";

import { GroupWithInfo } from "app/db/types";

import { DebtRow } from "./debt-row";

interface ExpensesListProps {
  group: GroupWithInfo;
  currentUserStatus: string;
  onSuccess?: () => void;
}

export const DebtsList = ({
  group,
  onSuccess,
  currentUserStatus,
}: ExpensesListProps) => {
  const { address } = useAccount();

  const userDebts = group.debts.filter(
    (debt) =>
      debt.debtor_address === address?.toLowerCase() ||
      debt.creditor_address === address?.toLowerCase(),
  );

  const nonZeroDebts = userDebts.filter((debt) => debt.amount !== 0);

  if (!userDebts.length)
    return (
      <div className="rounded-box mt-6 border border-base-300 py-14 text-center">
        No debts yet
      </div>
    );

  return (
    <div className="flex flex-col">
      {nonZeroDebts.map((debt, index) => (
        <DebtRow
          key={debt.id}
          debt={debt}
          group={group}
          onSuccess={onSuccess}
          shouldShowRequestButton={currentUserStatus === "active"}
          className={cx(
            { "-mt-px": index !== 0 },
            { "rounded-t-box": index === 0 },
            { "rounded-b-box": index === nonZeroDebts.length - 1 },
          )}
        />
      ))}
    </div>
  );
};
