// eslint-disable-next-line camelcase
import { BlsWalletWrapper, VerificationGateway__factory } from 'bls-wallet-clients';
import { ethers } from 'ethers';

import { CURRENT_NETWORK } from '../constants.js';
import { readWalletsFromCsv } from './helpers/utils.js';

checkWallet();

async function checkWallet() {
  const wallets = await readWalletsFromCsv();
  const checkingWallet = wallets[0];

  const provider = new ethers.providers.JsonRpcProvider(CURRENT_NETWORK.rpcUrl);

  const wallet = await BlsWalletWrapper.connect(
    checkingWallet.privateKey,
    CURRENT_NETWORK.verificationGateway,
    provider,
  );

  // eslint-disable-next-line camelcase
  const verificationGateway = VerificationGateway__factory.connect(
    CURRENT_NETWORK.verificationGateway,
    provider,
  );

  const { blsWalletSigner } = wallet;
  const address = await verificationGateway.walletFromHash(
    blsWalletSigner.getPublicKeyHash(checkingWallet.privateKey),
  );

  try {
    console.log('recovery hash: ', await wallet.walletContract.recoveryHash());
  } catch (e) {
    console.log('recovery hash: none');
  }
  console.log('Deterministic Wallet address - ', wallet.address);
  try {
    console.log('Wallet from hash address - ', address);
  } catch (e) {
    console.log('Wallet from hash address - not deployed');
  }
}
