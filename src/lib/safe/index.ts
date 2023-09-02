import {
  SafeMultisigTransactionListResponse,
  SignatureResponse,
} from "@safe-global/api-kit";
import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from "@safe-global/protocol-kit";
import {
  SafeMultisigTransactionResponse,
  SafeTransaction,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import { Provider } from "@wagmi/core";
import { ContractReceipt, ethers, Signer } from "ethers";
import { TransactionReceipt } from "web3-core";

import { getSafe, getSafeService } from "@lib/safe/utils";

export const deploySafe = async (
  signerOrProvider: Signer | Provider,
  addresses: string[],
): Promise<Safe> => {
  const ethAdapterOwner = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });
  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner });
  const safeAccountConfig: SafeAccountConfig = {
    owners: addresses,
    threshold: addresses.length / 2,
  };

  return await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce: Date.now().toString(),
  });
};

export const createTransaction = async (
  safeSdkOwner: Safe,
  to: string,
  data: string,
  amount?: string,
) => {
  const safeTransactionData: SafeTransactionDataPartial = {
    to,
    data,
    value: amount ? ethers.utils.parseUnits(amount, "ether").toString() : "0",
  };
  return await safeSdkOwner.createTransaction({ safeTransactionData });
};

export const proposeTransaction = async (
  signerOrProvider: Signer | Provider,
  safeSdkOwner: Safe,
  safeAddress: string,
  safeTx: SafeTransaction,
  senderAddress: string,
) => {
  const safeTxHash = await safeSdkOwner.getTransactionHash(safeTx);
  // Sign transaction to verify that the transaction is coming from owner 1
  const senderSignature = await safeSdkOwner.signTransactionHash(safeTxHash);
  const safeService = getSafeService(signerOrProvider);
  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTx.data,
    safeTxHash,
    senderAddress,
    senderSignature: senderSignature.data,
  });
  return safeTxHash;
};

export const confirmTransaction = async (
  safeTxHash: string,
  signerOrProvider: Signer | Provider,
  safeAddress: string,
): Promise<SignatureResponse> => {
  const safeSdkOwner = await getSafe(safeAddress, signerOrProvider);
  const safeService = getSafeService(signerOrProvider);

  const signature = await safeSdkOwner.signTransactionHash(safeTxHash);
  return await safeService.confirmTransaction(safeTxHash, signature.data);
};

export const executeTransaction = async (
  safeTxHash: string,
  signerOrProvider: Signer | Provider,
  safeAddress: string,
): Promise<TransactionReceipt | ContractReceipt | undefined> => {
  const safeService = getSafeService(signerOrProvider);
  const safeSdkOwner = await getSafe(safeAddress, signerOrProvider);
  const safeTransaction = await safeService.getTransaction(safeTxHash);
  const executeTxResponse = await safeSdkOwner.executeTransaction(
    safeTransaction,
  );
  return await executeTxResponse.transactionResponse?.wait();
};

export const getPendingTransactions = async (
  signerOrProvider: Signer | Provider,
  safeAddress: string,
): Promise<SafeMultisigTransactionListResponse> => {
  const safeService = getSafeService(signerOrProvider);
  return await safeService.getPendingTransactions(safeAddress);
};

export const getTransaction = async (
  signerOrProvider: Signer | Provider,
  txnHash: string,
): Promise<SafeMultisigTransactionResponse> => {
  const safeService = getSafeService(signerOrProvider);
  return await safeService.getTransaction(txnHash);
};
