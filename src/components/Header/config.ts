import { MenuEntry } from 'crox-new-uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
    //  {
    //    label: 'Exchange v1',
    //    href: 'https://exchange.croxswap.com/',
    //  },
      {
        label: 'Exchange v2',
        href: 'https://exchange.croxswap.com',
      },
      {
        label: 'Liquidity (Old) v1',
        href: 'https://exchangev1.croxswap.com',
      },
      {
        label: 'Liquidity v2',
        href: 'https://exchange.croxswap.com/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
  label: 'Pools',
  icon: 'PoolIcon',
  items:[
    {
    label: "Polaris",
    href: 'https://app.polarisdefi.io/supernovas'
  },
  {
      label: "RastaPools (Coming Soon)",
      href: ' '
    },
    {
      label: "CROX Pools (Coming Soon)",
      href: ' '
    },
  ],
},
  {
    label: 'Cross-Chain Bridge - (In progress)',
    icon: 'CrossIcon',
    href: '#',
  },
  {
    label: 'Techrate Audit',
    icon: 'AuditIcon',
    href: 'https://github.com/TechRate/Smart-Contract-Audits/blob/main/Crox.pdf',
  },
  {
    label: 'Charts',
    icon: 'InfoIcon',
    items: [
      {
        label: 'DexGuru',
        href: 'https://dex.guru/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491-bsc',
      },
      {
        label: 'BoggedFinance',
        href: 'https://charts.bogged.finance/?token=0x2c094F5A7D1146BB93850f629501eB749f6Ed491',
      },
      {
        label: 'PooCoin',
        href: 'https://poocoin.app/tokens/0x2c094f5a7d1146bb93850f629501eb749f6ed491',
      },
      {
        label: 'CoinMarketCap',
        href: 'https://coinmarketcap.com/currencies/croxswap/',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Whitepaper',
        href: 'https://docs.croxswap.com/',
      },
      {
        label: 'Blog',
        href: 'https://croxswap.medium.com',
      },
      {
        label: 'Github',
        href: 'https://github.com/croxswap',
      },
      {
        label: 'BscScan',
        href: 'https://www.bscscan.com',
      },
    ],
  },
]

export default config
