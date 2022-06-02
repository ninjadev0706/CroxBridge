import { AbiItem } from "web3-utils";
import poolsConfig from "config/constants/pools";
import masterChefABI from "config/abi/masterchef.json";
import sousChefABI from "config/abi/sousChef.json";
import erc20ABI from "config/abi/erc20.json";
import { QuoteToken } from "config/constants/types";
import multicall from "utils/multicall";
import { getMasterChefAddress } from "utils/addressHelpers";
import { getWeb3 } from "utils/web3";
import BigNumber from "bignumber.js";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((p) => p.lpSymbol !== QuoteToken.BNB);
const bnbPools = poolsConfig.filter((p) => p.lpSymbol === QuoteToken.BNB);
const nonMasterPools = poolsConfig.filter((p) => p.pid !== 0);
const web3 = getWeb3();
const masterChefContract = new web3.eth.Contract(
  (masterChefABI as unknown) as AbiItem,
  getMasterChefAddress()
);

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((p) => ({
    address: p.lpAddresses[CHAIN_ID],
    name: "allowance",
    params: [account, p.tokenAddresses[CHAIN_ID]],
  }));

  const allowances = await multicall(erc20ABI, calls);
  return nonBnbPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.pid]: new BigNumber(allowances[index]).toJSON(),
    }),
    {}
  );
};

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((p) => ({
    address: p.lpSymbol,
    name: "balanceOf",
    params: [account],
  }));
  const tokenBalancesRaw = await multicall(erc20ABI, calls);
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.pid]: new BigNumber(tokenBalancesRaw[index]).toJSON(),
    }),
    {}
  );

  // BNB pools
  const bnbBalance = await web3.eth.getBalance(account);
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({
      ...acc,
      [pool.pid]: new BigNumber(bnbBalance).toJSON(),
    }),
    {}
  );

  return { ...tokenBalances, ...bnbBalances };
};

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: p.tokenAddresses[CHAIN_ID],
    name: "userInfo",
    params: [account],
  }));
  const userInfo = await multicall(sousChefABI, calls);
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.pid]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {}
  );

  // Cake / Cake pool
  const {
    amount: masterPoolAmount,
  } = await masterChefContract.methods.userInfo("0", account).call();

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount).toJSON() };
};

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: p.tokenAddresses[CHAIN_ID],
    name: "pendingReward",
    params: [account],
  }));
  const res = await multicall(sousChefABI, calls);
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.pid]: new BigNumber(res[index]).toJSON(),
    }),
    {}
  );

  // Cake / Cake pool
  const pendingReward = await masterChefContract.methods
    .pendingCrox("0", account)
    .call();

  return { ...pendingRewards, 0: new BigNumber(pendingReward).toJSON() };
};
