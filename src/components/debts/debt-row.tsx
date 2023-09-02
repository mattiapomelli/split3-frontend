"use client";

import cx from "classnames";
import { useAccount } from "wagmi";

import { Address } from "@components/address";
import { Debt } from "app/db/types";

interface ExpenseRowProps {
  debt: Debt;
  className?: string;
}

export const DebtRow = ({ debt, className }: ExpenseRowProps) => {
  const { address } = useAccount();

  return (
    <div
      className={cx(
        "flex min-h-[4.625rem] flex-col gap-x-4 gap-y-5 border border-base-300 bg-base-100 px-5 py-8 md:flex-row md:items-center md:py-4 justify-between",
        className,
      )}
    >
      {debt.creditor_address === address?.toLowerCase() ? (
        <p>
          <Address address={debt.debtor_address as `0x${string}`} /> owes you{" "}
          <span className="font-medium">{debt.amount} USDC</span>
        </p>
      ) : (
        <p>
          You owe <Address address={debt.debtor_address as `0x${string}`} />{" "}
          <span className="font-medium">{debt.amount} USDC</span>
        </p>
      )}

      {/* <div>
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
      </div> */}
    </div>
  );
};
