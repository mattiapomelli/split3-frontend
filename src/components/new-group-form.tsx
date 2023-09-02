"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAccount, useSigner } from "wagmi";
import { z } from "zod";

import { formatAddress } from "@components/address";
import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { Select } from "@components/basic/select";
import { useCreateGroup } from "@lib/group/use-create-group";
import { getOwners } from "@lib/safe";
import { useGetSafesByOwner } from "@lib/safe/use-get-safes-by-owner";

import { Label } from "./basic/label";

const newGroupSchema = z.object({
  name: z.string().min(1),
  stakeAmount: z.string().min(1),
  members: z.array(z.object({ address: z.string() })),
  safeAddress: z.string().optional(),
});

type NewGroupData = z.infer<typeof newGroupSchema>;

export const NewGroupForm = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const router = useRouter();
  const { data: safesByOwner } = useGetSafesByOwner();
  const [safeAddress, setSafeAddress] = useState<string>("");
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
  const [isExistingSafe, setIsExistingSafe] = useState(false);

  const { fields, append } = useFieldArray({
    control,
    name: "members",
  });

  const { mutate: createGroup, isLoading } = useCreateGroup({
    onSuccess(groupId) {
      router.push(`/group/${groupId}`);
    },
  });

  useEffect(() => {
    setSafeAddress(safeAddress); //I updated the parent component's state in useEffect
    console.log(safeAddress);
  }, [safeAddress]);

  const onSubmit = handleSubmit(async ({ name, members, stakeAmount }) => {
    if (!address) return;
    let otherMembers: string[];
    if (safeAddress) {
      otherMembers = (await getOwners(safeAddress, signer!)).filter(
        (owner) => owner.toLowerCase() !== address.toLowerCase(),
      );
    } else {
      otherMembers = members.map((member) => member.address).filter(Boolean);
    }

    const amount = ethers.utils.parseEther(stakeAmount);
    createGroup({
      name,
      initialMembers: otherMembers,
      stakeAmount: amount,
    });
  });

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
      <Input
        label="Group Name"
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
      <div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            onChange={(e) => {
              setSafeAddress("");
              setIsExistingSafe(e.target.checked);
            }}
            className="peer sr-only outline outline-transparent"
            checked={isExistingSafe}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="ml-3 text-sm font-medium">Use an existing safe</span>
        </label>
        {!isExistingSafe ? (
          <>
            <Label>Members</Label>
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <Input
                  key={field.id}
                  // label={`Member ${index + 1} Address`}
                  block
                  {...register(`members.${index}.address`, {
                    required: "Title is required",
                  })}
                  error={errors.members?.[index]?.address?.message}
                />
              ))}
            </div>
            <Button
              className="mt-4 w-full"
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
          </>
        ) : (
          <>
            <Label>Import an existing Safe</Label>
            <div className="flex flex-col gap-2">
              {safesByOwner && (
                <Select
                  items={safesByOwner.map((safe) => ({
                    name: formatAddress(safe),
                    value: safe,
                  }))}
                  onValueChange={(value) => {
                    setSafeAddress(value);
                  }}
                  value={safeAddress}
                ></Select>
              )}
            </div>
          </>
        )}
      </div>

        <Label className="ml-1">Members</Label>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <Input
              key={field.id}
              // label={`Member ${index + 1} Address`}
              block
              {...register(`members.${index}.address`, {
                required: "Title is required",
              })}
              error={errors.members?.[index]?.address?.message}
            />
          ))}
        </div>
      </div>
      <Button
        type="button"
        color="neutral"
        rightIcon={<PlusIcon className="h-5 w-5" />}
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
