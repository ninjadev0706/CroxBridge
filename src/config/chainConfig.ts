export const chainConfig: Record<
    number,
    { providers: string[]; subgraph?: string; transactionManagerAddress?: string }
> = {
    '1': {
        providers: [
            'https://mainnet.infura.io/v3/e92c433ba7214537873fe0025ee0763c',
        ],
    },
    '4': {
        providers: ["https://rinkeby.infura.io/v3/e92c433ba7214537873fe0025ee0763c"]
    },
    '5': {
        providers: ["https://goerli.infura.io/v3/e92c433ba7214537873fe0025ee0763c"]
    },
    '56': {
        providers: [
            'https://bsc-dataseed1.binance.org',
            'https://bsc-dataseed2.binance.org',
            'https://bsc-dataseed3.binance.org',
            'https://bsc-dataseed4.binance.org',
            'https://bsc-dataseed1.defibit.io',
            'https://bsc-dataseed2.defibit.io',
            'https://bsc-dataseed3.defibit.io',
            'https://bsc-dataseed4.defibit.io',
            'https://bsc-dataseed1.ninicoin.io',
            'https://bsc-dataseed2.ninicoin.io',
            'https://bsc-dataseed3.ninicoin.io',
            'https://bsc-dataseed4.ninicoin.io',
        ],
    },
    '137': {
        providers: [
            'https://polygon-rpc.com/',
            'https://matic-mainnet.chainstacklabs.com',
            'https://rpc-mainnet.matic.quiknode.pro',
            'https://rpc-mainnet.matic.network',
        ],
    },
    '250': {
        providers: [
            "https://rpcapi.fantom.network",
            "https://rpc.fantom.network",
            "https://rpc2.fantom.network",
            "https://rpc3.fantom.network",
            "https://rpc.ankr.com/fantom",
            "https://rpc.ftm.tools",
        ],
    }
};

// arrays of "swap pools"
export type SwapConfig = {
    index: number;
    name: string;
    assets: { [chainId: number]: string };
};
export const swapConfig: SwapConfig[] = [
    {
        index: 0,
        name: 'ETH',
        assets: {
            '1': '0x0000000000000000000000000000000000000000',
            '56': '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            '137': '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            '250': '0x74b23882a30290451A17c44f4F05243b6b58C76d',
        },
    },
    {
        index: 1,
        name: 'USDC',
        assets: {
            '1': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '56': '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            '137': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            '250': '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
        },
    },
    {
        index: 2,
        name: 'USDT',
        assets: {
            '1': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            '56': '0x55d398326f99059fF775485246999027B3197955',
            '137': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            '250': '0x049d68029688eabf473097a2fc38ef61633a3c7a',
        },
    },
    {
        index: 3,
        name: 'CROX',
        assets: {
            '1': '',
            '56': '0x2c094F5A7D1146BB93850f629501eB749f6Ed491',
            '137': '0x381785593F9BAcE15aF908ac108b5f538155Ff3e',
            '250': '0x381785593F9BAcE15aF908ac108b5f538155Ff3e',
        },
    },
    {
        index: 4,
        name: 'TT',
        assets: {
            '4': '0xf1204930b284caBcD111cd8acC7DcC492EAdD40e',
            '5': '0xf1204930b284caBcD111cd8acC7DcC492EAdD40e',
        },
    },
    {
        index: 5,
        name: 'TEST',
        assets: {
            '4': '0x9aC2c46d7AcC21c881154D57c0Dc1c55a3139198',
            '5': '0x8a1Cad3703E0beAe0e0237369B4fcD04228d1682',
        },
    }
];
