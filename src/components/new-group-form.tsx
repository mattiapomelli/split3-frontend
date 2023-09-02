"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ethers } from "ethers";
import { useFieldArray, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { z } from "zod";

import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { useCreateGroup } from "@lib/group/use-create-group";

const newGroupSchema = z.object({
  name: z.string().min(1),
  stakeAmount: z.string().min(1),
  members: z.array(z.object({ address: z.string() })),
});

type NewGroupData = z.infer<typeof newGroupSchema>;

export const NewGroupForm = () => {
  const { address } = useAccount();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewGroupData>({
    resolver: zodResolver(newGroupSchema),
    defaultValues: {
      members: [
        {
          address: "",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "members",
  });

  const { mutate: createGroup, isLoading } = useCreateGroup();

  const onSubmit = handleSubmit(async ({ name, members, stakeAmount }) => {
    if (!address) return;

    const otherMembers = members
      .map((member) => member.address)
      .filter(Boolean);
    const groupMembers = [address, ...otherMembers];

    createGroup({
      name,
      initialMembers: groupMembers,
      stakeAmount: ethers.utils.parseEther(stakeAmount),
    });
  });

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
      <Input
        label="Name"
        type="text"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Stake Amount (ETH)"
        type="number"
        step="0.000001"
        {...register("stakeAmount")}
        error={errors.stakeAmount?.message}
      />
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-2">
          <Input
            label={`Member ${index + 1} Address`}
            block
            {...register(`members.${index}.address`, {
              required: "Title is required",
            })}
            error={errors.members?.[index]?.address?.message}
          />
        </div>
      ))}
      <Button
        type="button"
        color="neutral"
        onClick={() =>
          append({
            address: "",
          })
        }
      >
        Add member
      </Button>
      <Button className="mt-2" loading={isLoading} disabled={isLoading}>
        Create Group
      </Button>
    </form>
  );
};
