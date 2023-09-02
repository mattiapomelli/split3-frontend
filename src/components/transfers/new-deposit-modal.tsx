import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { z } from "zod";

import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { BaseModalProps, Modal } from "@components/basic/modal";
import { useDepositToGroup } from "@lib/group/use-deposit-to-group";
import { GroupWithInfo } from "app/db/types";

const newDepositSchema = z.object({
  amount: z.string().min(1),
});

type NewTransferData = z.infer<typeof newDepositSchema>;

interface NewDepositModalProps extends BaseModalProps {
  group: GroupWithInfo;
  onCreate?: () => void;
}

export const NewDepositModal = ({
  onClose,
  open,
  group,
  onCreate,
}: NewDepositModalProps) => {
  const { address } = useAccount();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTransferData>({
    resolver: zodResolver(newDepositSchema),
  });

  const { mutate: depositToGroup, isLoading } = useDepositToGroup({
    onSuccess() {
      onCreate?.();
      onClose();
    },
  });

  const onSubmit = handleSubmit(async ({ amount }) => {
    if (!address) return;
    depositToGroup({
      amount,
      group_contract: group.address,
    });
  });

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-lg font-bold">
        Deposit $ETH in the group balance
      </h3>
      <hr className="my-4 border-base-300 dark:border-base-content/30" />
      <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
        <Input
          label="Amount (ETH)"
          type="number"
          step="0.000001"
          {...register("amount")}
          error={errors.amount?.message}
        />
        <Button className="mt-2" loading={isLoading} disabled={isLoading}>
          Deposit
        </Button>
      </form>
    </Modal>
  );
};
