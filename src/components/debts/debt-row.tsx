"use client";

import cx from "classnames";
import { useAccount } from "wagmi";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { useRequestDebtPayment } from "@lib/debt/use-request-debt-payment";
import { Debt } from "app/db/types";

interface ExpenseRowProps {
  debt: Debt;
  className?: string;
}

export const DebtRow = ({ debt, className }: ExpenseRowProps) => {
  const { address } = useAccount();

  const userIsOwed = debt.creditor_address === address?.toLowerCase();

  const { mutate: requestPayment, isLoading: isRequestLoading } =
    useRequestDebtPayment({
      onSuccess() {},
    });

  const onRequestDebtPayment = () => {
    requestPayment({
      debt,
    });
  };

  return (
    <div
      className={cx(
        "flex min-h-[4.625rem] flex-col gap-x-4 gap-y-5 border border-base-300 bg-base-100 px-5 py-8 md:flex-row md:items-center md:py-4 justify-between",
        className,
      )}
    >
      {userIsOwed ? (
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

      {/* TODO: show this only if the group is closed */}
      {userIsOwed ? (
        <>
          {debt.request_id ? (
            <div>
              You requested the payment
              <Button>See Request</Button>
            </div>
          ) : (
            <Button
              onClick={() => onRequestDebtPayment()}
              loading={isRequestLoading}
              disabled={isRequestLoading}
            >
              Request payment
            </Button>
          )}
        </>
      ) : (
        <>
          {debt.request_id ? (
            <div>
              You have been requested a payment
              <Button>See Request</Button>
            </div>
          ) : (
            <Button>Settle debt</Button>
          )}
        </>
      )}
    </div>
  );
};
