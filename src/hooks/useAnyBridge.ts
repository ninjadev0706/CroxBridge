import { useCallback, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { useAnyBridgeData, useRouterData } from './api';
import { useAnyRouterContract } from "./useContract";

const useAnyBridge = (address: string | null) => {
    const { account, chainId } = useWeb3React();
    const [txHaxhId, setTxHash] = useState(0);
    const AnyRouterContract = useAnyRouterContract(address);

    const handleApprove = useCallback(async (anyToken, toAddress, amount, toChainID) => {
        if (AnyRouterContract && chainId) {
            console.log("AnyRouterContract => ", AnyRouterContract, anyToken, toAddress, amount, toChainID)
            try {
                const tx = await AnyRouterContract.methods
                    .anySwapOutUnderlying(anyToken, toAddress, amount, toChainID)
                    .send({ from: account });
                setTxHash(tx);
                return tx;
            } catch (err) {
                return false;
            }
        }
        return false;
    }, [AnyRouterContract]);

    return { onAnyBridge: handleApprove, txHaxhId };
};

export default useAnyBridge;