"use client";

import cx from "classnames";
// import { useState } from "react";w

import { GroupWithExpenses } from "app/db/types";

import { ExpenseRow } from "./expense-row";

interface ExpensesListProps {
  group: GroupWithExpenses;
}

export const ExpensesList = ({ group }: ExpensesListProps) => {
  // const [modalOpen, setModalOpen] = useState(false);

  if (!group.expenses.length)
    return (
      <div className="rounded-box mt-6 border border-base-300 py-14">
        No expenses yet
      </div>
    );

  return (
    <div className="flex flex-col">
      {group.expenses.map((expense, index) => (
        <ExpenseRow
          key={expense.id}
          expense={expense}
          className={cx(
            { "-mt-px": index !== 0 },
            { "rounded-t-box": index === 0 },
            { "rounded-b-box": index === group.expenses.length - 1 },
          )}
        />
      ))}
    </div>
  );
};
