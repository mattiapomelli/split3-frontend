import SafeApiKit from "@safe-global/api-kit";
import Safe, {EthersAdapter} from "@safe-global/protocol-kit";
import {Provider} from "@wagmi/core";
import {ethers, Signer} from "ethers";

const txServiceUrl = 'https://safe-transaction-goerli.safe.global'

export const getSafe = async (safeAddress: string, signerOrProvider: Signer | Provider): Promise<Safe> => {
    const ethAdapterOwner = new EthersAdapter({
        ethers,
        signerOrProvider: signerOrProvider
    })
    return await Safe.create({
        ethAdapter: ethAdapterOwner,
        safeAddress
    })
}

export const getSafeService = (signerOrProvider: Signer | Provider): SafeApiKit => {
    const ethAdapterOwner = new EthersAdapter({
        ethers,
        signerOrProvider: signerOrProvider
    })
    return new SafeApiKit({txServiceUrl, ethAdapter: ethAdapterOwner})
}