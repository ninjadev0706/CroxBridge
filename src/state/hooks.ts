import BigNumber from "bignumber.js";
import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import useRefresh from "hooks/useRefresh";
import {
  fetchFarmsPublicDataAsync,
  fetchCroxPoolsPublicDataAsync,
  // fetchPoolsPublicDataAsync,
  // fetchPoolsUserDataAsync,
} from "./actions";
import { State, Farm, Pool } from "./types";
import { QuoteToken } from "../config/constants/types";

const ZERO = new BigNumber(0);

export const useFetchPublicData = () => {
  const dispatch = useDispatch();
  // const { slowRefresh } = useRefresh();
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync());
    dispatch(fetchCroxPoolsPublicDataAsync());
    // dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch]);
};

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// CroxPools

export const useCroxPools = (): Farm[] => {
  const farms = useSelector((state: State) => state.croxPools.data);
  return farms;
};

export const useCroxPoolFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.croxPools.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useCroxPoolFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.croxPools.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useCroxPoolUser = (pid) => {
  const farm = useCroxPoolFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh();
  const dispatch = useDispatch();
  useEffect(() => {
    if (account) {
      // dispatch(fetchPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const pools = useSelector((state: State) => state.pools.data);
  return pools;
};

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) =>
    state.pools.data.find((p) => p.sousId === sousId)
  );
  return pool;
};

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 4; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCroxBnb = (): BigNumber => {
  const pid = 0; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCakeBusd = (): BigNumber => {
  const bnbPrice = usePriceBnbBusd();
  const cakeInBnb = usePriceCroxBnb();
  return bnbPrice.times(cakeInBnb);
};

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const croxPools = useCroxPools();
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = bnbPrice.times(farm.lpTotalInQuoteToken);
      } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        val = cakePrice.times(farm.lpTotalInQuoteToken);
      } else {
        val = farm.lpTotalInQuoteToken;
      }
      value = value.plus(val);
    }
  }
  for (let i = 0; i < croxPools.length; i++) {
    const croxPool = croxPools[i];
    if (croxPool.lpTotalInQuoteToken) {
      value = value.plus(croxPool.lpTotalInQuoteToken);
    }
  }
  return value;
};
