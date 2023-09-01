import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Types, Utils } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
// import { providers } from "ethers";
import React from "react";
import { useAccount } from "wagmi";
// import { alchemyProvider } from "wagmi/providers/alchemy";

import { Button } from "@components/basic/button";
// import { env } from "env.mjs";

import type { NextPage } from "next";

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
        value: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
        network: "goerli",
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
        paymentNetworkName: "goerli",
        paymentAddress: receiverAddress,
        feeAddress: zeroAddress,
        feeAmount: "0",
      },
    },

    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      reason: "Debt Settlement",
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

  const createRequest = async () => {
    if (!address) return;

    // let provider;
    // if (process.env.WEB3_PROVIDER_URL === undefined) {
    //   // Connect to Metamask and other injected wallets
    //   provider = new providers.Web3Provider(window.ethereum);
    // } else {
    //   // Connect to your own Ethereum node or 3rd party node provider
    //   provider = new providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
    // }
    // getDefaultProvider() won't work because it doesn't include a Signer.

    // const provider = alchemyProvider({
    //   apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    // });
    // const provider = new providers.JsonRpcProvider(
    //   `https://polygon-mumbai.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    // );
    const provider = window.ethereum;
    const web3SignatureProvider = new Web3SignatureProvider(provider);

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://goerli.gateway.request.network/",
      },
      signatureProvider: web3SignatureProvider,
    });

    const requestCreateParameters = getCreateRequestParameters({
      payerAddress: address,
      receiverAddress: "0x7eB023BFbAeE228de6DC5B92D0BeEB1eDb1Fd567",
      amount: "1000000000000000000",
    });
    const request = await requestClient.createRequest(requestCreateParameters);

    console.log("Request: ", request);
  };

  return (
    <div>
      <Button onClick={createRequest}>Create request</Button>
    </div>
  );
};

export default Home;
