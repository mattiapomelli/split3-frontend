import { Types, Utils } from "@requestnetwork/request-client.js";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { getRequestClient } from "./client";

// const network = "mumbai";
// const tokenAddress = "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23"; // USDC on Mumbai
const network = "goerli";
const tokenAddress = "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc"; // FAU on Goerli
const zeroAddress = "0x0000000000000000000000000000000000000000";

interface CreateRequestParams {
  payerAddress: string;
  receiverAddress: string;
  amount: string;
  reason: string;
}

const getCreateRequestParameters = ({
  payerAddress,
  receiverAddress,
  amount,
  reason,
}: CreateRequestParams): Types.ICreateRequestParameters => {
  return {
    requestInfo: {
      // The currency in which the request is denominated
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: tokenAddress,
        network: network,
      },

      // The expected amount as a string, in parsed units, respecting `decimals`
      // Consider using `parseUnits()` from ethers or viem
      expectedAmount: amount,

      // The payee identity. Not necessarily the same as the payment recipient.
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: receiverAddress,
      },

      // The payer identity. If omitted, any identity can pay the request.
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerAddress,
      },

      // The request creation timestamp.
      timestamp: Utils.getCurrentTimestampInSecond(),
    },

    // The paymentNetwork is the method of payment and related details.
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: network,
        paymentAddress: receiverAddress,
        feeAddress: zeroAddress,
        feeAmount: "0",
      },
    },

    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      reason,
      // dueDate: "2023.06.16",
    },

    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerAddress,
    },
  };
};

interface UseCreateRequestOptions {
  onSuccess?: (requestId: string) => void;
}

export const useCreateRequest = (options?: UseCreateRequestOptions) => {
  const { address } = useAccount();

  return useMutation(
    async ({
      amount,
      receiverAddress,
      payerAddress,
      reason,
    }: CreateRequestParams) => {
      if (!address) throw new Error("No address");

      const requestCreateParameters = getCreateRequestParameters({
        payerAddress,
        receiverAddress,
        amount,
        reason,
      });

      const requestClient = getRequestClient();
      const request = await requestClient.createRequest(
        requestCreateParameters,
      );

      return request.requestId;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
