import { useCallback } from "react";
import { useWeb3React } from '@web3-react/core'
import { Contract } from "web3-eth-contract";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { updateUserAllowance, fetchFarmUserDataAsync } from "state/actions";
import { approve } from "utils/callHelpers";
import { useMasterchef, useCake, useSousChef, useLottery } from "./useContract";
import { getErc20Contract } from "../utils/contractHelpers";
import { getBridgeFeeAddress } from "../utils/addressHelpers";


// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account);
      dispatch(fetchFarmUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const sousChefContract = useSousChef(sousId);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account);
      dispatch(updateUserAllowance(sousId, account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId]);

  return { onApprove: handleApprove };
};

// Approve the lottery
export const useLotteryApprove = () => {
  const { account } = useWeb3React();
  const cakeContract = useCake();
  const lotteryContract = useLottery();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account);
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, cakeContract, lotteryContract]);

  return { onApprove: handleApprove };
};

// Approve an IFO
export const useIfoApprove = (
  tokenContract: Contract,
  spenderAddress: string
) => {
  const { account } = useWeb3React();
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account });
      return tx;
    } catch {
      return false;
    }
  }, [account, spenderAddress, tokenContract]);

  return onApprove;
};

// Approve bridge
// export const useBridgeApprove = (chainID, amount) => {
//   const { account, library } = useWeb3React();
//   const FeeTokenContract = getErc20Contract(library.getSigner(), chainID);
//   const onApprove = useCallback(async () => {
//     try {
//       const tx = await FeeTokenContract
//         .approve(getBridgeFeeAddress[chainID], amount)
//         .send({ from: account });
//       return tx;
//     } catch {
//       return false;
//     }
//   }, []);

//   return onApprove;
// };