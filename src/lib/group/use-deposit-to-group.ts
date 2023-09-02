import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";

type DepositToGroupData = {
  amount: string;
  group_contract: string;
};

interface UseCreateDepositRequestOptions {
  onSuccess?: (txHash: string) => void;
}

export const useDepositToGroup = (options?: UseCreateDepositRequestOptions) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const provider = useProvider();
  return useMutation(
    async ({ amount, group_contract }: DepositToGroupData) => {
      if (!address || !signer || !chain) throw new Error("No address");
      const gasPrice = await provider.getGasPrice();
      const tx = await signer.sendTransaction({
        from: address! as string,
        to: group_contract,
        value: ethers.utils.parseEther(amount),
        nonce: provider.getTransactionCount(address, "latest"),
        gasLimit: ethers.utils.hexlify(100000), // 100000
        gasPrice,
      });
      const transactionReceipt = await tx.wait();
      return transactionReceipt.transactionHash;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
