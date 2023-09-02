"use client";

import cx from "classnames";
import { useAccount } from "wagmi";

import { GroupWithInfo } from "app/db/types";

import { DebtRow } from "./debt-row";

interface ExpensesListProps {
  group: GroupWithInfo;
}

export const DebtsList = ({ group }: ExpensesListProps) => {
  const { address } = useAccount();

  const userDebts = group.debts.filter(
    (debt) =>
      debt.debtor_address === address?.toLowerCase() ||
      debt.creditor_address === address?.toLowerCase(),
  );

  if (!userDebts.length)
    return (
      <div className="rounded-box mt-6 border border-base-300 py-14 text-center">
        No debts yet
      </div>
    );

  return (
    <div className="flex flex-col">
      {userDebts.map((debt, index) => (
        <DebtRow
          key={debt.id}
          debt={debt}
          className={cx(
            { "-mt-px": index !== 0 },
            { "rounded-t-box": index === 0 },
            { "rounded-b-box": index === userDebts.length - 1 },
          )}
        />
      ))}
    </div>
  );
};
