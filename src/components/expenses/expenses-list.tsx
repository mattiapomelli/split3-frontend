"use client";

import cx from "classnames";
// import { useState } from "react";w

import { GroupWithInfo } from "app/db/types";

import { ExpenseRow } from "./expense-row";

interface ExpensesListProps {
  group: GroupWithInfo;
  currentUserStatus?: string;
  onSuccess?: () => void;
}

export const ExpensesList = ({
  group,
  onSuccess,
  currentUserStatus,
}: ExpensesListProps) => {
  const expenses = group.expenses.sort((a, b) => {
    return a.id > b.id ? -1 : 1;
  });

  if (!expenses.length)
    return (
      <div className="rounded-box mt-6 border border-base-300 py-14 text-center">
        No expenses yet
      </div>
    );

  return (
    <div className="flex flex-col">
      {expenses.map((expense, index) => (
        <ExpenseRow
          key={expense.id}
          expense={expense}
          group={group}
          shouldShowApproveButton={currentUserStatus === "active"}
          onSuccess={onSuccess}
          className={cx(
            { "-mt-px": index !== 0 },
            { "rounded-t-box": index === 0 },
            { "rounded-b-box": index === expenses.length - 1 },
          )}
        />
      ))}
    </div>
  );
};
