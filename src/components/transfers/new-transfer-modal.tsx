import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { z } from "zod";

import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { BaseModalProps, Modal } from "@components/basic/modal";
import { useTransferFromGroup } from "@lib/group/use-transfer-from-group";
import { GroupWithInfo } from "app/db/types";

const newTransferSchema = z.object({
  address: z.string().min(1),
  amount: z.string().min(1),
});

type NewTransferData = z.infer<typeof newTransferSchema>;

interface NewTransferModalProps extends BaseModalProps {
  group: GroupWithInfo;
  onCreate?: () => void;
}

export const NewTransferModal = ({
  onClose,
  open,
  group,
  onCreate,
}: NewTransferModalProps) => {
  const { address } = useAccount();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTransferData>({
    resolver: zodResolver(newTransferSchema),
  });

  const { mutate: createTransfer, isLoading } = useTransferFromGroup({
    onSuccess() {
      onCreate?.();
      onClose();
    },
  });

  const onSubmit = handleSubmit(async ({ amount, ...rest }) => {
    if (!address) return;
    createTransfer({
      recipient_address: rest.address,
      group_contract: group.address,
      group_owner: group.owner,
      amount,
      group_id: group.id,
    });
  });

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-lg font-bold">Add Transfer</h3>
      <hr className="my-4 border-base-300 dark:border-base-content/30" />
      <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
        <Input
          label="Address"
          type="text"
          {...register("address")}
          error={errors.address?.message}
        />
        <Input
          label="Amount (ETH)"
          type="number"
          step="0.000001"
          {...register("amount")}
          error={errors.amount?.message}
        />
        <Button className="mt-2" loading={isLoading} disabled={isLoading}>
          Create Transfer
        </Button>
      </form>
    </Modal>
  );
};
