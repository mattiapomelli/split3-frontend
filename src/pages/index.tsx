import {
  approveErc20,
  hasErc20Approval,
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Types, Utils } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useAccount } from "wagmi";
// import { alchemyProvider } from "wagmi/providers/alchemy"

import { Button } from "@components/basic/button";
// import { env } from "env.mjs";

import type { NextPage } from "next";

const network = "goerli";
// const tokenAddress = "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23"; // USDC on Mumbai
const tokenAddress = "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc"; // FAU on Goerli
const zeroAddress = "0x0000000000000000000000000000000000000000";

interface CreateRequestParameters {
  payerAddress: string;
  receiverAddress: string;
  amount: string;
}

const getCreateRequestParameters = ({
  payerAddress,
  receiverAddress,
  amount,
}: CreateRequestParameters): Types.ICreateRequestParameters => {
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
      reason: "Debt Settlement!",
      // dueDate: "2023.06.16",
    },

    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerAddress,
    },
  };
};

const Home: NextPage = () => {
  const { address } = useAccount();
  const [requestId, setRequestId] = useState<string | null>(null);

  const getRequestClient = () => {
    const provider = window.ethereum;
    const web3SignatureProvider = new Web3SignatureProvider(provider);

    return new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://goerli.gateway.request.network/",
      },
      signatureProvider: web3SignatureProvider,
    });
  };

  const { data: requests } = useQuery({
    queryKey: ["requests", address],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      const requestClient = getRequestClient();
      const requests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address,
      });
      return requests.map((request) => request.getData());
    },
    enabled: !!address,
  });

  console.log("Requests", requests);

  const createRequest = async () => {
    if (!address) return;
    const requestClient = getRequestClient();

    const amount = ethers.utils.parseUnits("0.01", 6).toString();
    const requestCreateParameters = getCreateRequestParameters({
      payerAddress: address,
      receiverAddress: "0x0F45421E8DC47eF9edd8568a9D569b6fc7Aa7AC6",
      amount,
    });

    console.log("Creating request: ");
    const request = await requestClient.createRequest(requestCreateParameters);

    setRequestId(request.requestId);

    console.log("Request: ", request);
  };

  const onPayRequest = async (requestId: string) => {
    if (!address) return;

    const requestClient = getRequestClient();
    const request = await requestClient.fromRequestId(requestId);
    const requestData = request.getData();

    console.log("Request data: ", requestData);

    const payerHasSufficientFunds = await hasSufficientFunds(
      requestData,
      address,
      // {
      //   provider: provider,
      // },
    );

    console.log("Payer has sufficient funds: ", payerHasSufficientFunds);

    const payerHasErc20Approval = await hasErc20Approval(requestData, address);
    console.log("Payer has Erc20 approval: ", payerHasErc20Approval);

    if (!payerHasErc20Approval) {
      const approvalTx = await approveErc20(requestData);
      await approvalTx.wait();
    }

    const tx = await payRequest(requestData);
    await tx.wait();

    const request2 = await requestClient.fromRequestId(requestId);
    const requestData2 = request2.getData();

    console.log("Request data: ", requestData2);
  };

  return (
    <div>
      <Button onClick={createRequest}>Create request</Button>
      {requestId && (
        <div>
          <h3>Request id: {requestId}</h3>
          <Button onClick={() => onPayRequest(requestId)}>Pay request</Button>
        </div>
      )}
    </div>
  );
};

export default Home;
