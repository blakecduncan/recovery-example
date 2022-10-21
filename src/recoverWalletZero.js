import { ethers } from 'ethers';
// eslint-disable-next-line camelcase
import { Aggregator, BlsWalletWrapper, VerificationGateway__factory } from 'bls-wallet-clients';
import { solidityPack } from 'ethers/lib/utils.js';

import fetch from 'node-fetch';

import { CURRENT_NETWORK } from '../constants.js';
import { generateRandomHex, readWalletsFromCsv } from './helpers/utils.js';

global.fetch = fetch;

recoverWalletZero();

async function recoverWalletZero() {
  const [walletZero, walletOne] = await readWalletsFromCsv();

  await recoverAccount(
    walletZero.address,
    walletZero.recoverySalt,
    walletOne.privateKey,
  );
}

async function recoverAccount(walletZeroAddress, walletZeroRecoverySalt, walletOnePrivateKey) {
  const provider = new ethers.providers.JsonRpcProvider(CURRENT_NETWORK.rpcUrl);
  const { verificationGateway, aggregatorUrl } = CURRENT_NETWORK;

  // Create new private key for wallet we are recovering to
  const walletTwoPrivateKey = generateRandomHex(256);
  console.log({ newPrivateKey: walletTwoPrivateKey });

  const addressSignature = await signWalletAddress(
    provider,
    walletZeroAddress,
    walletTwoPrivateKey,
  );
  // Get instance of the new wallet so we can get the public key
  // to pass to the recover wallet function
  const walletTwo = await BlsWalletWrapper.connect(
    walletTwoPrivateKey,
    verificationGateway,
    provider,
  );

  // Get the signer wallet to sign the transaction
  const walletOne = await BlsWalletWrapper.connect(
    walletOnePrivateKey,
    verificationGateway,
    provider,
  );

  // eslint-disable-next-line camelcase
  const verificationGatewayContract = VerificationGateway__factory.connect(
    verificationGateway,
    provider,
  );

  const walletZeroWalletHash = await verificationGatewayContract.hashFromWallet(
    walletZeroAddress,
  );

  console.log({ instantWalletHash: walletZeroWalletHash });
  const bundle = walletOne.sign({
    nonce: await walletOne.Nonce(),
    actions: [
      {
        ethValue: 0,
        contractAddress: verificationGatewayContract.address,
        encodedFunction:
          verificationGatewayContract.interface.encodeFunctionData(
            'recoverWallet',
            [
              addressSignature,
              walletZeroWalletHash,
              walletZeroRecoverySalt,
              walletTwo.PublicKey(),
            ],
          ),
      },
    ],
  });
  const agg = new Aggregator(aggregatorUrl);
  await agg.add(bundle);

  return walletTwo;
}

async function signWalletAddress(
  provider,
  senderAddr,
  signerPrivKey,
) {
  const addressMessage = solidityPack(['address'], [senderAddr]);
  const wallet = await BlsWalletWrapper.connect(
    signerPrivKey,
    CURRENT_NETWORK.verificationGateway,
    provider,
  );
  return wallet.signMessage(addressMessage);
}
