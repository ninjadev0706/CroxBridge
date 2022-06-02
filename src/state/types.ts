import BigNumber from "bignumber.js";
import { FarmConfig, PoolConfig } from "config/constants/types";

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber;
  // quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber;
  lpTotalSupply?: BigNumber;
  lpBalance?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: number;
  depositFeeBP?: number;
  croxPerBlock?: number;
  userData?: {
    allowance: BigNumber;
    tokenBalance: BigNumber;
    stakedBalance: BigNumber;
    prevStakedBalance: BigNumber;
    earnings: BigNumber;
    nextHarvestUntil: number;
  };
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber;
  startBlock?: number;
  endBlock?: number;
  userData?: {
    allowance: BigNumber;
    stakingTokenBalance: BigNumber;
    stakedBalance: BigNumber;
    pendingReward: BigNumber;
  };
}

// Slices states

export interface FarmsState {
  data: Farm[];
}

export interface PoolsState {
  data: Pool[];
}

// Global state

export interface State {
  farms: FarmsState;
  pools: PoolsState;
  croxPools: FarmsState;
}
