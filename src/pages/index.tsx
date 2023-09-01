import { ethers } from "ethers";
import React, { useState } from "react";

import { Button } from "@components/basic/button";
import { useCreateRequest } from "@lib/request-network/use-create-request";
import { usePayRequest } from "@lib/request-network/use-pay-request";
import { useUserRequests } from "@lib/request-network/use-user-requests";

import type { NextPage } from "next";

const Home: NextPage = () => {
  const [requestId, setRequestId] = useState<string | null>(null);

  const { data: requests } = useUserRequests();

  console.log("Requests", requests);

  const { mutate: createRequest, isLoading: isCreateLoading } =
    useCreateRequest({
      onSuccess(requestId) {
        setRequestId(requestId);
      },
    });

  const { mutate: payRequest, isLoading: isPayLoading } = usePayRequest();

  return (
    <div>
      <Button
        loading={isCreateLoading}
        disabled={isCreateLoading}
        onClick={() =>
          createRequest({
            amount: ethers.utils.parseUnits("0.01", 6).toString(),
            receiverAddress: "0x0F45421E8DC47eF9edd8568a9D569b6fc7Aa7AC6",
          })
        }
      >
        Create request
      </Button>
      {requestId && (
        <div>
          <h3>Request id: {requestId}</h3>
          <Button
            onClick={() => payRequest({ requestId })}
            loading={isPayLoading}
            disabled={isPayLoading}
          >
            Pay request
          </Button>
        </div>
      )}
      <div className="mt-6">
        <h3 className="mb-4 text-2xl font-bold">Requests</h3>
        <div className="flex flex-col gap-4">
          {requests?.map((request) => (
            <div key={request.requestId}>
              <p>{request.requestId}</p>

              <p>{request.balance?.balance}</p>

              <p>{request.contentData.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
