"use client";

import cx from "classnames";
import { useState } from "react";
import { useAccount } from "wagmi";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { RequestModal } from "@components/request-modal";
import { usePayDebtPaymentRequest } from "@lib/debt/use-pay-debt-payment-request";
import { useRequestDebtPayment } from "@lib/debt/use-request-debt-payment";
import { useSettleDebt } from "@lib/debt/use-settle-debt";
import { Debt, Group } from "app/db/types";

interface ExpenseRowProps {
  debt: Debt;
  group: Group;
  shouldShowRequestButton: boolean;
  className?: string;
  onSuccess?: () => void;
}

export const DebtRow = ({
  debt,
  group,
  className,
  onSuccess,
  shouldShowRequestButton,
}: ExpenseRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();

  const userIsOwed = debt.creditor_address === address?.toLowerCase();

  const { mutate: requestPayment, isLoading: isRequestLoading } =
    useRequestDebtPayment({
      onSuccess,
    });

  const { mutate: payDebtPaymentRequest, isLoading: isPayLoading } =
    usePayDebtPaymentRequest({
      onSuccess,
    });

  const { mutate: settleDebt, isLoading: isSettleLoading } = useSettleDebt({
    onSuccess,
  });

  // Request debtor to pay
  const onRequestDebtPayment = () => {
    requestPayment({
      debt,
      groupName: group.name,
    });
  };

  const onPayDebt = () => {
    // Pay requested payment
    if (debt.request_id) {
      payDebtPaymentRequest({
        debt,
      });
    } else {
      // Spontaneously pay debt
      settleDebt({
        debt,
        groupName: group.name,
      });
    }
  };

  return (
    <div
      className={cx(
        "flex min-h-[4.625rem] flex-col gap-x-4 gap-y-5 border border-base-300 bg-base-100 px-5 py-8 sm:flex-row md:items-center sm:py-4 justify-between",
        className,
      )}
    >
      {userIsOwed ? (
        <p>
          <Address
            className="font-bold"
            address={debt.debtor_address as `0x${string}`}
          />{" "}
          <i>owes you </i>
          <span className="font-bold">{debt.amount} FAU</span>
        </p>
      ) : (
        <p>
          <i>You owe </i>
          <Address
            className="font-bold"
            address={debt.creditor_address as `0x${string}`}
          />{" "}
          <span className="font-bold">{debt.amount} FAU</span>
        </p>
      )}

      {group.closed && (
        <>
          {shouldShowRequestButton && userIsOwed ? (
            <div>
              {debt.settled ? (
                <p>You got repaid</p>
              ) : (
                <div>
                  {debt.request_id ? (
                    <p>
                      You
                      <span
                        className="text-primary hover:underline"
                        onClick={() => setIsModalOpen(true)}
                      >
                        {" "}
                        requested{" "}
                      </span>
                      the payment{" "}
                    </p>
                  ) : (
                    <Button
                      onClick={() => onRequestDebtPayment()}
                      loading={isRequestLoading}
                      disabled={isRequestLoading}
                    >
                      Request payment
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              {debt.settled ? (
                <p>You paid the debt</p>
              ) : (
                <div className="flex items-center justify-end gap-2">
                  {debt.request_id && (
                    <p>
                      You have been{" "}
                      <span
                        className="text-primary hover:underline"
                        onClick={() => setIsModalOpen(true)}
                      >
                        {" "}
                        requested{" "}
                      </span>{" "}
                      a payment{" "}
                    </p>
                  )}
                  {shouldShowRequestButton && (
                    <Button
                      onClick={onPayDebt}
                      loading={isPayLoading || isSettleLoading}
                      disabled={isPayLoading || isSettleLoading}
                    >
                      Settle debt
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <RequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestId={debt.request_id || ""}
      />
    </div>
  );
};
