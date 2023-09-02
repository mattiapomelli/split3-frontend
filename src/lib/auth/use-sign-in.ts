import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAccount, useEnsName, useSignMessage } from "wagmi";

interface UseCreateRequestOptions {
  onSuccess?: () => void;
}

export const useSignIn = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  const { signMessageAsync } = useSignMessage();

  const { data: ensName } = useEnsName({ address });

  return useMutation(
    async () => {
      if (!address) throw new Error("No address found");

      const res = await axios.get("/api/auth/nonce");
      const { nonce, message } = res.data;

      const signature = await signMessageAsync({
        message,
      });

      const res2 = await axios.post("/api/auth/sign-in", {
        address,
        ensLabel: ensName,
        signature,
        nonce,
      });
      const { token } = res2.data;

      localStorage.setItem("auth-token", token);
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
