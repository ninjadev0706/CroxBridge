import BigNumber from "bignumber.js";
import erc20ABI from "config/abi/erc20.json";
import masterchefABI from "config/abi/masterchef.json";
import prevMasterchefABI from "config/abi/prevmasterchef.json";
import multicall from "utils/multicall";
import farmsConfig from "config/constants/farms";
import {
  getMasterChefAddress,
  getPrevMasterChefAddress,
} from "utils/addressHelpers";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

export const fetchFarmUserAllowances = async (account: string) => {
  const masterChefAdress = getMasterChefAddress();

  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly
      ? farm.tokenAddresses[CHAIN_ID]
      : farm.lpAddresses[CHAIN_ID];
    return {
      address: lpContractAddress,
      name: "allowance",
      params: [account, masterChefAdress],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserNextHarvestUntil = async (account: string) => {
  const masterChefAdress = getMasterChefAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "userInfo",
      params: [farm.pid, account],
    };
  });

  const rawNextHarvestUntil = await multicall(masterchefABI, calls);
  const parsedNextHarvestUntil = rawNextHarvestUntil.map((nextHarvestUntil) => {
    return new BigNumber(nextHarvestUntil[3]._hex).toJSON();
  });
  return parsedNextHarvestUntil;
};

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly
      ? farm.tokenAddresses[CHAIN_ID]
      : farm.lpAddresses[CHAIN_ID];
    return {
      address: lpContractAddress,
      name: "balanceOf",
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchFarmUserStakedBalances = async (account: string) => {
  const masterChefAdress = getMasterChefAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "userInfo",
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(masterchefABI, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchPrevFarmUserStakedBalances = async (account: string) => {
  const masterChefAdress = getPrevMasterChefAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "userInfo",
      params: [farm.pidv1 || 50, account],
    };
  });

  const rawStakedBalances = await multicall(prevMasterchefABI, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchFarmUserEarnings = async (account: string) => {
  const masterChefAdress = getMasterChefAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "pendingCrox",
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(masterchefABI, calls);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};
