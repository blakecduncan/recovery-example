import path from 'node:path';

export const NETWORKS = {
  localhost: {
    name: 'localhost',
    chainId: '31337',
    rpcUrl: 'http://localhost:8545',
    aggregatorUrl: 'http://localhost:3000',
    verificationGateway: '0x25499e61C26f08846Cc71caB34bB16cEd8Aa4aA3',
  },
  arbitrumGoerli: {
    chainId: '421613',
    name: 'Arbitrum Goerli',
    rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-goerli.blswallet.org',
    verificationGateway: '0xAf96d6e0817Ff8658f0E2a39b641920fA7fF0957',
  },
};

export const WALLETS_FILE_PATH = path.join('wallet-data', 'wallets.csv');

export const CURRENT_NETWORK = NETWORKS.arbitrumGoerli;
