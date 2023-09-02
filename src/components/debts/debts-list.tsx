"use client";

import cx from "classnames";
// import { useState } from "react";w

import { GroupWithInfo } from "app/db/types";

import { DebtRow } from "./debt-row";

interface ExpensesListProps {
  group: GroupWithInfo;
}

export const DebtsList = ({ group }: ExpensesListProps) => {
  // const [modalOpen, setModalOpen] = useState(false);

  if (!group.debts.length)
    return (
      <div className="rounded-box mt-6 border border-base-300 py-14 text-center">
        No debts yet
      </div>
    );

  return (
    <div className="flex flex-col">
      {group.debts.map((debt, index) => (
        <DebtRow
          key={debt.id}
          debt={debt}
          className={cx(
            { "-mt-px": index !== 0 },
            { "rounded-t-box": index === 0 },
            { "rounded-b-box": index === group.debts.length - 1 },
          )}
        />
      ))}
    </div>
  );
};
