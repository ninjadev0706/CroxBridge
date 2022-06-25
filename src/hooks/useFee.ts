import { useCallback, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { useFeeContract } from "./useContract";

const useFeePro = () => {
    const { account, chainId } = useWeb3React();
    const [feeAmount, setFeeAmount] = useState(0);
    const FeeTokenContract = useFeeContract(chainId);
    const handleFee = useCallback(async (tokenId) => {
        if (tokenId && FeeTokenContract) {
            try {
                FeeTokenContract.methods.tokens(tokenId).call((err, result) => {
                    if (!err) {
                        setFeeAmount(result.feePercent);
                    }
                })
            } catch (err) {
                return false;
            }
            return feeAmount;
        }
        return false;
    }, [chainId, FeeTokenContract, account]);

    return { onFeePro: handleFee, feeAmount };
};

export const useCharge = () => {
    const { account, chainId } = useWeb3React();
    const FeeTokenContract = useFeeContract(chainId);
    const handleCharge = useCallback(async (tokenId, sendAmount) => {
        if (tokenId && FeeTokenContract) {
            try {
                FeeTokenContract.methods
                    .chargeFee(tokenId, sendAmount)
                    .send({ from: account });
            } catch (err) {
                return false;
            }
            return true
        }
        return false;
    }, [chainId, FeeTokenContract, account]);

    return { onChargeFee: handleCharge };
}

export default useFeePro;
