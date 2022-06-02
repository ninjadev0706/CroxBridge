import { ethers } from 'ethers';
import feeAbi from "config/abi/fee.json";
import erc20 from "config/abi/erc20.json";
import { getBridgeFeeAddress, getBridgeTokenAddress } from "./addressHelpers";

const ethSimpleProvider = ethers.getDefaultProvider('rinkeby');

export const getContract = (abi, address, signer) => {
    console.log(address, signer)
    const signerOrProvider = signer ? signer : ethSimpleProvider;
    return address ? new ethers.Contract(address, abi, signerOrProvider) : null;
};

export const getFeeContract = (signer, chainID) => {
    return getContract(feeAbi, getBridgeFeeAddress(chainID), signer);
};

export const getErc20Contract = (signer, chainID) => {
    return getContract(erc20, getBridgeTokenAddress(chainID), signer);
};
