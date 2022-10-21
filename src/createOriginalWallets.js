import { BlsWalletWrapper } from 'bls-wallet-clients';
import { ethers } from 'ethers';
import chalk from 'chalk';

import { generateRandomHex, writeWalletsToCsv } from './helpers/utils.js';
import { CURRENT_NETWORK } from '../constants.js';

async function createWallets() {
  // Generate a new random private keys
  const walletZeroPK = generateRandomHex(256);
  const walletOnePK = generateRandomHex(256);

  const provider = new ethers.providers.JsonRpcProvider(CURRENT_NETWORK.rpcUrl);

  // Get the addresses from the above private keys

  // Wallet zeros is the wallet that we will recover (i.e. the wallet that 'lost' it's private key)
  const walletZeroAddress = await BlsWalletWrapper.Address(
    walletZeroPK,
    CURRENT_NETWORK.verificationGateway,
    provider,
  );

  // Wallet one is the trusted wallet that will recover wallet zero to a new private key
  const walletOneAddress = await BlsWalletWrapper.Address(
    walletOnePK,
    CURRENT_NETWORK.verificationGateway,
    provider,
  );

  // Save the new wallets to a csv for later reference
  const wallets = [
    {
      privateKey: walletZeroPK,
      address: walletZeroAddress,
      recoveryHash: '',
      recoverySalt: '',
    },
    {
      privateKey: walletOnePK,
      address: walletOneAddress,
      recoveryHash: '',
      recoverySalt: '',
    },
  ];

  console.log(
    chalk.blue.bold(`Wallet zero address: ${walletZeroAddress}`),
  );
  console.log(
    chalk.blue.bold(`Wallet one address: ${walletOneAddress}`),
  );

  await writeWalletsToCsv(wallets);

  console.log('Wallets created!');
}

createWallets();

export default createWallets;
