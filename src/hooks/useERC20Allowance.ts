import { useCallback, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { ethers } from "ethers";
import { useERC20Contract, useERCContract } from "./useContract";
import { getBridgeFeeAddress } from "../utils/addressHelpers";

// Approve bridge

const useAllowance = () => {
    const { account, chainId } = useWeb3React();
    const [allowance, setAllowance] = useState(0);
    const FeeTokenContract = useERC20Contract(chainId);
    const handleAllowance = useCallback(async (address) => {
        if (address && chainId) {
            try {
                FeeTokenContract.methods.allowance(account, getBridgeFeeAddress(chainId))
                    .call((err, result) => {
                        if (!err) {
                            setAllowance(Number(ethers.utils.formatEther(result)));
                        }
                    })
            } catch (err) {
                return false;
            }
            return allowance;
        }
        return false;
    }, [chainId, FeeTokenContract]);

    return { onAllowance: handleAllowance, allowance };
};

export const useAnyAllowance = () => {
    const { account, chainId } = useWeb3React();
    const [anyAllowance, setAnyAllowance] = useState(0);
    const FeeTokenContract = useERCContract(chainId);
    const handleAllowance = useCallback(async (address) => {
        if (address && chainId) {
            try {
                FeeTokenContract.methods.allowance(account, address)
                    .call((err, result) => {
                        if (!err) {
                            setAnyAllowance(Number(ethers.utils.formatEther(result)));
                        }
                    })
            } catch (err) {
                return false;
            }
            return anyAllowance;
        }
        return false;
    }, [chainId, FeeTokenContract]);

    return { onAnyAllowance: handleAllowance, anyAllowance };
};

export default useAllowance;

