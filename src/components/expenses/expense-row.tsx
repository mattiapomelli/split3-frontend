"use client";

import cx from "classnames";
import { ethers } from "ethers";
import { Fragment } from "react";

import { Address } from "@components/address";
import { GroupExpense } from "app/db/types";

// import { PostModal } from "./post-modal";

interface ExpenseRowProps {
  expense: GroupExpense;

  className?: string;
}

export const ExpenseRow = ({ expense, className }: ExpenseRowProps) => {
  // const [modalOpen, setModalOpen] = useState(false);

  const creditorUserAddresses = expense.creditor_user_addresses.split(",");

  return (
    <div
      className={cx(
        "flex min-h-[4.625rem] flex-col gap-x-4 gap-y-5 border border-base-300 bg-base-100 px-5 py-8 md:flex-row md:items-center md:py-4 justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center">
        {expense.title}
      </div>

      <div>
        <Address address={expense.user_address as `0x${string}`} /> paid{" "}
        {expense.amount && (
          <span className="font-medium">
            {ethers.utils.formatEther(expense.amount.toString())} USDC
          </span>
        )}
      </div>

      <div>
        for{" "}
        {creditorUserAddresses.map((user, index) => (
          <Fragment key={user}>
            <span>
              <Address address={user as `0x${string}`} />
            </span>
            {index < creditorUserAddresses.length - 1 ? ", " : ""}
          </Fragment>
        ))}
      </div>

      {/* <div className="hidden items-center md:flex md:basis-[120px] lg:basis-[200px]">
        <TriggerTypeBadge type={post.trigger_type} />
      </div> */}

      {/* <PostModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          post={post}
          project={project}
        /> */}
    </div>
  );
};
