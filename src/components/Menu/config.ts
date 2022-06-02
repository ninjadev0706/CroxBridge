import { MenuEntry } from "crox-new-uikit";

const config: MenuEntry[] = [
  {
    label: "Home",
    icon: "HomeIcon",
    href: "/",
  },
  {
    label: "Trade",
    icon: "TradeIcon",
    items: [
      //  {
      //    label: 'Exchange v1',
      //    href: 'https://exchange.croxswap.com/',
      //  },
      {
        label: "Exchange v2",
        href: "https://exchange.croxswap.com",
      },
      // {
      //   label: "Liquidity (Old) v1",
      //   href: "https://exchangev1.croxswap.com",
      // },
      {
        label: "Liquidity v2",
        href: "https://exchange.croxswap.com/#/pool",
      },
    ],
  },
  {
    label: "Farms",
    icon: "FarmIcon",
    href: "/farms",
  },
  {
    label: "Pools",
    icon: "PoolIcon",
    items: [
      {
        label: "CROX Pools",
        href: "/pools/crox",
      },
      {
        label: "RastaPools (Soon)",
        href: " ",
      },
    ],
  },
  {
    label: "Next-Gen Pools (Soon)",
    icon: "PoolIcon",
    href: "https://docs.croxswap.com/products/next-gen-pools",
  },
  {
    label: "Cross-Chain Bridge - (In progress)",
    icon: "CrossIcon",
    href: "#",
  },
  {
    label: "Techrate Audit",
    icon: "AuditIcon",
    href:
      "https://github.com/TechRate/Smart-Contract-Audits/blob/main/Crox%20Final.pdf",
  },
  {
    label: "Features",
    icon: "MoreIcon",
    items: [
      {
        label: "Harvest Locks",
        href:
          "https://docs.croxswap.com/features/harvest-locks",
      },
      {
        label: "Locked Staking (Soon)",
        href:
          "#",
      },
    ],
  },
  {
    label: "Charts",
    icon: "InfoIcon",
    items: [
      {
        label: "DexGuru",
        href:
          "https://dex.guru/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491-bsc",
      },
      {
        label: "BoggedFinance",
        href:
          "https://charts.bogged.finance/?token=0x2c094F5A7D1146BB93850f629501eB749f6Ed491",
      },
      {
        label: "PooCoin",
        href:
          "https://poocoin.app/tokens/0x2c094f5a7d1146bb93850f629501eb749f6ed491",
      },
      
    ],
  },
  {
    label: "Listings",
    icon: "NftIcon",
     items: [
      {
        label: "CoinMarketCap",
        href: "https://coinmarketcap.com/currencies/croxswap/",
      },
      {
        label: "CoinGecko",
        href:
          "https://www.coingecko.com/en/coins/croxswap",
      },
      {
        label: "Coinpaprika",
        href:
          "https://coinpaprika.com/coin/crox-croxswap/",
      },
       {
        label: "Pancakeswap",
        href:
          "https://pancakeswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491",
      },
      {
        label: "BscScan",
        href: "https://bscscan.com/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491",
      },
    ],
  },
  {
    label: "More",
    icon: "MoreIcon",
    items: [
      {
        label: "Docs",
        href: "https://docs.croxswap.com/",
      },
      {
        label: "Blog",
        href: "https://croxswap.medium.com",
      },
      {
        label: "Github",
        href: "https://github.com/croxswap",
      },
      
    ],
  },
];

export default config;
