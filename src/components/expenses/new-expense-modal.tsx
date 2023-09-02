import { zodResolver } from "@hookform/resolvers/zod";
import cx from "classnames";
import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { z } from "zod";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { Label } from "@components/basic/label";
import { BaseModalProps, Modal } from "@components/basic/modal";
import { useCreateExpense } from "@lib/expenses/use-create-expense";
import { GroupWithInfo } from "app/db/types";

const newExpenseSchema = z.object({
  title: z.string().min(1),
  amount: z.string().min(1),
});

type NewExpenseData = z.infer<typeof newExpenseSchema>;

interface NewPostModalProps extends BaseModalProps {
  group: GroupWithInfo;
  onCreate?: () => void;
}

export const NewExpenseModal = ({
  onClose,
  open,
  group,
  onCreate,
}: NewPostModalProps) => {
  const { address } = useAccount();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewExpenseData>({
    resolver: zodResolver(newExpenseSchema),
  });

  const [debtors, setDebtors] = useState<string[]>([]);

  const onAddDebtor = (address: string) => {
    setDebtors((prev) => [...prev, address]);
  };

  const onRemoveDebtor = (address: string) => {
    setDebtors((prev) => prev.filter((a) => a !== address));
  };

  const onToggleDebtor = (address: string) => {
    if (debtors.includes(address)) {
      onRemoveDebtor(address);
    } else {
      onAddDebtor(address);
    }
  };

  const { mutate: createExpense, isLoading } = useCreateExpense({
    onSuccess() {
      onCreate?.();
      onClose();
    },
  });

  const onSubmit = handleSubmit(async ({ amount, ...rest }) => {
    if (!address) return;
    createExpense({
      ...rest,
      payer_address: address,
      group_contract: group.address,
      group_owner: group.owner,
      amount: ethers.utils.parseEther(amount),
      debtor_addresses: debtors.join(","),
      group_id: group.id,
    });
  });

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-lg font-bold">Add Expense</h3>
      <hr className="my-4 border-base-300 dark:border-base-content/30" />
      <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
        <Input
          label="Title"
          type="text"
          {...register("title")}
          error={errors.title?.message}
        />
        <Input
          label="Amount (ETH)"
          type="number"
          step="0.000001"
          {...register("amount")}
          error={errors.amount?.message}
        />
        <div>
          <Label>Split between:</Label>
          <div className="flex flex-col gap-2">
            {group.members
              .filter((member) => member.status === "active")
              .map((member) => (
                <button
                  key={member.user_address}
                  type="button"
                  onClick={() => onToggleDebtor(member.user_address)}
                  className={cx(
                    "rounded-box w-full p-4 py-2",
                    debtors.includes(member.user_address)
                      ? "bg-primary/60"
                      : "bg-base-200 hover:bg-base-300",
                  )}
                >
                  <Address address={member.user_address as `0x${string}`} />
                </button>
              ))}
          </div>
        </div>

        <Button className="mt-2" loading={isLoading} disabled={isLoading}>
          Create Expense
        </Button>
      </form>
    </Modal>
  );
};
