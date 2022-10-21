import path from 'node:path';

export const NETWORKS = {
  localhost: {
    name: 'localhost',
    chainId: '31337',
    rpcUrl: 'http://localhost:8545',
    aggregatorUrl: 'http://localhost:3000',
    verificationGateway: '0x25499e61C26f08846Cc71caB34bB16cEd8Aa4aA3',
  },
  arbitrumRinkeby: {
    chainId: '421611', // 42161
    name: 'Arbitrum Rinkeby',
    rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
    aggregatorUrl: 'https://arbitrum-testnet.blswallet.org',
    verificationGateway: '0xa15954659EFce154a3B45cE88D8158A02bE2049A',
  },
};

export const WALLETS_FILE_PATH = path.join('wallet-data', 'wallets.csv');

export const CURRENT_NETWORK = NETWORKS.localhost;
