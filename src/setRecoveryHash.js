import { BlsWalletWrapper, Aggregator } from 'bls-wallet-clients';
import { ethers } from 'ethers';
import fetch from 'node-fetch';

import { readWalletsFromCsv, writeWalletsToCsv } from './helpers/utils.js';
import { CURRENT_NETWORK } from '../constants.js';

global.fetch = fetch;

setRecoveryHash();

async function setRecoveryHash() {
  const [walletZero, walletOne] = await readWalletsFromCsv();

  const recoverySalt = '0x626c616b65000000000000000000000000000000000000000000000000000000';

  walletZero.recoveryHash = await createRecoveryHash(
    walletZero.privateKey,
    walletOne.address,
    recoverySalt,
  );
  walletZero.recoverySalt = recoverySalt;

  await writeWalletsToCsv([walletZero, walletOne]);

  console.log('Recovery hash set!');
}

async function createRecoveryHash(walletZeroPk, recoveryAddress, salt) {
  const provider = new ethers.providers.JsonRpcProvider(CURRENT_NETWORK.rpcUrl);
  const { verificationGateway, aggregatorUrl } = CURRENT_NETWORK;

  const walletZero = await BlsWalletWrapper.connect(
    walletZeroPk,
    verificationGateway,
    provider,
  );
  const walletHash = walletZero.blsWalletSigner.getPublicKeyHash(walletZero.privateKey);

  const recoveryHash = ethers.utils.solidityKeccak256(
    ['address', 'bytes32', 'bytes32'],
    [recoveryAddress, walletHash, salt],
  );

  const BLSWalletContractABI = [
    'function setRecoveryHash(bytes32 hash) public',
  ];

  const BLSWalletContractInstance = new ethers.Contract(
    walletZero.address,
    BLSWalletContractABI,
  );

  const contractAddress = BLSWalletContractInstance.address;
  const encodedFunction = BLSWalletContractInstance.interface.encodeFunctionData(
    'setRecoveryHash',
    [recoveryHash],
  );

  const bundle = walletZero.sign({
    nonce: await walletZero.Nonce(),
    actions: [
      {
        ethValue: 0,
        contractAddress,
        encodedFunction,
      },
    ],
  });

  const agg = new Aggregator(aggregatorUrl);
  const result = await agg.add(bundle);

  if ('failures' in result) {
    throw new Error(JSON.stringify(result));
  }

  return recoveryHash;
}
