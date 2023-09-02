import { NextResponse } from "next/server";
// import { Address, verifyMessage } from "viem";

import { createUser, getUserByAddress } from "../../../db/users";
import { getUserAuthToken } from "../utils";

export async function POST(req: Request) {
  const { address, ensLabel } = await req.json();

  // verify the signature
  // const message = buildMessage(nonce);

  // const isVerified = verifyMessage({
  //   address: address as Address,
  //   message,
  //   signature: signature as Address,
  // });

  // if (!isVerified) {
  //   return NextResponse.json(
  //     { error: { message: "Authentication Failed." } },
  //     { status: 500 },
  //   );
  // }

  const user = await getUserByAddress(address.toLowerCase());

  let userAddress: string = user?.address || "";
  let isNewUser = false;

  if (!user) {
    userAddress = await createUser({
      address: address.toLowerCase(),
      ens_label: ensLabel as string,
    });
    isNewUser = true;
  }

  const token = getUserAuthToken(userAddress.toLowerCase() as string);
  return NextResponse.json({ token, isNewUser });
}
