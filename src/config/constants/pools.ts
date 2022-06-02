import contracts from "./contracts";
import { PoolConfig, QuoteToken, PoolCategory, FarmConfig } from "./types";

const pools: FarmConfig[] = [
  {
    pid: 15,
    risk: 5,
    lpSymbol: "CROX",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 0.25,
  },
  {
    pid: 16,
    risk: 5,
    lpSymbol: "WBNB",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 370,
  },
  {
    pid: 17,
    risk: 5,
    lpSymbol: "BUSD",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 1,
  },
  {
    pid: 18,
    risk: 5,
    lpSymbol: "ETH",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 2580,
  },
  {
    pid: 19,
    risk: 5,
    lpSymbol: "BTCB",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 39000,
  },
  {
    pid: 20,
    risk: 5,
    lpSymbol: "CAKE",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 17.35,
  },
  {
    pid: 21,
    risk: 5,
    lpSymbol: "USDT",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x55d398326f99059fF775485246999027B3197955",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 1,
  },
  {
    pid: 22,
    risk: 5,
    lpSymbol: "ADA",
    lpAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",
    },
    tokenSymbol: "",
    tokenAddresses: {
      97: "0xADE2948B4405289e85e697760BB42EED39A5733a",
      56: "0x3d34883c175Ba72dDa0108EA1A5faFD6Fa673DB6",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isTokenOnly: true,
    tokenPrice: 1.6,
  },
];

export default pools;
